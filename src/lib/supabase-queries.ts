import { supabase } from "./supabase";
import type { Database, Tables, TablesInsert, TablesUpdate } from "@/types/database";

export type Customer = Tables<"customers">;
export type CustomerInsert = TablesInsert<"customers">;
export type CustomerUpdate = TablesUpdate<"customers">;

export type Tenant = Tables<"tenants">;
export type TenantInsert = TablesInsert<"tenants">;
export type TenantUpdate = TablesUpdate<"tenants">;

export type Branch = Tables<"branches">;
export type BranchInsert = TablesInsert<"branches">;
export type BranchUpdate = TablesUpdate<"branches">;

export async function fetchCustomers(tenantId: string | null) {
  let query = supabase.from("customers").select("*").order("nombre");
  if (tenantId) query = query.eq("tenant_id", tenantId);
  const { data, error } = await query;
  if (error) throw error;
  return data ?? [];
}

export async function fetchCustomer(id: string, tenantId: string | null) {
  let query = supabase.from("customers").select("*").eq("id", id);
  if (tenantId) query = query.eq("tenant_id", tenantId);
  const { data, error } = await query.single();
  if (error) throw error;
  return data;
}

export async function createCustomer(input: CustomerInsert) {
  const { data, error } = await supabase.from("customers").insert(input).select().single();
  if (error) throw error;
  return data;
}

export async function updateCustomer(id: string, input: CustomerUpdate) {
  const { data, error } = await supabase
    .from("customers")
    .update({ ...input, updated_at: new Date().toISOString() })
    .eq("id", id)
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function deleteCustomer(id: string) {
  const { error } = await supabase.from("customers").delete().eq("id", id);
  if (error) throw error;
}

export async function fetchTenants() {
  const { data, error } = await supabase.from("tenants").select("*").order("nombre");
  if (error) throw error;
  return data ?? [];
}

export async function fetchTenant(id: string) {
  const { data, error } = await supabase.from("tenants").select("*").eq("id", id).single();
  if (error) throw error;
  return data;
}

export async function createTenant(input: TenantInsert) {
  const { data, error } = await supabase.from("tenants").insert(input).select().single();
  if (error) throw error;
  return data;
}

export async function updateTenant(id: string, input: TenantUpdate) {
  const { data, error } = await supabase
    .from("tenants")
    .update(input)
    .eq("id", id)
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function deleteTenant(id: string) {
  const { error } = await supabase.from("tenants").delete().eq("id", id);
  if (error) throw error;
}

export async function fetchBranchesByTenant(tenantId: string) {
  const { data, error } = await supabase
    .from("branches")
    .select("*")
    .eq("tenant_id", tenantId)
    .order("nombre");
  if (error) throw error;
  return data ?? [];
}

export async function countCustomersByTenant(tenantId: string) {
  const { count, error } = await supabase
    .from("customers")
    .select("*", { count: "exact", head: true })
    .eq("tenant_id", tenantId);
  if (error) throw error;
  return count ?? 0;
}

export async function countEventsByTenant(tenantId: string) {
  const { count, error } = await supabase
    .from("events")
    .select("*", { count: "exact", head: true })
    .eq("tenant_id", tenantId);
  if (error) throw error;
  return count ?? 0;
}

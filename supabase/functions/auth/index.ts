import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "jsr:@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const { email, password, tenant_name, user_name } = await req.json();

    if (!email || !password || !tenant_name || !user_name) {
      return new Response(
        JSON.stringify({ error: "email, password, tenant_name y user_name son requeridos" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const supabaseAdmin = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
      { auth: { autoRefreshToken: false, persistSession: false } }
    );

    const tenantSlug = tenant_name
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "");

    const { data: tenant, error: tenantError } = await supabaseAdmin
      .from("tenants")
      .insert({ nombre: tenant_name, slug: tenantSlug })
      .select()
      .single();

    if (tenantError) {
      return new Response(
        JSON.stringify({ error: `Error al crear tenant: ${tenantError.message}` }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const { data: branch, error: branchError } = await supabaseAdmin
      .from("branches")
      .insert({ tenant_id: tenant.id, nombre: "Principal" })
      .select()
      .single();

    if (branchError) {
      await supabaseAdmin.from("tenants").delete().eq("id", tenant.id);
      return new Response(
        JSON.stringify({ error: `Error al crear sucursal: ${branchError.message}` }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const { data: role, error: roleError } = await supabaseAdmin
      .from("roles")
      .select("id")
      .eq("nombre", "admin")
      .is("tenant_id", null)
      .single();

    if (roleError) {
      return new Response(
        JSON.stringify({ error: `Rol admin no encontrado: ${roleError.message}` }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const { data: authUser, error: authError } = await supabaseAdmin.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      user_metadata: {
        tenant_id: tenant.id,
        tenant_slug: tenantSlug,
      },
    });

    if (authError) {
      await supabaseAdmin.from("branches").delete().eq("id", branch.id);
      await supabaseAdmin.from("tenants").delete().eq("id", tenant.id);
      return new Response(
        JSON.stringify({ error: `Error al crear usuario: ${authError.message}` }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const { error: profileError } = await supabaseAdmin.from("profiles").insert({
      id: authUser.user.id,
      nombre: user_name,
      email,
    });

    if (profileError) {
      await supabaseAdmin.auth.admin.deleteUser(authUser.user.id);
      await supabaseAdmin.from("branches").delete().eq("id", branch.id);
      await supabaseAdmin.from("tenants").delete().eq("id", tenant.id);
      return new Response(
        JSON.stringify({ error: `Error al crear perfil: ${profileError.message}` }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const { error: ubrError } = await supabaseAdmin.from("user_branch_roles").insert({
      user_id: authUser.user.id,
      branch_id: branch.id,
      role_id: role.id,
    });

    if (ubrError) {
      await supabaseAdmin.from("profiles").delete().eq("id", authUser.user.id);
      await supabaseAdmin.auth.admin.deleteUser(authUser.user.id);
      await supabaseAdmin.from("branches").delete().eq("id", branch.id);
      await supabaseAdmin.from("tenants").delete().eq("id", tenant.id);
      return new Response(
        JSON.stringify({ error: `Error al asignar rol: ${ubrError.message}` }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    return new Response(
      JSON.stringify({
        user_id: authUser.user.id,
        tenant_id: tenant.id,
        tenant_slug: tenantSlug,
        branch_id: branch.id,
      }),
      { status: 201, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (err) {
    return new Response(
      JSON.stringify({ error: err instanceof Error ? err.message : "Error interno" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});

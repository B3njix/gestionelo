import { createServerFn } from "@tanstack/react-start";
import { createClient } from "@supabase/supabase-js";
import type { Database } from "@/types/database";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;

export const loginFn = createServerFn({ method: "POST" })
  .validator((data: unknown) => {
    if (typeof data !== "object" || data === null) throw new Error("Datos inválidos");
    const d = data as Record<string, unknown>;
    if (typeof d.email !== "string" || typeof d.password !== "string") {
      throw new Error("Email y password requeridos");
    }
    return { email: d.email, password: d.password };
  })
  .handler(async ({ data }) => {
    const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey);

    const { data: authData, error } = await supabase.auth.signInWithPassword({
      email: data.email,
      password: data.password,
    });

    if (error) throw new Error(error.message);
    if (!authData.session) throw new Error("No se pudo iniciar sesión");

    const { data: profile } = await supabase
      .from("profiles")
      .select("id, nombre, email")
      .eq("id", authData.user.id)
      .single();

    const tenantId = authData.user.user_metadata?.tenant_id as string | undefined;

    return {
      access_token: authData.session.access_token,
      refresh_token: authData.session.refresh_token,
      expires_at: authData.session.expires_at,
      user: {
        id: authData.user.id,
        email: authData.user.email,
        nombre: profile?.nombre ?? authData.user.email,
        tenant_id: tenantId ?? null,
      },
    };
  });

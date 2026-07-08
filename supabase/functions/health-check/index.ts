import { createClient } from "jsr:@supabase/supabase-js@2";

const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
const supabaseServiceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

const supabase = createClient(supabaseUrl, supabaseServiceRoleKey);

Deno.serve(async () => {
  try {
    const { data, error } = await supabase.rpc("health_check");

    if (error) throw error;

    return new Response(
      JSON.stringify({ status: "ok", timestamp: new Date().toISOString(), db: data }),
      { headers: { "Content-Type": "application/json" } }
    );
  } catch (err) {
    const message = err instanceof Error ? err.message : "unknown error";
    return new Response(
      JSON.stringify({ status: "error", timestamp: new Date().toISOString(), error: message }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
});

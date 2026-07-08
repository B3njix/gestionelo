import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { useRouter } from "@tanstack/react-router";
import { supabase } from "@/lib/supabase";
import type { User, Session } from "@supabase/supabase-js";

type UserRole = {
  role_id: string;
  role_name: string;
  branch_id: string | null;
};

type AuthState = {
  session: Session | null;
  user: User | null;
  loading: boolean;
  tenantId: string | null;
  isSuperAdmin: boolean;
  roles: UserRole[];
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthState>({
  session: null,
  user: null,
  loading: true,
  tenantId: null,
  isSuperAdmin: false,
  roles: [],
  signOut: async () => {},
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const router = useRouter();
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [roles, setRoles] = useState<UserRole[]>([]);
  const [fetchingRoles, setFetchingRoles] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      if (!session?.user) {
        setLoading(false);
      }
    });

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
      setRoles([]);
      if (!session?.user) {
        setLoading(false);
      }
    });

    return () => listener.subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (!user) {
      setRoles([]);
      setLoading(false);
      return;
    }
    setFetchingRoles(true);
    supabase
      .from("user_branch_roles")
      .select("role_id, branch_id, roles!inner(nombre)")
      .eq("user_id", user.id)
      .eq("activo", true)
      .then(({ data }) => {
        setRoles(
          (data ?? []).map((r) => ({
            role_id: r.role_id,
            role_name: (r.roles as unknown as { nombre: string }).nombre,
            branch_id: r.branch_id,
          })),
        );
        setFetchingRoles(false);
        setLoading(false);
      });
  }, [user]);

  const isSuperAdmin = roles.some(
    (r) => r.role_name === "super_admin" && r.branch_id === null,
  );

  const tenantId = isSuperAdmin
    ? null
    : ((user?.user_metadata?.tenant_id as string) ?? null);

  const signOut = async () => {
    await supabase.auth.signOut();
    setSession(null);
    setUser(null);
    setRoles([]);
    router.navigate({ to: "/login" });
  };

  return (
    <AuthContext value={{ session, user, loading: loading || fetchingRoles, tenantId, isSuperAdmin, roles, signOut }}>{children}</AuthContext>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}

export function useRequireAuth() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const currentPath = router.state.location.pathname;

  useEffect(() => {
    if (!loading && !user && currentPath !== "/login") {
      router.navigate({ to: "/login" });
    }
  }, [loading, user, currentPath, router]);

  return { user, loading };
}

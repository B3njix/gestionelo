import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { PageHeader } from "@/components/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, Building2, Users, CalendarDays } from "lucide-react";
import { fetchTenants, countCustomersByTenant, countEventsByTenant } from "@/lib/supabase-queries";

export const Route = createFileRoute("/admin/")({
  head: () => ({ meta: [{ title: "Administración — Gestionelo" }] }),
  component: AdminDashboard,
});

function AdminDashboard() {
  const {
    data: tenants = [],
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["admin", "tenants"],
    queryFn: fetchTenants,
  });

  const activos = tenants.filter((t) => t.activo).length;
  const inactivos = tenants.length - activos;

  return (
    <div>
      <PageHeader
        title="Administración"
        description={`Panorama general del sistema. ${tenants.length} tenants registrados.`}
      />
      <div className="space-y-6 p-4 sm:p-6 lg:p-8">
        {isLoading ? (
          <div className="flex items-center justify-center py-16">
            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
          </div>
        ) : isError ? (
          <div className="flex flex-col items-center justify-center py-16">
            <p className="text-sm text-destructive">Error al cargar datos</p>
          </div>
        ) : (
          <>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              <Card className="shadow-sm">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    Tenants
                  </CardTitle>
                  <Building2 className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <p className="text-2xl font-bold">{tenants.length}</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {activos} activos, {inactivos} inactivos
                  </p>
                </CardContent>
              </Card>
              <Card className="shadow-sm">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    Clientes totales
                  </CardTitle>
                  <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <TenantAggregateCount
                    label="clientes"
                    fetcher={countCustomersByTenant}
                    tenants={tenants}
                  />
                </CardContent>
              </Card>
              <Card className="shadow-sm">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    Eventos totales
                  </CardTitle>
                  <CalendarDays className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <TenantAggregateCount
                    label="eventos"
                    fetcher={countEventsByTenant}
                    tenants={tenants}
                  />
                </CardContent>
              </Card>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

function TenantAggregateCount({
  tenants,
  fetcher,
}: {
  label: string;
  tenants: { id: string }[];
  fetcher: (tenantId: string) => Promise<number>;
}) {
  const { data: total, isLoading } = useQuery({
    queryKey: ["admin", "aggregate", tenants.map((t) => t.id)],
    queryFn: async () => {
      const counts = await Promise.all(tenants.map((t) => fetcher(t.id)));
      return counts.reduce((a, b) => a + b, 0);
    },
    enabled: tenants.length > 0,
  });

  if (isLoading) return <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />;
  return <p className="text-2xl font-bold">{total ?? 0}</p>;
}

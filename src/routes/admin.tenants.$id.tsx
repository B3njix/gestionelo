import { createFileRoute, useParams, useNavigate } from "@tanstack/react-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { PageHeader } from "@/components/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Loader2, ArrowLeft } from "lucide-react";
import { TenantForm, type TenantFormValues } from "@/components/tenant-form";
import {
  fetchTenant,
  updateTenant,
  fetchBranchesByTenant,
  type Branch,
} from "@/lib/supabase-queries";
import { toast } from "sonner";

export const Route = createFileRoute("/admin/tenants/$id")({
  head: () => ({ meta: [{ title: "Editar Tenant — Gestionelo" }] }),
  component: EditTenantPage,
});

function EditTenantPage() {
  const { id } = useParams({ from: "/admin/tenants/$id" });
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const {
    data: tenant,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["admin", "tenants", id],
    queryFn: () => fetchTenant(id),
  });

  const { data: branches = [], isLoading: branchesLoading } = useQuery({
    queryKey: ["admin", "branches", id],
    queryFn: () => fetchBranchesByTenant(id),
  });

  const mutation = useMutation({
    mutationFn: (values: TenantFormValues) =>
      updateTenant(id, { nombre: values.nombre, slug: values.slug, activo: values.activo }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "tenants"] });
      queryClient.invalidateQueries({ queryKey: ["admin", "tenants", id] });
      toast.success("Tenant actualizado exitosamente");
    },
    onError: (err) => {
      toast.error(err instanceof Error ? err.message : "Error al actualizar tenant");
    },
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-16">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (isError || !tenant) {
    return (
      <div className="flex flex-col items-center justify-center py-16 gap-4">
        <p className="text-sm text-destructive">Tenant no encontrado</p>
        <Button asChild variant="outline">
          <a href="/admin/tenants">Volver a tenants</a>
        </Button>
      </div>
    );
  }

  return (
    <div>
      <PageHeader
        title={tenant.nombre}
        description={`Slug: ${tenant.slug}`}
        actions={
          <Button variant="outline" onClick={() => navigate({ to: "/admin/tenants" })}>
            <ArrowLeft className="h-4 w-4" /> Volver
          </Button>
        }
      />
      <div className="space-y-6 p-4 sm:p-6 lg:p-8">
        <Card className="shadow-sm max-w-xl">
          <CardContent className="p-6">
            <TenantForm
              defaultValues={{
                nombre: tenant.nombre,
                slug: tenant.slug,
                activo: tenant.activo,
              }}
              onSubmit={(values) => mutation.mutate(values)}
              isLoading={mutation.isPending}
              submitLabel="Guardar Cambios"
            />
          </CardContent>
        </Card>

        <Card className="shadow-sm max-w-xl">
          <CardHeader>
            <CardTitle className="text-base">Sucursales</CardTitle>
          </CardHeader>
          <CardContent>
            {branchesLoading ? (
              <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
            ) : branches.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                No hay sucursales registradas para este tenant.
              </p>
            ) : (
              <div className="space-y-2">
                {branches.map((b) => (
                  <div
                    key={b.id}
                    className="flex items-center justify-between rounded-lg border p-3 text-sm"
                  >
                    <div>
                      <p className="font-medium">{b.nombre}</p>
                      {b.direccion && (
                        <p className="text-xs text-muted-foreground">{b.direccion}</p>
                      )}
                    </div>
                    <Badge variant={b.activo ? "default" : "secondary"}>
                      {b.activo ? "Activo" : "Inactivo"}
                    </Badge>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

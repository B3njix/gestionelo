import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { PageHeader } from "@/components/page-header";
import { Card, CardContent } from "@/components/ui/card";
import { TenantForm, type TenantFormValues } from "@/components/tenant-form";
import { createTenant } from "@/lib/supabase-queries";
import { toast } from "sonner";

export const Route = createFileRoute("/admin/tenants/nuevo")({
  head: () => ({ meta: [{ title: "Nuevo Tenant — Gestionelo" }] }),
  component: NewTenantPage,
});

function NewTenantPage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (values: TenantFormValues) =>
      createTenant({ nombre: values.nombre, slug: values.slug, activo: values.activo }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "tenants"] });
      toast.success("Tenant creado exitosamente");
      navigate({ to: "/admin/tenants" });
    },
    onError: (err) => {
      toast.error(err instanceof Error ? err.message : "Error al crear tenant");
    },
  });

  return (
    <div>
      <PageHeader title="Nuevo Tenant" description="Registrá una nueva empresa en la plataforma." />
      <div className="p-4 sm:p-6 lg:p-8">
        <Card className="shadow-sm max-w-xl">
          <CardContent className="p-6">
            <TenantForm
              onSubmit={(values) => mutation.mutate(values)}
              onCancel={() => navigate({ to: "/admin/tenants" })}
              isLoading={mutation.isPending}
              submitLabel="Crear Tenant"
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

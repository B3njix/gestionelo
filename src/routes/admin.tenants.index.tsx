import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { PageHeader } from "@/components/page-header";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Search, Plus, Loader2, Pencil, Trash2 } from "lucide-react";
import { fetchTenants, deleteTenant, type Tenant } from "@/lib/supabase-queries";
import { formatDate } from "@/lib/format";

export const Route = createFileRoute("/admin/tenants/")({
  head: () => ({ meta: [{ title: "Tenants — Gestionelo" }] }),
  component: TenantsPage,
});

function TenantsPage() {
  const queryClient = useQueryClient();
  const [query, setQuery] = useState("");
  const [deleteTarget, setDeleteTarget] = useState<Tenant | null>(null);

  const {
    data: tenants = [],
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["admin", "tenants"],
    queryFn: fetchTenants,
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => deleteTenant(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "tenants"] });
      setDeleteTarget(null);
    },
  });

  const filtered = tenants.filter(
    (t) =>
      !query ||
      t.nombre.toLowerCase().includes(query.toLowerCase()) ||
      t.slug.toLowerCase().includes(query.toLowerCase()),
  );

  return (
    <div>
      <PageHeader
        title="Tenants"
        description={`${tenants.length} empresas registradas en la plataforma.`}
        actions={
          <Button asChild style={{ background: "var(--gradient-primary)" }}>
            <Link to="/admin/tenants/nuevo">
              <Plus className="h-4 w-4" /> Nuevo Tenant
            </Link>
          </Button>
        }
      />
      <div className="space-y-4 p-4 sm:p-6 lg:p-8">
        <Card className="shadow-sm">
          <CardContent className="p-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Buscar por nombre o slug..."
                className="pl-9"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-sm overflow-hidden">
          {isLoading ? (
            <div className="flex items-center justify-center py-16">
              <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
            </div>
          ) : isError ? (
            <div className="flex flex-col items-center justify-center py-16">
              <p className="text-sm text-destructive">Error al cargar tenants</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nombre</TableHead>
                  <TableHead className="hidden sm:table-cell">Slug</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead className="hidden md:table-cell">Creado</TableHead>
                  <TableHead className="w-[80px]" />
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map((t) => (
                  <TableRow key={t.id}>
                    <TableCell>
                      <p className="font-medium">{t.nombre}</p>
                    </TableCell>
                    <TableCell className="hidden sm:table-cell text-sm text-muted-foreground">
                      {t.slug}
                    </TableCell>
                    <TableCell>
                      <Badge variant={t.activo ? "default" : "secondary"}>
                        {t.activo ? "Activo" : "Inactivo"}
                      </Badge>
                    </TableCell>
                    <TableCell className="hidden md:table-cell text-sm text-muted-foreground">
                      {t.created_at ? formatDate(t.created_at) : "—"}
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-1">
                        <Button variant="ghost" size="icon" asChild>
                          <Link to="/admin/tenants/$id" params={{ id: t.id }}>
                            <Pencil className="h-3.5 w-3.5" />
                          </Link>
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => setDeleteTarget(t)}
                          disabled={deleteMutation.isPending}
                        >
                          <Trash2 className="h-3.5 w-3.5 text-destructive" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
                {filtered.length === 0 && !isLoading && (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                      {tenants.length === 0
                        ? "No hay tenants registrados."
                        : "No se encontraron tenants."}
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          )}
        </Card>
      </div>

      <AlertDialog open={!!deleteTarget} onOpenChange={(o) => !o && setDeleteTarget(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Eliminar tenant?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta acción no se puede deshacer. Se eliminará permanentemente el tenant{" "}
              <strong>{deleteTarget?.nombre}</strong> y todos sus datos asociados (clientes,
              eventos, productos, etc.).
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={deleteMutation.isPending}>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => deleteTarget && deleteMutation.mutate(deleteTarget.id)}
              disabled={deleteMutation.isPending}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {deleteMutation.isPending ? "Eliminando..." : "Eliminar"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

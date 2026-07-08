import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/hooks/use-auth";
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
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search, Plus, Mail, Phone, MapPin, Pencil, Trash2, Loader2 } from "lucide-react";
import { formatDate } from "@/lib/format";
import { CustomerForm, type CustomerFormValues } from "@/components/customer-form";
import {
  fetchCustomers,
  createCustomer,
  updateCustomer,
  deleteCustomer,
  type Customer,
} from "@/lib/supabase-queries";

export const Route = createFileRoute("/clientes")({
  head: () => ({ meta: [{ title: "Clientes — Gestionelo" }] }),
  component: ClientesPage,
});

const CUSTOMERS_KEY = "customers";

function ClientesPage() {
  const { tenantId } = useAuth();
  const queryClient = useQueryClient();
  const [query, setQuery] = useState("");
  const [city, setCity] = useState<string>("todas");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [editing, setEditing] = useState(false);
  const [createOpen, setCreateOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<Customer | null>(null);

  const {
    data: customers = [],
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: [CUSTOMERS_KEY, tenantId],
    queryFn: () => fetchCustomers(tenantId),
  });

  const createMutation = useMutation({
    mutationFn: (values: CustomerFormValues) =>
      createCustomer({
        nombre: values.nombre,
        email: values.email,
        telefono: values.telefono || null,
        ciudad: values.ciudad || null,
        tenant_id: tenantId,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [CUSTOMERS_KEY] });
      setCreateOpen(false);
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, values }: { id: string; values: CustomerFormValues }) =>
      updateCustomer(id, {
        nombre: values.nombre,
        email: values.email,
        telefono: values.telefono || null,
        ciudad: values.ciudad || null,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [CUSTOMERS_KEY] });
      setEditing(false);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => deleteCustomer(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [CUSTOMERS_KEY] });
      setDeleteTarget(null);
      if (selectedId === deleteTarget?.id) setSelectedId(null);
    },
  });

  const ciudades = useMemo(
    () => Array.from(new Set(customers.map((c) => c.ciudad).filter(Boolean))) as string[],
    [customers],
  );

  const filtered = useMemo(
    () =>
      customers.filter((c) => {
        if (city !== "todas" && c.ciudad !== city) return false;
        if (!query) return true;
        const q = query.toLowerCase();
        return (
          c.nombre.toLowerCase().includes(q) ||
          c.email.toLowerCase().includes(q) ||
          (c.telefono ?? "").includes(q)
        );
      }),
    [query, city, customers],
  );

  const selected = customers.find((c) => c.id === selectedId) ?? null;

  const handleCreate = (values: CustomerFormValues) => {
    createMutation.mutate(values);
  };

  const handleUpdate = (values: CustomerFormValues) => {
    if (!selected) return;
    updateMutation.mutate({ id: selected.id, values });
  };

  const handleDelete = () => {
    if (!deleteTarget) return;
    deleteMutation.mutate(deleteTarget.id);
  };

  const isMutating =
    createMutation.isPending || updateMutation.isPending || deleteMutation.isPending;

  return (
    <div>
      <PageHeader
        title="Clientes"
        description={`${customers.length} clientes registrados en tu CRM.`}
        actions={
          <Button
            style={{ background: "var(--gradient-primary)" }}
            onClick={() => setCreateOpen(true)}
          >
            <Plus className="h-4 w-4" /> Nuevo Cliente
          </Button>
        }
      />
      <div className="space-y-4 p-4 sm:p-6 lg:p-8">
        <Card className="shadow-sm">
          <CardContent className="p-4">
            <div className="flex flex-col gap-3 sm:flex-row">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Buscar por nombre, email o teléfono..."
                  className="pl-9"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                />
              </div>
              <Select value={city} onValueChange={setCity}>
                <SelectTrigger className="sm:w-56">
                  <SelectValue placeholder="Ciudad" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todas">Todas las ciudades</SelectItem>
                  {ciudades.map((c) => (
                    <SelectItem key={c} value={c}>
                      {c}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-sm overflow-hidden">
          {isLoading ? (
            <div className="flex items-center justify-center py-16">
              <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
            </div>
          ) : isError ? (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <p className="text-sm text-destructive">Error al cargar clientes</p>
              <p className="text-xs text-muted-foreground mt-1">
                {error instanceof Error ? error.message : "Intente de nuevo"}
              </p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Cliente</TableHead>
                  <TableHead className="hidden md:table-cell">Ciudad</TableHead>
                  <TableHead className="hidden sm:table-cell">Email</TableHead>
                  <TableHead className="hidden lg:table-cell">Teléfono</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map((c) => (
                  <TableRow
                    key={c.id}
                    className="cursor-pointer"
                    onClick={() => {
                      setSelectedId(c.id);
                      setEditing(false);
                    }}
                  >
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="h-9 w-9 rounded-full bg-accent flex items-center justify-center text-xs font-semibold text-accent-foreground">
                          {c.nombre
                            .split(" ")
                            .map((n) => n[0])
                            .slice(0, 2)
                            .join("")}
                        </div>
                        <div>
                          <p className="font-medium">{c.nombre}</p>
                          <p className="text-xs text-muted-foreground">{c.email}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="hidden md:table-cell text-sm text-muted-foreground">
                      {c.ciudad ?? "—"}
                    </TableCell>
                    <TableCell className="hidden sm:table-cell text-sm text-muted-foreground">
                      {c.email}
                    </TableCell>
                    <TableCell className="hidden lg:table-cell text-sm text-muted-foreground">
                      {c.telefono ?? "—"}
                    </TableCell>
                  </TableRow>
                ))}
                {filtered.length === 0 && !isLoading && (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                      {customers.length === 0
                        ? "No hay clientes registrados."
                        : "No se encontraron clientes."}
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          )}
        </Card>
      </div>

      <Dialog open={createOpen} onOpenChange={setCreateOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Nuevo Cliente</DialogTitle>
            <DialogDescription>Agregá un nuevo cliente al CRM.</DialogDescription>
          </DialogHeader>
          <CustomerForm
            onSubmit={handleCreate}
            onCancel={() => setCreateOpen(false)}
            isLoading={createMutation.isPending}
            submitLabel="Crear Cliente"
          />
        </DialogContent>
      </Dialog>

      <Sheet
        open={!!selected}
        onOpenChange={(o) => {
          if (!o) {
            setSelectedId(null);
            setEditing(false);
          }
        }}
      >
        <SheetContent className="w-full sm:max-w-xl overflow-y-auto">
          {selected && (
            <>
              <SheetHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <SheetTitle className="text-xl">
                      {editing ? "Editar Cliente" : selected.nombre}
                    </SheetTitle>
                    <SheetDescription>
                      {editing ? "Modificá los datos del cliente." : "Perfil del cliente."}
                    </SheetDescription>
                  </div>
                  {!editing && (
                    <div className="flex gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setEditing(true)}
                        disabled={isMutating}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setDeleteTarget(selected)}
                        disabled={isMutating}
                      >
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </div>
                  )}
                </div>
              </SheetHeader>

              <div className="space-y-6 px-4 pb-6">
                {editing ? (
                  <CustomerForm
                    defaultValues={{
                      nombre: selected.nombre,
                      email: selected.email,
                      telefono: selected.telefono ?? "",
                      ciudad: selected.ciudad ?? "",
                    }}
                    onSubmit={handleUpdate}
                    onCancel={() => setEditing(false)}
                    isLoading={updateMutation.isPending}
                    submitLabel="Guardar Cambios"
                  />
                ) : (
                  <>
                    <div className="grid grid-cols-1 gap-3 text-sm">
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Mail className="h-4 w-4" />
                        {selected.email}
                      </div>
                      {selected.telefono && (
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <Phone className="h-4 w-4" />
                          {selected.telefono}
                        </div>
                      )}
                      {selected.ciudad && (
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <MapPin className="h-4 w-4" />
                          {selected.ciudad}
                        </div>
                      )}
                      {!selected.telefono && !selected.ciudad && (
                        <p className="text-sm text-muted-foreground">
                          Sin información de contacto adicional.
                        </p>
                      )}
                    </div>

                    <div className="rounded-lg border p-4">
                      <p className="text-xs text-muted-foreground">Creado</p>
                      <p className="text-sm font-medium">
                        {selected.created_at ? formatDate(selected.created_at) : "—"}
                      </p>
                    </div>
                  </>
                )}
              </div>
            </>
          )}
        </SheetContent>
      </Sheet>

      <AlertDialog open={!!deleteTarget} onOpenChange={(o) => !o && setDeleteTarget(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Eliminar cliente?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta acción no se puede deshacer. Se eliminará permanentemente a{" "}
              <strong>{deleteTarget?.nombre}</strong> del sistema.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={deleteMutation.isPending}>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
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

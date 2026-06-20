import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { PageHeader } from "@/components/page-header";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, Plus, Mail, Phone, MapPin } from "lucide-react";
import { customers, events, quotes } from "@/lib/mock-data";
import { formatUSD, formatDate } from "@/lib/format";

export const Route = createFileRoute("/clientes")({
  head: () => ({ meta: [{ title: "Clientes — Gestionelo" }] }),
  component: ClientesPage,
});

function ClientesPage() {
  const [query, setQuery] = useState("");
  const [city, setCity] = useState<string>("todas");
  const [selected, setSelected] = useState<string | null>(null);

  const ciudades = Array.from(new Set(customers.map((c) => c.ciudad)));
  const filtered = useMemo(
    () =>
      customers.filter(
        (c) =>
          (city === "todas" || c.ciudad === city) &&
          (c.nombre.toLowerCase().includes(query.toLowerCase()) ||
            c.email.toLowerCase().includes(query.toLowerCase()) ||
            c.telefono.includes(query)),
      ),
    [query, city],
  );

  const cliente = customers.find((c) => c.id === selected);
  const clienteEventos = cliente ? events.filter((e) => e.clienteId === cliente.id) : [];
  const clienteCotizaciones = cliente ? quotes.filter((q) => q.clienteId === cliente.id) : [];

  return (
    <div>
      <PageHeader
        title="Clientes"
        description={`${customers.length} clientes registrados en tu CRM.`}
        actions={
          <Button style={{ background: "var(--gradient-primary)" }}>
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
                <Input placeholder="Buscar por nombre, email o teléfono..." className="pl-9" value={query} onChange={(e) => setQuery(e.target.value)} />
              </div>
              <Select value={city} onValueChange={setCity}>
                <SelectTrigger className="sm:w-56"><SelectValue placeholder="Ciudad" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="todas">Todas las ciudades</SelectItem>
                  {ciudades.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-sm overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Cliente</TableHead>
                <TableHead className="hidden md:table-cell">Ciudad</TableHead>
                <TableHead className="hidden sm:table-cell">Eventos</TableHead>
                <TableHead className="text-right">Total gastado</TableHead>
                <TableHead className="hidden lg:table-cell text-right">Ticket promedio</TableHead>
                <TableHead className="hidden md:table-cell">Último evento</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((c) => (
                <TableRow key={c.id} className="cursor-pointer" onClick={() => setSelected(c.id)}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div className="h-9 w-9 rounded-full bg-accent flex items-center justify-center text-xs font-semibold text-accent-foreground">
                        {c.nombre.split(" ").map((n) => n[0]).slice(0, 2).join("")}
                      </div>
                      <div>
                        <p className="font-medium">{c.nombre}</p>
                        <p className="text-xs text-muted-foreground">{c.email}</p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="hidden md:table-cell text-sm text-muted-foreground">{c.ciudad}</TableCell>
                  <TableCell className="hidden sm:table-cell"><Badge variant="secondary">{c.eventosTotales}</Badge></TableCell>
                  <TableCell className="text-right font-semibold">{formatUSD(c.totalGastado)}</TableCell>
                  <TableCell className="hidden lg:table-cell text-right">{formatUSD(c.ticketPromedio)}</TableCell>
                  <TableCell className="hidden md:table-cell text-sm text-muted-foreground">{formatDate(c.ultimaFecha)}</TableCell>
                </TableRow>
              ))}
              {filtered.length === 0 && (
                <TableRow><TableCell colSpan={6} className="text-center py-8 text-muted-foreground">No se encontraron clientes.</TableCell></TableRow>
              )}
            </TableBody>
          </Table>
        </Card>
      </div>

      <Sheet open={!!selected} onOpenChange={(o) => !o && setSelected(null)}>
        <SheetContent className="w-full sm:max-w-xl overflow-y-auto">
          {cliente && (
            <>
              <SheetHeader>
                <SheetTitle className="text-xl">{cliente.nombre}</SheetTitle>
                <SheetDescription>Perfil del cliente y actividad reciente.</SheetDescription>
              </SheetHeader>
              <div className="space-y-6 px-4 pb-6">
                <div className="grid grid-cols-1 gap-3 text-sm">
                  <div className="flex items-center gap-2 text-muted-foreground"><Mail className="h-4 w-4" />{cliente.email}</div>
                  <div className="flex items-center gap-2 text-muted-foreground"><Phone className="h-4 w-4" />{cliente.telefono}</div>
                  <div className="flex items-center gap-2 text-muted-foreground"><MapPin className="h-4 w-4" />{cliente.ciudad}</div>
                </div>
                <div className="grid grid-cols-3 gap-3">
                  <KpiMini label="Total gastado" value={formatUSD(cliente.totalGastado)} />
                  <KpiMini label="Ticket promedio" value={formatUSD(cliente.ticketPromedio)} />
                  <KpiMini label="Eventos" value={String(cliente.eventosTotales)} />
                </div>
                <div>
                  <h3 className="mb-2 text-sm font-semibold">Historial de eventos</h3>
                  <div className="space-y-2">
                    {clienteEventos.length === 0 && <p className="text-sm text-muted-foreground">Sin eventos registrados.</p>}
                    {clienteEventos.map((e) => (
                      <div key={e.id} className="flex items-center justify-between rounded-lg border p-3 text-sm">
                        <div><p className="font-medium">{e.nombre}</p><p className="text-xs text-muted-foreground">{e.lugar} · {formatDate(e.fecha)}</p></div>
                        <p className="font-semibold">{formatUSD(e.total)}</p>
                      </div>
                    ))}
                  </div>
                </div>
                <div>
                  <h3 className="mb-2 text-sm font-semibold">Historial de cotizaciones</h3>
                  <div className="space-y-2">
                    {clienteCotizaciones.slice(0, 5).map((q) => (
                      <div key={q.id} className="flex items-center justify-between rounded-lg border p-3 text-sm">
                        <div><p className="font-medium">{q.codigo}</p><p className="text-xs text-muted-foreground">{formatDate(q.fecha)} · {q.estado}</p></div>
                        <p className="font-semibold">{formatUSD(q.total)}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </>
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
}

function KpiMini({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border bg-card/50 p-3">
      <p className="text-[11px] text-muted-foreground">{label}</p>
      <p className="mt-1 text-base font-semibold">{value}</p>
    </div>
  );
}
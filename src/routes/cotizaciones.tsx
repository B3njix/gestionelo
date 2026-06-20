import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { PageHeader } from "@/components/page-header";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, Plus } from "lucide-react";
import { quotes } from "@/lib/mock-data";
import { formatUSD, formatDate } from "@/lib/format";

export const Route = createFileRoute("/cotizaciones")({
  head: () => ({ meta: [{ title: "Cotizaciones — Gestionelo" }] }),
  component: Cotizaciones,
});

const statusVariant: Record<string, string> = {
  Borrador: "bg-muted text-muted-foreground border-border",
  Enviada: "bg-primary/10 text-primary border-primary/20",
  Aprobada: "bg-success/15 text-success border-success/20",
  Rechazada: "bg-destructive/10 text-destructive border-destructive/20",
};

function Cotizaciones() {
  const [q, setQ] = useState("");
  const [estado, setEstado] = useState("todos");
  const list = useMemo(
    () =>
      quotes.filter(
        (x) =>
          (estado === "todos" || x.estado === estado) &&
          (x.codigo.toLowerCase().includes(q.toLowerCase()) || x.cliente.toLowerCase().includes(q.toLowerCase())),
      ),
    [q, estado],
  );
  return (
    <div>
      <PageHeader
        title="Cotizaciones"
        description={`${quotes.length} cotizaciones generadas.`}
        actions={
          <Button asChild style={{ background: "var(--gradient-primary)" }}>
            <Link to="/eventos/nuevo"><Plus className="h-4 w-4" /> Nueva cotización</Link>
          </Button>
        }
      />
      <div className="space-y-4 p-4 sm:p-6 lg:p-8">
        <Card className="shadow-sm">
          <CardContent className="flex flex-col gap-3 p-4 sm:flex-row">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input className="pl-9" placeholder="Buscar por código o cliente..." value={q} onChange={(e) => setQ(e.target.value)} />
            </div>
            <Select value={estado} onValueChange={setEstado}>
              <SelectTrigger className="sm:w-48"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="todos">Todos los estados</SelectItem>
                <SelectItem value="Borrador">Borrador</SelectItem>
                <SelectItem value="Enviada">Enviada</SelectItem>
                <SelectItem value="Aprobada">Aprobada</SelectItem>
                <SelectItem value="Rechazada">Rechazada</SelectItem>
              </SelectContent>
            </Select>
          </CardContent>
        </Card>
        <Card className="shadow-sm overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Código</TableHead>
                <TableHead>Cliente</TableHead>
                <TableHead className="hidden md:table-cell">Fecha</TableHead>
                <TableHead className="hidden lg:table-cell text-right">Subtotal</TableHead>
                <TableHead className="hidden lg:table-cell text-right">IVA</TableHead>
                <TableHead className="text-right">Total</TableHead>
                <TableHead>Estado</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {list.map((x) => (
                <TableRow key={x.id}>
                  <TableCell className="font-mono text-xs">{x.codigo}</TableCell>
                  <TableCell className="font-medium">{x.cliente}</TableCell>
                  <TableCell className="hidden md:table-cell">{formatDate(x.fecha)}</TableCell>
                  <TableCell className="hidden lg:table-cell text-right">{formatUSD(x.subtotal)}</TableCell>
                  <TableCell className="hidden lg:table-cell text-right">{formatUSD(x.impuesto)}</TableCell>
                  <TableCell className="text-right font-semibold">{formatUSD(x.total)}</TableCell>
                  <TableCell><Badge variant="outline" className={statusVariant[x.estado]}>{x.estado}</Badge></TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Card>
      </div>
    </div>
  );
}
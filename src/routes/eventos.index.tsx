import { createFileRoute, Link } from "@tanstack/react-router";
import { PageHeader } from "@/components/page-header";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Plus } from "lucide-react";
import { events } from "@/lib/mock-data";
import { formatUSD, formatDate } from "@/lib/format";

export const Route = createFileRoute("/eventos/")({
  head: () => ({ meta: [{ title: "Eventos — Gestionelo" }] }),
  component: EventosList,
});

const statusVariant: Record<string, string> = {
  Confirmado: "bg-success/15 text-success border-success/20",
  Pendiente: "bg-warning/15 text-[oklch(0.45_0.15_75)] border-warning/30",
  Cancelado: "bg-destructive/10 text-destructive border-destructive/20",
};

function EventosList() {
  const ordenados = [...events].sort((a, b) => +new Date(a.fecha) - +new Date(b.fecha));
  return (
    <div>
      <PageHeader
        title="Eventos"
        description="Gestiona todos los eventos de tu agenda."
        actions={
          <Button asChild style={{ background: "var(--gradient-primary)" }}>
            <Link to="/eventos/nuevo"><Plus className="h-4 w-4" /> Nuevo Evento</Link>
          </Button>
        }
      />
      <div className="p-4 sm:p-6 lg:p-8">
        <Card className="shadow-sm overflow-hidden">
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Evento</TableHead>
                  <TableHead className="hidden md:table-cell">Cliente</TableHead>
                  <TableHead>Fecha</TableHead>
                  <TableHead className="hidden lg:table-cell">Lugar</TableHead>
                  <TableHead className="hidden sm:table-cell">Tipo</TableHead>
                  <TableHead className="hidden sm:table-cell">Invitados</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead className="text-right">Total</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {ordenados.map((e) => (
                  <TableRow key={e.id}>
                    <TableCell className="font-medium">{e.nombre}</TableCell>
                    <TableCell className="hidden md:table-cell text-sm text-muted-foreground">{e.cliente}</TableCell>
                    <TableCell>{formatDate(e.fecha)}</TableCell>
                    <TableCell className="hidden lg:table-cell text-sm text-muted-foreground">{e.lugar}</TableCell>
                    <TableCell className="hidden sm:table-cell"><Badge variant="secondary">{e.tipo}</Badge></TableCell>
                    <TableCell className="hidden sm:table-cell">{e.invitados}</TableCell>
                    <TableCell><Badge variant="outline" className={statusVariant[e.estado]}>{e.estado}</Badge></TableCell>
                    <TableCell className="text-right font-semibold">{formatUSD(e.total)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
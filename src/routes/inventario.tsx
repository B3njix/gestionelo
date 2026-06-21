import { createFileRoute } from "@tanstack/react-router";
import { useState, useMemo } from "react";
import { PageHeader } from "@/components/page-header";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { AlertTriangle, Boxes, PackageCheck, Search } from "lucide-react";
import { products } from "@/lib/mock-data";
import { formatUSD } from "@/lib/format";

export const Route = createFileRoute("/inventario")({
  head: () => ({ meta: [{ title: "Inventario — Gestionelo" }] }),
  component: Inventario,
});

function Inventario() {
  const [q, setQ] = useState("");
  const list = useMemo(
    () => products.filter((p) => p.nombre.toLowerCase().includes(q.toLowerCase())),
    [q],
  );
  const totalStock = products.reduce((a, b) => a + b.stockTotal, 0);
  const reservado = products.reduce((a, b) => a + b.stockReservado, 0);
  const disponible = totalStock - reservado;
  const alertas = products.filter((p) => p.stockTotal - p.stockReservado < 10);

  return (
    <div>
      <PageHeader
        title="Inventario"
        description="Control de stock total, reservado y disponible."
      />
      <div className="space-y-4 p-4 sm:p-6 lg:p-8">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <KpiCard icon={Boxes} label="Stock total" value={totalStock.toString()} tone="primary" />
          <KpiCard
            icon={PackageCheck}
            label="Disponible"
            value={disponible.toString()}
            tone="success"
          />
          <KpiCard
            icon={AlertTriangle}
            label="Alertas de bajo inventario"
            value={alertas.length.toString()}
            tone="warning"
          />
        </div>

        <Card className="shadow-sm">
          <CardContent className="p-4">
            <div className="relative max-w-md">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                className="pl-9"
                placeholder="Buscar producto..."
                value={q}
                onChange={(e) => setQ(e.target.value)}
              />
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-sm overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Producto</TableHead>
                <TableHead className="hidden md:table-cell">Categoría</TableHead>
                <TableHead className="hidden sm:table-cell text-right">Precio</TableHead>
                <TableHead className="text-right">Total</TableHead>
                <TableHead className="text-right">Reservado</TableHead>
                <TableHead className="text-right">Disponible</TableHead>
                <TableHead className="min-w-40">Uso</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {list.map((p) => {
                const disp = p.stockTotal - p.stockReservado;
                const pct = (p.stockReservado / p.stockTotal) * 100;
                const low = disp < 10;
                return (
                  <TableRow key={p.id}>
                    <TableCell className="font-medium">{p.nombre}</TableCell>
                    <TableCell className="hidden md:table-cell">
                      <Badge variant="secondary">{p.categoria}</Badge>
                    </TableCell>
                    <TableCell className="hidden sm:table-cell text-right">
                      {formatUSD(p.precio)}
                    </TableCell>
                    <TableCell className="text-right">{p.stockTotal}</TableCell>
                    <TableCell className="text-right">{p.stockReservado}</TableCell>
                    <TableCell className="text-right">
                      <Badge
                        variant="outline"
                        className={
                          low
                            ? "border-warning/40 bg-warning/10 text-[oklch(0.45_0.15_75)]"
                            : "border-success/40 bg-success/10 text-success"
                        }
                      >
                        {disp}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Progress value={pct} className="h-2" />
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </Card>
      </div>
    </div>
  );
}

function KpiCard({
  icon: Icon,
  label,
  value,
  tone,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string;
  tone: "primary" | "success" | "warning";
}) {
  const styles: Record<string, string> = {
    primary: "bg-primary/10 text-primary",
    success: "bg-success/15 text-success",
    warning: "bg-warning/20 text-[oklch(0.45_0.15_75)]",
  };
  return (
    <Card className="shadow-sm">
      <CardContent className="flex items-center justify-between p-5">
        <div>
          <p className="text-xs text-muted-foreground">{label}</p>
          <p className="mt-2 text-2xl font-semibold">{value}</p>
        </div>
        <div className={`flex h-10 w-10 items-center justify-center rounded-lg ${styles[tone]}`}>
          <Icon className="h-5 w-5" />
        </div>
      </CardContent>
    </Card>
  );
}

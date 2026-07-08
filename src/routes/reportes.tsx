import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  Line,
  LineChart,
} from "recharts";
import {
  monthlyRevenue,
  eventsByCategory,
  topProducts,
  topCustomers,
  conversionRate,
} from "@/lib/mock-data";
import { formatUSD } from "@/lib/format";

export const Route = createFileRoute("/reportes")({
  head: () => ({ meta: [{ title: "Reportes — Gestionelo" }] }),
  component: Reportes,
});

const COLORS = [
  "oklch(0.42 0.18 295)",
  "oklch(0.78 0.13 85)",
  "oklch(0.58 0.22 300)",
  "oklch(0.65 0.16 155)",
  "oklch(0.72 0.18 50)",
];

function Reportes() {
  return (
    <div>
      <PageHeader title="Reportes" description="Análisis y métricas clave de tu operación." />
      <div className="grid grid-cols-1 gap-4 p-4 sm:p-6 lg:p-8 lg:grid-cols-2">
        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle className="text-base">Ingresos por mes</CardTitle>
          </CardHeader>
          <CardContent className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={monthlyRevenue}>
                <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.92 0.012 285)" />
                <XAxis dataKey="mes" stroke="oklch(0.52 0.03 275)" fontSize={12} />
                <YAxis
                  stroke="oklch(0.52 0.03 275)"
                  fontSize={12}
                  tickFormatter={(v) => `$${v / 1000}k`}
                />
                <Tooltip formatter={(v: number) => formatUSD(v)} />
                <Bar dataKey="ingresos" fill="oklch(0.42 0.18 295)" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle className="text-base">Eventos por categoría</CardTitle>
          </CardHeader>
          <CardContent className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={eventsByCategory}
                  dataKey="cantidad"
                  nameKey="tipo"
                  cx="50%"
                  cy="50%"
                  outerRadius={90}
                  label
                >
                  {eventsByCategory.map((_, i) => (
                    <Cell key={i} fill={COLORS[i % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle className="text-base">Productos más alquilados</CardTitle>
          </CardHeader>
          <CardContent className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={topProducts} layout="vertical" margin={{ left: 20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.92 0.012 285)" />
                <XAxis type="number" stroke="oklch(0.52 0.03 275)" fontSize={12} />
                <YAxis
                  dataKey="nombre"
                  type="category"
                  stroke="oklch(0.52 0.03 275)"
                  fontSize={11}
                  width={140}
                />
                <Tooltip />
                <Bar dataKey="alquileres" fill="oklch(0.78 0.13 85)" radius={[0, 8, 8, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle className="text-base">Tasa de conversión de cotizaciones</CardTitle>
          </CardHeader>
          <CardContent className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={conversionRate}>
                <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.92 0.012 285)" />
                <XAxis dataKey="mes" stroke="oklch(0.52 0.03 275)" fontSize={12} />
                <YAxis stroke="oklch(0.52 0.03 275)" fontSize={12} tickFormatter={(v) => `${v}%`} />
                <Tooltip formatter={(v: number) => `${v}%`} />
                <Line
                  type="monotone"
                  dataKey="tasa"
                  stroke="oklch(0.58 0.22 300)"
                  strokeWidth={3}
                  dot={{ r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="shadow-sm lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-base">Mejores clientes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {topCustomers.map((c, i) => (
                <div key={c.id} className="flex items-center justify-between rounded-lg border p-3">
                  <div className="flex items-center gap-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-xs font-semibold text-primary">
                      {i + 1}
                    </div>
                    <div>
                      <p className="font-medium">{c.nombre}</p>
                      <p className="text-xs text-muted-foreground">
                        {c.ciudad} · {c.eventosTotales} eventos
                      </p>
                    </div>
                  </div>
                  <p className="font-semibold text-primary">{formatUSD(c.totalGastado)}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

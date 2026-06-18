import { createFileRoute, Link } from "@tanstack/react-router";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/page-header";
import {
  DollarSign, TrendingUp, CalendarDays, FileText, Plus, ArrowUpRight,
} from "lucide-react";
import {
  Area, AreaChart, Bar, BarChart, CartesianGrid, Line, LineChart,
  ResponsiveContainer, Tooltip, XAxis, YAxis,
} from "recharts";
import { events, monthlyRevenue, conversionRate, topProducts, quotes } from "@/lib/mock-data";
import { formatUSD, formatDate } from "@/lib/format";

export const Route = createFileRoute("/")({
  head: () => ({ meta: [{ title: "Panel Principal — Decora ERP" }] }),
  component: Dashboard,
});

const statusVariant: Record<string, string> = {
  Confirmado: "bg-success/15 text-success border-success/20",
  Pendiente: "bg-warning/15 text-[oklch(0.45_0.15_75)] border-warning/30",
  Cancelado: "bg-destructive/10 text-destructive border-destructive/20",
  Aprobada: "bg-success/15 text-success border-success/20",
  Enviada: "bg-primary/10 text-primary border-primary/20",
  Borrador: "bg-muted text-muted-foreground border-border",
  Rechazada: "bg-destructive/10 text-destructive border-destructive/20",
};

function Dashboard() {
  const upcoming = [...events]
    .filter((e) => new Date(e.fecha) >= new Date())
    .sort((a, b) => +new Date(a.fecha) - +new Date(b.fecha))
    .slice(0, 5);
  const pendingQuotes = quotes.filter((q) => q.estado === "Enviada" || q.estado === "Borrador").slice(0, 5);
  const revenueTotal = monthlyRevenue.reduce((a, b) => a + b.ingresos, 0);
  const eventCount = events.length;
  const pendingCount = quotes.filter((q) => q.estado === "Enviada").length;
  const conv = conversionRate[conversionRate.length - 1].tasa;

  return (
    <div>
      <PageHeader
        title="Panel Principal"
        description="Resumen general de tu operación de decoración de eventos."
        actions={
          <Button asChild className="shadow-sm" style={{ background: "var(--gradient-primary)" }}>
            <Link to="/eventos/nuevo">
              <Plus className="h-4 w-4" /> Nuevo Evento
            </Link>
          </Button>
        }
      />
      <div className="space-y-6 p-4 sm:p-6 lg:p-8">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard icon={DollarSign} label="Ingresos del año" value={formatUSD(revenueTotal)} delta="+18.4%" tone="primary" />
          <StatCard icon={CalendarDays} label="Eventos programados" value={String(eventCount)} delta="+5 este mes" tone="gold" />
          <StatCard icon={FileText} label="Cotizaciones pendientes" value={String(pendingCount)} delta="3 vencen pronto" tone="warning" />
          <StatCard icon={TrendingUp} label="Tasa de conversión" value={`${conv}%`} delta="+4 pts vs mes anterior" tone="success" />
        </div>

        <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
          <Card className="lg:col-span-2 shadow-sm">
            <CardHeader>
              <CardTitle className="text-base">Ingresos mensuales</CardTitle>
              <p className="text-xs text-muted-foreground">Evolución de ingresos durante el año en curso.</p>
            </CardHeader>
            <CardContent className="h-72 px-2">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={monthlyRevenue}>
                  <defs>
                    <linearGradient id="rev" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="oklch(0.58 0.22 300)" stopOpacity={0.4} />
                      <stop offset="100%" stopColor="oklch(0.58 0.22 300)" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.92 0.012 285)" />
                  <XAxis dataKey="mes" stroke="oklch(0.52 0.03 275)" fontSize={12} />
                  <YAxis stroke="oklch(0.52 0.03 275)" fontSize={12} tickFormatter={(v) => `$${v / 1000}k`} />
                  <Tooltip formatter={(v: number) => formatUSD(v)} contentStyle={{ borderRadius: 12, border: "1px solid oklch(0.92 0.012 285)" }} />
                  <Area type="monotone" dataKey="ingresos" stroke="oklch(0.42 0.18 295)" strokeWidth={2.5} fill="url(#rev)" />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card className="shadow-sm">
            <CardHeader>
              <CardTitle className="text-base">Tasa de conversión</CardTitle>
              <p className="text-xs text-muted-foreground">Cotizaciones aprobadas vs enviadas.</p>
            </CardHeader>
            <CardContent className="h-72 px-2">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={conversionRate}>
                  <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.92 0.012 285)" />
                  <XAxis dataKey="mes" stroke="oklch(0.52 0.03 275)" fontSize={12} />
                  <YAxis stroke="oklch(0.52 0.03 275)" fontSize={12} tickFormatter={(v) => `${v}%`} />
                  <Tooltip formatter={(v: number) => `${v}%`} contentStyle={{ borderRadius: 12 }} />
                  <Line type="monotone" dataKey="tasa" stroke="oklch(0.78 0.13 85)" strokeWidth={3} dot={{ fill: "oklch(0.78 0.13 85)", r: 4 }} />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
          <Card className="lg:col-span-2 shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-base">Próximos eventos</CardTitle>
                <p className="text-xs text-muted-foreground">Eventos confirmados de la agenda.</p>
              </div>
              <Button asChild variant="ghost" size="sm">
                <Link to="/eventos">Ver todos <ArrowUpRight className="h-3.5 w-3.5" /></Link>
              </Button>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {upcoming.map((e) => (
                  <div key={e.id} className="flex items-center justify-between rounded-lg border bg-card/50 p-3">
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-medium truncate">{e.nombre}</span>
                        <Badge variant="outline" className={statusVariant[e.estado]}>{e.estado}</Badge>
                      </div>
                      <p className="text-xs text-muted-foreground truncate">{e.cliente} · {e.lugar}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-semibold">{formatDate(e.fecha)}</p>
                      <p className="text-xs text-muted-foreground">{e.invitados} invitados</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-sm">
            <CardHeader>
              <CardTitle className="text-base">Cotizaciones pendientes</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {pendingQuotes.map((q) => (
                <div key={q.id} className="flex items-center justify-between rounded-lg border p-3">
                  <div className="min-w-0">
                    <p className="text-sm font-medium truncate">{q.codigo}</p>
                    <p className="text-xs text-muted-foreground truncate">{q.cliente}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold">{formatUSD(q.total)}</p>
                    <Badge variant="outline" className={statusVariant[q.estado]}>{q.estado}</Badge>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle className="text-base">Productos más alquilados</CardTitle>
            <p className="text-xs text-muted-foreground">Top 6 productos del trimestre.</p>
          </CardHeader>
          <CardContent className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={topProducts} margin={{ left: 0, right: 20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.92 0.012 285)" />
                <XAxis dataKey="nombre" stroke="oklch(0.52 0.03 275)" fontSize={11} interval={0} angle={-15} textAnchor="end" height={70} />
                <YAxis stroke="oklch(0.52 0.03 275)" fontSize={12} />
                <Tooltip contentStyle={{ borderRadius: 12 }} />
                <Bar dataKey="alquileres" fill="oklch(0.42 0.18 295)" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function StatCard({
  icon: Icon, label, value, delta, tone,
}: { icon: any; label: string; value: string; delta: string; tone: "primary" | "gold" | "warning" | "success" }) {
  const toneStyle: Record<string, string> = {
    primary: "bg-primary/10 text-primary",
    gold: "bg-gold/15 text-gold-foreground",
    warning: "bg-warning/15 text-[oklch(0.45_0.15_75)]",
    success: "bg-success/15 text-success",
  };
  return (
    <Card className="shadow-sm transition hover:shadow-md">
      <CardContent className="p-5">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-xs font-medium text-muted-foreground">{label}</p>
            <p className="mt-2 text-2xl font-semibold tracking-tight">{value}</p>
            <p className="mt-1 text-xs text-success">{delta}</p>
          </div>
          <div className={`flex h-10 w-10 items-center justify-center rounded-lg ${toneStyle[tone]}`}>
            <Icon className="h-5 w-5" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { PageHeader } from "@/components/page-header";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { events } from "@/lib/mock-data";
import { formatDate } from "@/lib/format";

export const Route = createFileRoute("/calendario")({
  head: () => ({ meta: [{ title: "Calendario — Decora ERP" }] }),
  component: Calendario,
});

const MESES = ["Enero","Febrero","Marzo","Abril","Mayo","Junio","Julio","Agosto","Septiembre","Octubre","Noviembre","Diciembre"];
const DIAS = ["Lun","Mar","Mié","Jue","Vie","Sáb","Dom"];

const statusColor: Record<string, string> = {
  Confirmado: "bg-success/15 text-success border-success/30",
  Pendiente: "bg-warning/20 text-[oklch(0.45_0.15_75)] border-warning/40",
  Cancelado: "bg-destructive/10 text-destructive border-destructive/30",
};

function Calendario() {
  const first = events.length ? new Date(events[0].fecha) : new Date();
  const [cursor, setCursor] = useState(new Date(first.getFullYear(), first.getMonth(), 1));

  const year = cursor.getFullYear();
  const month = cursor.getMonth();
  const startDay = (new Date(year, month, 1).getDay() + 6) % 7; // Mon=0
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const cells: (number | null)[] = [];
  for (let i = 0; i < startDay; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);
  while (cells.length % 7 !== 0) cells.push(null);

  const monthEvents = events.filter((e) => {
    const d = new Date(e.fecha);
    return d.getFullYear() === year && d.getMonth() === month;
  });

  return (
    <div>
      <PageHeader title="Calendario de eventos" description="Vista mensual de la agenda." />
      <div className="space-y-4 p-4 sm:p-6 lg:p-8">
        <Card className="shadow-sm">
          <CardContent className="p-4 sm:p-6">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-semibold">{MESES[month]} {year}</h2>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="icon" onClick={() => setCursor(new Date(year, month - 1, 1))}>
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="sm" onClick={() => setCursor(new Date())}>Hoy</Button>
                <Button variant="outline" size="icon" onClick={() => setCursor(new Date(year, month + 1, 1))}>
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
            <div className="grid grid-cols-7 gap-1 text-center text-xs font-medium text-muted-foreground">
              {DIAS.map((d) => <div key={d} className="py-2">{d}</div>)}
            </div>
            <div className="grid grid-cols-7 gap-1">
              {cells.map((d, idx) => {
                if (d === null) return <div key={idx} className="aspect-square rounded-lg bg-muted/30" />;
                const dayEvents = monthEvents.filter((e) => new Date(e.fecha).getDate() === d);
                const isToday = new Date().toDateString() === new Date(year, month, d).toDateString();
                return (
                  <div key={idx} className={`min-h-24 rounded-lg border bg-card p-1.5 text-left ${isToday ? "border-primary ring-1 ring-primary/30" : ""}`}>
                    <div className={`text-xs font-medium ${isToday ? "text-primary" : "text-foreground"}`}>{d}</div>
                    <div className="mt-1 space-y-1">
                      {dayEvents.slice(0, 2).map((e) => (
                        <div key={e.id} className={`truncate rounded px-1.5 py-0.5 text-[10px] border ${statusColor[e.estado]}`} title={e.nombre}>
                          {e.nombre}
                        </div>
                      ))}
                      {dayEvents.length > 2 && <div className="text-[10px] text-muted-foreground">+{dayEvents.length - 2} más</div>}
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-sm">
          <CardContent className="p-4">
            <h3 className="mb-3 text-sm font-semibold">Eventos del mes</h3>
            <div className="space-y-2">
              {monthEvents.length === 0 && <p className="text-sm text-muted-foreground">No hay eventos este mes.</p>}
              {monthEvents.map((e) => (
                <div key={e.id} className="flex items-center justify-between rounded-lg border p-3 text-sm">
                  <div>
                    <p className="font-medium">{e.nombre}</p>
                    <p className="text-xs text-muted-foreground">{formatDate(e.fecha)} · {e.lugar}</p>
                  </div>
                  <Badge variant="outline" className={statusColor[e.estado]}>{e.estado}</Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
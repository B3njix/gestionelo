import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { PageHeader } from "@/components/page-header";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Search, Plus } from "lucide-react";
import { CATEGORIES, products } from "@/lib/mock-data";
import { formatUSD } from "@/lib/format";

export const Route = createFileRoute("/catalogo")({
  head: () => ({ meta: [{ title: "Catálogo — Decora ERP" }] }),
  component: Catalogo,
});

function Catalogo() {
  const [cat, setCat] = useState<string>("Todas");
  const [q, setQ] = useState("");
  const list = useMemo(
    () => products.filter((p) => (cat === "Todas" || p.categoria === cat) && p.nombre.toLowerCase().includes(q.toLowerCase())),
    [cat, q],
  );
  return (
    <div>
      <PageHeader
        title="Catálogo de productos"
        description="Explora todo el inventario disponible para alquiler."
        actions={
          <Button asChild style={{ background: "var(--gradient-primary)" }}>
            <Link to="/eventos/nuevo"><Plus className="h-4 w-4" /> Crear cotización</Link>
          </Button>
        }
      />
      <div className="space-y-4 p-4 sm:p-6 lg:p-8">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input className="pl-9" placeholder="Buscar producto..." value={q} onChange={(e) => setQ(e.target.value)} />
          </div>
        </div>
        <Tabs value={cat} onValueChange={setCat}>
          <TabsList className="flex h-auto flex-wrap gap-1 bg-muted/60 p-1">
            <TabsTrigger value="Todas" className="text-xs">Todas</TabsTrigger>
            {CATEGORIES.map((c) => <TabsTrigger key={c} value={c} className="text-xs">{c}</TabsTrigger>)}
          </TabsList>
        </Tabs>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {list.map((p) => {
            const disponible = p.stockTotal - p.stockReservado;
            const low = disponible < 10;
            return (
              <Card key={p.id} className="overflow-hidden shadow-sm transition hover:shadow-md">
                <div className="aspect-[5/3] overflow-hidden bg-muted">
                  <img src={p.imagen} alt={p.nombre} loading="lazy" className="h-full w-full object-cover" />
                </div>
                <CardContent className="space-y-2 p-4">
                  <Badge variant="secondary" className="text-[10px]">{p.categoria}</Badge>
                  <h3 className="font-medium leading-snug line-clamp-1">{p.nombre}</h3>
                  <p className="text-xs text-muted-foreground line-clamp-2">{p.descripcion}</p>
                  <div className="flex items-center justify-between pt-1">
                    <span className="text-lg font-semibold text-primary">{formatUSD(p.precio)}</span>
                    <Badge variant="outline" className={low ? "border-warning/40 bg-warning/10 text-[oklch(0.45_0.15_75)]" : ""}>
                      {disponible} disp.
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
}
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import { PageHeader } from "@/components/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Plus, Trash2, FileDown, MessageCircle, Save, Check, Sparkles } from "lucide-react";
import { CATEGORIES, EVENT_TYPES, customers, products, type Product } from "@/lib/mock-data";
import { formatUSD } from "@/lib/format";

export const Route = createFileRoute("/eventos/nuevo")({
  head: () => ({ meta: [{ title: "Nuevo Evento — Decora ERP" }] }),
  component: NuevoEvento,
});

type LineItem = {
  id: string;
  productId: string;
  nombre: string;
  cantidad: number;
  precio: number;
  variantes: Record<string, string>;
};

function NuevoEvento() {
  const navigate = useNavigate();
  const [evento, setEvento] = useState({
    nombre: "", fecha: "", lugar: "", invitados: 80, tipo: "Boda" as (typeof EVENT_TYPES)[number],
    clienteId: customers[0].id,
  });
  const [categoria, setCategoria] = useState<(typeof CATEGORIES)[number]>("Manteles");
  const [items, setItems] = useState<LineItem[]>([]);
  const [descuentoPct, setDescuentoPct] = useState(0);
  const [configProduct, setConfigProduct] = useState<Product | null>(null);
  const [configVariants, setConfigVariants] = useState<Record<string, string>>({});
  const [configQty, setConfigQty] = useState(1);

  const visibles = useMemo(() => products.filter((p) => p.categoria === categoria).slice(0, 12), [categoria]);

  const subtotal = items.reduce((acc, i) => acc + i.precio * i.cantidad, 0);
  const descuento = subtotal * (descuentoPct / 100);
  const impuesto = (subtotal - descuento) * 0.13;
  const total = subtotal - descuento + impuesto;

  function openConfigurator(p: Product) {
    setConfigProduct(p);
    setConfigQty(1);
    const defaults: Record<string, string> = {};
    if (p.variantes) for (const k of Object.keys(p.variantes)) defaults[k] = p.variantes[k][0];
    setConfigVariants(defaults);
  }

  function addConfigured() {
    if (!configProduct) return;
    setItems((prev) => [
      ...prev,
      {
        id: `${configProduct.id}-${Date.now()}`,
        productId: configProduct.id,
        nombre: configProduct.nombre,
        cantidad: configQty,
        precio: configProduct.precio,
        variantes: configVariants,
      },
    ]);
    toast.success("Producto añadido a la cotización");
    setConfigProduct(null);
  }

  function updateQty(id: string, qty: number) {
    setItems((prev) => prev.map((i) => (i.id === id ? { ...i, cantidad: Math.max(1, qty) } : i)));
  }
  function removeItem(id: string) { setItems((prev) => prev.filter((i) => i.id !== id)); }

  return (
    <div>
      <PageHeader
        title="Nuevo Evento"
        description="Configura el evento, arma el catálogo y genera la cotización."
      />
      <div className="grid grid-cols-1 gap-6 p-4 sm:p-6 lg:p-8 lg:grid-cols-[1fr_400px]">
        <div className="space-y-6 min-w-0">
          <Card className="shadow-sm">
            <CardHeader><CardTitle className="text-base">Detalles del evento</CardTitle></CardHeader>
            <CardContent className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <Field label="Nombre del evento">
                <Input value={evento.nombre} onChange={(e) => setEvento({ ...evento, nombre: e.target.value })} placeholder="Ej. Boda María & Carlos" />
              </Field>
              <Field label="Fecha del evento">
                <Input type="date" value={evento.fecha} onChange={(e) => setEvento({ ...evento, fecha: e.target.value })} />
              </Field>
              <Field label="Lugar">
                <Input value={evento.lugar} onChange={(e) => setEvento({ ...evento, lugar: e.target.value })} placeholder="Ej. Hotel Sheraton Presidente" />
              </Field>
              <Field label="Número de invitados">
                <Input type="number" min={1} value={evento.invitados} onChange={(e) => setEvento({ ...evento, invitados: +e.target.value })} />
              </Field>
              <Field label="Tipo de evento">
                <Select value={evento.tipo} onValueChange={(v) => setEvento({ ...evento, tipo: v as any })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>{EVENT_TYPES.map((t) => <SelectItem key={t} value={t}>{t}</SelectItem>)}</SelectContent>
                </Select>
              </Field>
              <Field label="Cliente">
                <Select value={evento.clienteId} onValueChange={(v) => setEvento({ ...evento, clienteId: v })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent className="max-h-72">{customers.map((c) => <SelectItem key={c.id} value={c.id}>{c.nombre}</SelectItem>)}</SelectContent>
                </Select>
              </Field>
            </CardContent>
          </Card>

          <Card className="shadow-sm">
            <CardHeader>
              <CardTitle className="text-base">Catálogo de productos</CardTitle>
              <p className="text-xs text-muted-foreground">Selecciona productos por categoría y configúralos.</p>
            </CardHeader>
            <CardContent>
              <Tabs value={categoria} onValueChange={(v) => setCategoria(v as any)}>
                <TabsList className="flex h-auto flex-wrap gap-1 bg-muted/60 p-1">
                  {CATEGORIES.map((c) => (
                    <TabsTrigger key={c} value={c} className="text-xs data-[state=active]:bg-card data-[state=active]:text-primary">
                      {c}
                    </TabsTrigger>
                  ))}
                </TabsList>
                <TabsContent value={categoria} className="mt-4">
                  <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3">
                    {visibles.map((p) => (
                      <button
                        key={p.id}
                        onClick={() => openConfigurator(p)}
                        className="group flex flex-col overflow-hidden rounded-xl border bg-card text-left transition hover:shadow-md hover:border-primary/40"
                      >
                        <div className="aspect-[5/3] overflow-hidden bg-muted">
                          <img src={p.imagen} alt={p.nombre} loading="lazy" className="h-full w-full object-cover transition group-hover:scale-105" />
                        </div>
                        <div className="p-3 space-y-1">
                          <p className="text-sm font-medium line-clamp-1">{p.nombre}</p>
                          <p className="text-xs text-muted-foreground line-clamp-2">{p.descripcion}</p>
                          <div className="flex items-center justify-between pt-1">
                            <span className="text-sm font-semibold">{formatUSD(p.precio)}</span>
                            <Badge variant="outline" className="bg-accent text-accent-foreground border-accent">
                              <Plus className="h-3 w-3" /> Configurar
                            </Badge>
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>

        {/* Quote summary sticky panel */}
        <div className="lg:sticky lg:top-20 lg:self-start">
          <Card className="shadow-md border-primary/10">
            <CardHeader className="pb-3">
              <div className="flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-primary" />
                <CardTitle className="text-base">Resumen de cotización</CardTitle>
              </div>
              <p className="text-xs text-muted-foreground">Actualizada en tiempo real.</p>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
                {items.length === 0 && (
                  <p className="rounded-lg border border-dashed bg-muted/30 p-6 text-center text-xs text-muted-foreground">
                    Aún no has añadido productos.
                  </p>
                )}
                {items.map((i) => (
                  <div key={i.id} className="rounded-lg border p-3 text-sm space-y-2">
                    <div className="flex items-start justify-between gap-2">
                      <p className="font-medium leading-tight">{i.nombre}</p>
                      <button onClick={() => removeItem(i.id)} className="text-muted-foreground hover:text-destructive">
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                    {Object.entries(i.variantes).length > 0 && (
                      <div className="flex flex-wrap gap-1">
                        {Object.entries(i.variantes).map(([k, v]) => (
                          <Badge key={k} variant="secondary" className="text-[10px] font-normal">{k}: {v}</Badge>
                        ))}
                      </div>
                    )}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Button size="icon" variant="outline" className="h-7 w-7" onClick={() => updateQty(i.id, i.cantidad - 1)}>−</Button>
                        <span className="w-8 text-center text-sm">{i.cantidad}</span>
                        <Button size="icon" variant="outline" className="h-7 w-7" onClick={() => updateQty(i.id, i.cantidad + 1)}>+</Button>
                      </div>
                      <p className="font-semibold">{formatUSD(i.precio * i.cantidad)}</p>
                    </div>
                  </div>
                ))}
              </div>

              <Separator />
              <div className="space-y-2 text-sm">
                <Row label="Subtotal" value={formatUSD(subtotal)} />
                <div className="flex items-center justify-between gap-2">
                  <span className="text-muted-foreground">Descuento (%)</span>
                  <Input type="number" min={0} max={100} value={descuentoPct} onChange={(e) => setDescuentoPct(+e.target.value)} className="h-8 w-20 text-right" />
                </div>
                <Row label="Descuento aplicado" value={`− ${formatUSD(descuento)}`} muted />
                <Row label="IVA (13%)" value={formatUSD(impuesto)} muted />
                <Separator />
                <div className="flex items-center justify-between">
                  <span className="text-sm font-semibold">Total</span>
                  <span className="text-xl font-semibold text-primary">{formatUSD(total)}</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <Button variant="outline" onClick={() => toast.success("Borrador guardado")}>
                  <Save className="h-4 w-4" /> Borrador
                </Button>
                <Button variant="outline" onClick={() => toast.success("PDF generado")}>
                  <FileDown className="h-4 w-4" /> PDF
                </Button>
                <Button variant="outline" onClick={() => toast.success("Enviado por WhatsApp")}>
                  <MessageCircle className="h-4 w-4" /> WhatsApp
                </Button>
                <Button onClick={() => { toast.success("Cotización aprobada"); setTimeout(() => navigate({ to: "/eventos" }), 600); }} style={{ background: "var(--gradient-primary)" }}>
                  <Check className="h-4 w-4" /> Aprobar
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <Dialog open={!!configProduct} onOpenChange={(o) => !o && setConfigProduct(null)}>
        <DialogContent className="max-w-lg">
          {configProduct && (
            <>
              <DialogHeader>
                <DialogTitle>{configProduct.nombre}</DialogTitle>
                <DialogDescription>{configProduct.descripcion}</DialogDescription>
              </DialogHeader>
              <div className="aspect-[5/3] overflow-hidden rounded-lg bg-muted">
                <img src={configProduct.imagen} alt={configProduct.nombre} className="h-full w-full object-cover" />
              </div>
              <div className="space-y-3">
                {configProduct.variantes &&
                  Object.entries(configProduct.variantes).map(([k, opts]) => (
                    <Field key={k} label={k}>
                      <Select value={configVariants[k]} onValueChange={(v) => setConfigVariants({ ...configVariants, [k]: v })}>
                        <SelectTrigger><SelectValue /></SelectTrigger>
                        <SelectContent>{opts.map((o) => <SelectItem key={o} value={o}>{o}</SelectItem>)}</SelectContent>
                      </Select>
                    </Field>
                  ))}
                <Field label="Cantidad">
                  <Input type="number" min={1} value={configQty} onChange={(e) => setConfigQty(Math.max(1, +e.target.value))} />
                </Field>
                <div className="flex items-center justify-between rounded-lg bg-muted/50 p-3 text-sm">
                  <span className="text-muted-foreground">Subtotal del producto</span>
                  <span className="font-semibold text-primary">{formatUSD(configProduct.precio * configQty)}</span>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setConfigProduct(null)}>Cancelar</Button>
                <Button onClick={addConfigured} style={{ background: "var(--gradient-primary)" }}>
                  <Plus className="h-4 w-4" /> Añadir a cotización
                </Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1.5">
      <Label className="text-xs font-medium">{label}</Label>
      {children}
    </div>
  );
}

function Row({ label, value, muted }: { label: string; value: string; muted?: boolean }) {
  return (
    <div className="flex items-center justify-between">
      <span className={muted ? "text-muted-foreground" : ""}>{label}</span>
      <span className={muted ? "text-muted-foreground" : "font-medium"}>{value}</span>
    </div>
  );
}
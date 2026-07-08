# Arquitectura del Sistema

## Capas

```
┌──────────────────────────────────────────┐
│  Rutas (src/routes/)                     │
│  Páginas con lógica de negocio local     │
│  Dashboard, CRM, Eventos, Catálogo, etc. │
├──────────────────────────────────────────┤
│  Componentes App (src/components/)       │
│  app-sidebar, page-header                │
├──────────────────────────────────────────┤
│  UI Kit (src/components/ui/)             │
│  46 componentes shadcn/ui (New York)     │
├──────────────────────────────────────────┤
│  Lib (src/lib/)                          │
│  mock-data, format, utils, error-*       │
├──────────────────────────────────────────┤
│  Hooks (src/hooks/)                      │
│  use-mobile                              │
├──────────────────────────────────────────┤
│  Router (src/router.tsx, routeTree.gen)  │
│  TanStack Router + QueryClient           │
├──────────────────────────────────────────┤
│  Server (src/server.ts, start.ts)        │
│  Nitro SSR + error middleware            │
└──────────────────────────────────────────┘
```

## Árbol de rutas

```
/                        → Dashboard (index.tsx)
/calendario              → Calendario mensual (calendario.tsx)
/catalogo                → Catálogo de productos (catalogo.tsx)
/clientes                → CRM clientes (clientes.tsx)
/cotizaciones            → Lista de cotizaciones (cotizaciones.tsx)
/eventos                 → Layout (eventos.tsx) ─ Outlet ─┐
  /eventos/              → Lista de eventos (eventos.index.tsx)
  /eventos/nuevo         → Nuevo evento + cotización (eventos.nuevo.tsx)
/inventario              → Control de inventario (inventario.tsx)
/reportes                → Reportes y analíticas (reportes.tsx)
/sitemap.xml             → Sitemap dinámico SSR (sitemap[.]xml.ts)
```

## Flujo de datos actual

```
Ruta (ej. clientes.tsx)
  │
  ├── import { customers } from "@/lib/mock-data"
  │
  ├── useState para filtros/búsqueda locales
  │
  └── Render UI con datos mock
```

**No hay llamado a API real.** React Query está configurado pero sin queries definidas.

## Flujo de datos objetivo

```
Ruta
  │
  ├── useQuery({ queryKey: ["customers"], queryFn: customerRepo.getAll })
  │
  ├── CustomerRepo  →  fetch("/api/customers")  →  Backend  →  DB
  │
  └── Render UI con datos reales + caché de React Query
```

## Error handling

```
Error en SSR  →  h3 lo traga (solo devuelve 500 genérico)
                    │
                    ├── globalThis.addEventListener("error")  ← error-capture.ts
                    │    captura stack traces en buffer con TTL de 5s
                    │
                    └── server.ts: consumeLastCapturedError()
                         devuelve stack trace real en respuesta de error

Error en cliente  →  errorComponent en __root.tsx (error boundary de TanStack Router)

Error boundary  →  __root.tsx: errorComponent
                   muestra página de error con retry + go home
```

## Feature flags

**No existe sistema de feature flags.** Evaluar implementar uno simple basado en variables de entorno o query params para despliegues progresivos.

## Sidebar y navegación

```
AppSidebar (app-sidebar.tsx)
├── Panel Principal      → /
├── Clientes (CRM)       → /clientes
├── Eventos              → /eventos
├── Catálogo             → /catalogo
├── Cotizaciones         → /cotizaciones
├── Calendario           → /calendario
├── Inventario           → /inventario
└── Reportes             → /reportes
```

- Modo: íconos colapsables (icon mode).
- Footer: "Sofia Aguilar — Administradora" (hardcodeado).
- Estado sidebar persistido en cookie (`sidebar_state`, 7 días).

## Diseño visual

- **Estilo:** shadcn/ui New York, elegante.
- **Colores:** Primary = púrpura (oklch 295°), Gold = dorado (oklch 85°), Success = verde, Warning = ámbar.
- **Tema oscuro:** Soportado vía clase `.dark`. Aplica variables completas en `styles.css:114-147`.
- **Sombras:** Elegant shadow (10px blur púrpura 25% opacity), Soft shadow (1px/2px).
- **Tipografía:** Default del sistema, sin fuente custom definida.

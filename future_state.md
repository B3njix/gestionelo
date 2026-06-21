# Visión Futura del Sistema

## Arquitectura objetivo

```
┌─────────────┐     ┌──────────────┐     ┌─────────────┐
│  Frontend    │────▶│  API Layer   │────▶│  Database    │
│  (TanStack   │     │  (tRPC/REST) │     │  (PostgreSQL)│
│   Start SPA) │     │              │     │              │
└─────────────┘     └──────────────┘     └─────────────┘
       │                    │
       ▼                    ▼
┌─────────────┐     ┌──────────────┐
│  Static      │     │  Auth        │
│  Assets (CDN)│     │  (RBAC)      │
└─────────────┘     └──────────────┘
```

## Objetivos de escalabilidad

- **Multi-tenant:** Cada negocio de eventos tiene su propia cuenta con datos aislados.
- **Offline-first:** PWA con service worker. Editar cotizaciones sin conexión, sincronizar al reconectar.
- **Real-time:** Actualizaciones en vivo de inventario cuando se crea/modifica una cotización.
- **Reportes exportables:** PDF, CSV, Excel para todos los reportes.
- **Integraciones:** Calendario (Google/Outlook sync), WhatsApp Business API, pasarela de pagos.

## Simplificaciones deseadas

- **Extraer mock-data.ts** completamente. El archivo debe eliminarse cuando el backend esté estable.
- **Unificar tipos** en `src/types/` (hoy dispersos en `mock-data.ts` y rutas).
- **Componentizar `eventos.nuevo.tsx`** — está en ~800 líneas como un solo archivo monolítico.
- **Reducir componentes UI no usados** — shadcn genera 46 componentes pero solo ~20 se usan activamente.
- **Eliminar dependencias sin uso:** `input-otp`, `embla-carousel-react`, `vaul` (drawer ya cubierto por sheet).

## Features deseadas (priorizadas)

1. Autenticación con roles (admin, gerente, vendedor).
2. Dashboard con datos reales del backend.
3. Generación de PDF para cotizaciones (con marca y diseño).
4. Compartir cotizaciones por WhatsApp.
5. Alertas de stock bajo en inventario.
6. Integración con calendario externo (Google Calendar).
7. Historial de cambios en cotizaciones.
8. Módulo de proveedores.
9. App móvil (PWA inicialmente, nativa después).
10. Pasarela de pagos para anticipos de eventos.

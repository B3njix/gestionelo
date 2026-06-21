# Gestionelo - Memoria del Proyecto

## Estado actual

**Fase:** Migración a backend real en progreso.  
**Backend:** Supabase (PostgreSQL). Schema completo con 12 tablas, multi-tenant con RLS.  
**Mock data:** Aún activo como fallback. No migrado a Supabase aún.  
**Autenticación:** Implementada. Login con Supabase Auth nativo. Edge Function para signup multi-tenant.  
**Líneas de código:** ~14,000 (72 source files + 46 shadcn/ui components).  
**Commits:** Pendiente push de la sesión actual.

## Stack tecnológico

| Capa             | Tecnología                                            | Versión           |
| ---------------- | ----------------------------------------------------- | ----------------- |
| Runtime          | Bun (lockfile primario, npm fallback)                 | bun.lock          |
| Framework SSR    | TanStack Start (Nitro 3)                              | ^1.167.50         |
| Router           | TanStack Router (file-based)                          | ^1.168.25         |
| UI               | React 19 + shadcn/ui (New York style, 46 componentes) | ^19.2.0           |
| CSS              | Tailwind CSS v4 (oklch colors, CSS variables)         | ^4.2.1            |
| Build            | Vite 8                                                | ^8.0.16           |
| Estado servidor  | @tanstack/react-query                                 | ^5.83.0           |
| Gráficos         | recharts                                              | ^2.15.4           |
| Formularios      | react-hook-form + zod                                 | ^7.71.2 / ^3.24.2 |
| Backend DB       | Supabase (PostgreSQL, 12 tablas)                      | —                 |
| Backend Auth     | Supabase Auth (JWT nativo, user_metadata)             | —                 |
| Backend Fns      | Supabase Edge Functions (Deno)                        | —                 |
| Auth SSR         | @supabase/ssr (cookie utilities)                      | ^0.4.0+           |
| Cliente Supabase | @supabase/supabase-js                                 | ^2.x              |
| Lenguaje         | TypeScript strict (ES2022, bundler resolution)        | ^5.8.3            |
| Despliegue       | Lovable.dev → Cloudflare Workers                      | —                 |

## Convenciones

- **Formato:** Prettier (100 chars, comillas dobles, trailing commas, semicolons).
- **Linting:** ESLint flat config.
- **Alias de path:** `@/` → `./src/`.
- **Ruteo:** File-based en `src/routes/`. Patrón `server.handlers` para rutas API.
- **Estilos:** Solo oklch. Prohibido hex/rgb/hsl. Design tokens en `styles.css`.
- **Componentes:** shadcn/ui con CVA. Utilidad `cn()` para clases.
- **Formato de datos:** Locale `es-SV`, moneda USD, IVA 13%, fechas `dd/mm/yyyy`.
- **Auth:** JWT nativo de Supabase (NO custom JWT). Datos multi-tenant en `user_metadata`.
- **RLS:** Simplificado: solo `tenant_id` en políticas. Permisos en middleware.

## Módulos principales

| Módulo            | Ubicación                                    | Propósito                                                                                         |
| ----------------- | -------------------------------------------- | ------------------------------------------------------------------------------------------------- |
| Rutas (10)        | `src/routes/`                                | Dashboard, CRM, Eventos, Catálogo, Cotizaciones, Calendario, Inventario, Reportes, Login, Sitemap |
| UI Kit            | `src/components/ui/`                         | 46 componentes shadcn/ui                                                                          |
| App Shell         | `src/components/app-sidebar.tsx`             | Sidebar de navegación con datos reales del usuario autenticado                                    |
| Page Header       | `src/components/page-header.tsx`             | Header reutilizable                                                                               |
| Mock Data         | `src/lib/mock-data.ts`                       | 50 clientes, 100 productos, 30 eventos, 100 cotizaciones (fallback)                               |
| Formatters        | `src/lib/format.ts`                          | `formatUSD()`, `formatDate()`, `formatNumber()` (es-SV)                                           |
| Cliente Supabase  | `src/lib/supabase.ts`                        | Cliente browser tipado con `Database`                                                             |
| Servidor Supabase | `src/lib/supabase-server.ts`                 | Cliente SSR con cookies (@supabase/ssr)                                                           |
| Auth server fn    | `src/lib/auth.fn.ts`                         | Server function de login                                                                          |
| Auth context      | `src/hooks/use-auth.tsx`                     | AuthProvider, useAuth, useRequireAuth                                                             |
| Tipos DB          | `src/types/database.ts`                      | Tipos generados desde Supabase (12 tablas)                                                        |
| Edge Function     | `supabase/functions/auth/index.ts`           | Signup multi-tenant (crea user + tenant + branch + role)                                          |
| Error Handler     | `src/lib/error-capture.ts` + `src/server.ts` | Captura errores SSR                                                                               |

## Riesgos activos

1. **Mock data aún activo** — las rutas de negocio siguen importando `mock-data.ts`. Falta Fase 1 (repositorios + hooks React Query).
2. **Sin tests** — 0 tests de cualquier tipo.
3. **RLS permisivo en tablas de negocio** — políticas `USING (true)` en customers/products/events/quotes. Deben migrarse a `tenant_id`.
4. **Sin CI/CD** — no hay pipelines.
5. **Edge Function sin rate limiting** — Deno KV no implementado aún.
6. **Branch switcher no implementado** — el usuario solo puede estar en la branch "Principal".
7. **Sin página de signup en frontend** — solo Edge Function. Se necesita `src/routes/signup.tsx`.

## Prioridades activas (orden)

1. Fase 1: Repositorios + hooks React Query para migrar de mock-data a Supabase.
2. Actualizar RLS policies en tablas de negocio a `tenant_id`.
3. Página de signup en frontend.
4. Rate limiting en Edge Functions (Deno KV).
5. Branch switcher.
6. Tests.
7. CI/CD.

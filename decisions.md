# Decisiones Técnicas

## Elección del framework: TanStack Start

**Fecha:** Junio 2026 (fundación del proyecto).
**Decisión:** TanStack Start sobre Next.js, Remix o SvelteKit.
**Motivo:** TanStack Start ofrece SSR con Nitro, file-based routing integrado, y React Query como primera opción para fetching.
**Trade-off:** Menos ecosistema y ejemplos que Next.js, pero mejor integración con React Query y menor overhead que App Router.

## Librería de componentes: shadcn/ui (New York style)

**Decisión:** shadcn/ui sobre Material UI, Ant Design, Chakra UI o Tailwind UI.
**Motivo:** Componentes copiables y personalizables (no dependencia de paquete), compatibles con Tailwind v4, estilo New York más limpio para ERP.
**Trade-off:** 46 archivos de componentes en el repo que requieren mantenimiento manual.

## Backend: Supabase (PostgreSQL + Auth + Edge Functions)

**Fecha:** Junio 2026 (migración desde mock data).
**Decisión:** Supabase sobre Firebase, AppWrite, Neon, o backend custom.
**Motivo:** PostgreSQL completo con RLS nativa, Auth integrado con JWT nativo, Edge Functions en Deno/TypeScript, Realtime para eventos, storage. Un solo vendor para DB + Auth + Functions + Events.
**Trade-off:** Vendor lock-in con Supabase. Las Edge Functions tienen cold starts (~1-2s). Limitación de 60s por ejecución.

## Estrategia multi-tenant: tenant_id + RLS

**Fecha:** Junio 2026.
**Decisión:** Base de datos compartida con columna `tenant_id` en cada tabla + RLS policies.
**Motivo:** Más simple de mantener que schema-per-tenant o DB-per-tenant. RLS de Supabase garantiza aislamiento a nivel de fila. Suficiente para <10k tenants. Backups unificados.
**Trade-off:** Un bug en una RLS policy expone datos de todos los tenants. Requiere tests de integración rigurosos.

## Autenticación: JWT nativo de Supabase (NO custom JWT)

**Fecha:** Junio 2026.
**Decisión:** Usar el JWT nativo que Supabase firma internamente, con `user_metadata.tenant_id` para identidad multi-tenant.
**Rechazado:** JWT custom firmado por Edge Function propia.
**Motivo del rechazo:** Supabase solo confía en sus propios JWTs para RLS. Un JWT custom no sería reconocido por las políticas RLS. Generar JWT custom requiere Edge Functions como proxy con `service_role`, invalidando el propósito de RLS.
**Trade-off:** Los claims del JWT están limitados a lo que `user_metadata` permite. No se pueden agregar claims dinámicos sin `admin.updateUserById`.

## Login: Server function de TanStack Start

**Decisión:** El login ocurre en una server function (`@tanstack/react-start`), no en una Edge Function.
**Motivo:** La server function corre en el mismo dominio que la app (Nitro), permitiendo manejar cookies `httpOnly` sin CORS. La Edge Function se reserva para signup (requiere `service_role`).
**Trade-off:** El server function usa `signInWithPassword` y devuelve el token al cliente para `setSession()`. Las cookies no son httpOnly en esta iteración.

## Signup: Edge Function de Supabase (service_role)

**Decisión:** El signup usa una Edge Function con `service_role` para crear el auth.user, tenant, branch, profile y user_branch_role en una transacción manual.
**Motivo:** `admin.createUser` requiere `service_role` key. La transacción manual con rollback garantiza consistencia si algún paso falla. El `tenant_id` se almacena en `user_metadata` del JWT.
**Trade-off:** Cold start de Edge Functions (~1-2s). Sin rate limiting aún.

## Roles: globales (tenant_id IS NULL)

**Decisión:** Los roles base (super_admin, admin, gerente, vendedor) tienen `tenant_id IS NULL`, sirviendo como plantillas globales.
**Motivo:** Centraliza la definición de permisos. Cada tenant comparte los mismos roles base. Si un tenant necesita roles custom, puede crearlos con `tenant_id = su_id`.
**Trade-off:** Cambiar un rol global afecta a todos los tenants. Requiere control de cambios.

## Event bus: Supabase Realtime (broadcast post-commit)

**Decisión:** Usar Supabase Realtime para comunicación asíncrona entre servicios, con broadcasts desde las Edge Functions después del commit a DB.
**Rechazado:** `pg_notify` con listener persistente (no funciona en Edge Functions serverless). Triggers con `net.http_post` (bloquean la transacción, sin retry).
**Trade-off:** Realtime depende de WebSocket. Si el broadcast falla después del commit, el evento se pierde. Para eventos críticos se necesita outbox pattern o cola de mensajes.

## SSR: @supabase/ssr

**Decisión:** Usar `@supabase/ssr` para manejo de cookies del lado servidor (parseCookieHeader, serializeCookieHeader).
**Motivo:** Permite al server function de login acceder a la sesión de Supabase desde las cookies y propagar cambios de sesión al cliente.
**Trade-off:** API en evolución (v0.4+ cambió de `getAll`/`setAll` sync a async). Tipos estrictos requieren filtrado de cookies sin valor.

## CSS: Tailwind v4 con oklch

**Decisión:** Tailwind v4 sobre v3, sistema de diseño con oklch sobre RGB/HSL.
**Motivo:** v4 elimina `tailwind.config.js`, usa CSS-first configuration, mejor rendimiento. oklch permite colores perceptuales con transiciones suaves entre temas claro/oscuro.
**Trade-off:** Curva de aprendizaje para oklch, poca documentación comparada con hex/rgb.

## Mock data como capa de datos inicial

**Decisión:** Crear `src/lib/mock-data.ts` con 100% de la data generada localmente.
**Motivo:** Permitió construir un prototipo completo en 3 días sin dependencia de backend. La estructura de tipos (Customer, Product, EventItem, Quote) sirve como contrato para futura API.
**Trade-off:** Ahora es la principal deuda técnica — todas las rutas importan mock data directamente. Migración a Supabase en progreso.

## Package manager: Bun

**Decisión:** Bun como gestor primario, npm como fallback.
**Motivo:** Bun ofrece instalación más rápida y lockfile binario. npm lockfile se mantiene para entornos que no soportan Bun.
**Trade-off:** Doble lockfile que puede desincronizarse.

## Gráficos: recharts

**Decisión:** recharts sobre visx, nivo, o chart.js.
**Motivo:** API declarativa con componentes React, buena integración con shadcn/ui (chart.tsx wrapper).
**Trade-off:** Bundle size moderado (~150KB). No es el más performante para datasets grandes.

## Formularios: react-hook-form + zod

**Decisión:** react-hook-form + zod desde el inicio. Activado en login con `zodResolver`.
**Motivo:** Validación tipada con zod, integración con TypeScript. El formulario de `eventos.nuevo.tsx` aún usa `useState` manual (pendiente migrar).

## Despliegue: Vercel (SSR con Nitro)

**Decisión:** Usar Vercel como plataforma de despliegue con Nitro preset `vercel`.
**Motivo:** Vercel ofrece SSR serverless con soporte nativo para Nitro, cold starts rápidos y CI/CD integrado con GitHub.
**Trade-off:** Las funciones serverless tienen límite de 30s de ejecución. Costos pueden escalar con tráfico.

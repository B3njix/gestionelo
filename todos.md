# Roadmap y Tareas

## Completado (sesión Junio 2026)

### Infraestructura multi-tenant

- [x] Schema Supabase: 12 tablas (tenants, branches, roles, profiles, user_branch_roles, invitations + 6 de negocio con tenant_id).
- [x] Seed de roles globales: super_admin, admin, gerente, vendedor.
- [x] RLS habilitado en todas las tablas.
- [x] Variables de entorno (`.env` + `.env.example`).
- [x] Tipos TypeScript generados desde Supabase (`src/types/database.ts`).
- [x] Cliente Supabase tipado (`src/lib/supabase.ts`).

### Autenticación

- [x] Edge Function `/auth/signup`: crea user + tenant + branch + profile + role en transacción manual con rollback.
- [x] Server function `loginFn`: signInWithPassword, devuelve session.
- [x] Página de login (`/login`) con react-hook-form + zod.
- [x] AuthProvider + useAuth + useRequireAuth (`src/hooks/use-auth.tsx`).
- [x] Protección de rutas: redirige a `/login` si no autenticado.
- [x] Sidebar muestra datos reales del usuario autenticado.
- [x] Logout funcional con dropdown menu en header.

---

## Deuda técnica prioritaria

### P0 - Bloqueantes para producción

- [ ] **Actualizar RLS en tablas de negocio:** customers, products, events, quotes, quote_items, categories aún tienen políticas `USING (true)`. Deben migrar a `tenant_id` con `auth.jwt() -> 'user_metadata' ->> 'tenant_id'`.
- [ ] **Fase 1: Repositorios + hooks React Query:** Migrar las 9 rutas de negocio de `mock-data.ts` a Supabase.
- [ ] **Página de signup en frontend:** Conectar el formulario de registro con la Edge Function `/auth/signup`.

### P1 - Calidad y mantenibilidad

- [ ] **Tests:** 0 tests. Configurar Vitest + React Testing Library.
- [ ] **Migrar formularios a react-hook-form:** `eventos.nuevo.tsx` (302 líneas, useState manual).
- [ ] **Rate limiting en Edge Functions:** Deno KV en `/auth/signup` y `/auth/login`.
- [ ] **Middleware de permisos reutilizable:** Función `requirePermission(ctx, resource, action)` para Edge Functions.

### P2 - Funcionalidad

- [ ] **Branch switcher:** Selector de sucursal en el header/sidebar. Cambiar `current_branch_id`.
- [ ] **Invitaciones:** Flujo completo de invitación por email + signup con token.
- [ ] **Generación de PDF:** Cotizaciones y reportes exportables.
- [ ] **Integración WhatsApp:** Compartir cotizaciones por WhatsApp.
- [ ] **Notificaciones:** Alertas de stock bajo, eventos próximos, cotizaciones pendientes.
- [ ] **Cálculo configurable de IVA:** Hoy hardcodeado 13%. Usar `tenants.config.iva`.

### P3 - Infraestructura

- [ ] **CI/CD:** GitHub Actions para lint, typecheck, build, deploy.
- [ ] **Monitoreo de errores:** Sentry/LogRocket.
- [ ] **Feature flags:** Sistema de toggles para deploy progresivo.
- [ ] **PWA:** Service worker para offline-first.

## Mejoras arquitectónicas

- Extraer lógica de negocio a `src/services/` (separar de rutas).
- Unificar tipos en `src/types/index.ts` (hoy en `mock-data.ts`).
- Componentizar `eventos.nuevo.tsx` (monolítico, 302 líneas).
- Super admin dashboard (ver todos los tenants).
- Estrategia de backup/restore por tenant.

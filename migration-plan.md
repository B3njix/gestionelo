# Plan de Migración

## Migraciones activas

**Fase actual:** Prototipo → Producción (en planificación).  
**Sin migraciones en curso.** El proyecto está en fase 0 (prototipo funcional).

## Fases planificadas

### Fase 1: Abstracción de capa de datos (Semana 1-2)

- [ ] Crear `src/repositories/` con interfaces por dominio:
  - `CustomerRepository`
  - `ProductRepository`
  - `EventRepository`
  - `QuoteRepository`
- [ ] Implementar `MockCustomerRepository` que consuma `mock-data.ts`.
- [ ] Refactorizar todas las rutas para usar repositorios en lugar de imports directos.
- [ ] Agregar `useQuery`/`useMutation` en cada ruta usando repositorios.
- **Riesgo:** Romper compatibilidad de tipos. **Mitigación:** Mantener los tipos en `mock-data.ts` temporalmente.

### Fase 2: Backend real (Semana 3-6)

- [ ] Seleccionar stack backend (tRPC sobre Nitro, o REST API externa).
- [ ] Modelar schema de base de datos (PostgreSQL recomendado).
- [ ] Implementar API endpoints.
- [ ] Crear `ApiCustomerRepository`, `ApiProductRepository`, etc.
- [ ] Feature flag para switchear entre mock y real: `VITE_DATA_SOURCE=mock|api`.
- [ ] Eliminar `mock-data.ts` cuando API esté estable.
- **Riesgo:** Cambios en el contrato de datos que rompan la UI. **Mitigación:** Tests de integración antes de migrar.

### Fase 3: Autenticación y autorización (Semana 5-8)

- [ ] Implementar sistema de login (email + contraseña).
- [ ] Definir roles: admin, gerente, vendedor.
- [ ] Proteger rutas según rol (middleware en `__root.tsx` o per-route).
- [ ] Reemplazar "Sofia Aguilar" hardcodeado con datos del usuario autenticado.
- [ ] Migrar cookie `sidebar_state` a server-side en sesión.
- **Riesgo:** Regresiones en rutas no protegidas. **Mitigación:** Feature flag `AUTH_ENABLED`.

### Fase 4: Deploy y hardening (Semana 8+)

- [ ] Configurar CI/CD (GitHub Actions).
- [ ] Variables de entorno para todos los entornos.
- [ ] Setup de staging separado de producción.
- [ ] Monitoreo de errores (Sentry/LogRocket).
- [ ] Optimización de bundle (tree-shaking, code splitting).
- **Riesgo:** Configuración de deploy específica de Lovable.dev/Cloudflare. **Mitigación:** Documentar pasos de migración a otros providers.

## Legacy systems a deprecar

| Sistema               | Estado                         | Plan                                             |
| --------------------- | ------------------------------ | ------------------------------------------------ |
| `mock-data.ts`        | Activo (fuente única de datos) | Deprecar en Fase 2, eliminar al finalizar Fase 2 |
| `@hookform/resolvers` | Instalado, sin uso             | Activar en Fase 1 (refactor forms)               |
| `react-hook-form`     | Instalado, sin uso             | Activar en Fase 1 (refactor forms)               |
| Lovable.dev hosting   | Activo (producción)            | Evaluar migración a proveedor propio en Fase 4   |

## Riesgos de transición

1. **Pérdida de datos mock** al migrar a backend real — mantener mock data como fixtures de tests.
2. **Breaking changes en API** durante desarrollo — versionar endpoints (v1, v2).
3. **Downtime en deploy** — implementar blue-green o al menos build validation pre-deploy.
4. **Regresiones visuales** al refactorizar rutas — tests de snapshot con Playwright.
5. **Desincronización de tipos** entre frontend y backend — usar shared types package o code generation.

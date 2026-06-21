# Reglas del Proyecto

## Restricciones de Git (Lovable.dev)

- **NO** hacer force push, rebase, amend ni squash de commits ya publicados.
- Mantener el branch `main` en estado funcional (compila y arranca).
- Commits se sincronizan automáticamente con Lovable.dev.

## Convenciones de código

- **TypeScript strict** en todo el proyecto. No usar `any` sin justificación.
- **Sin comentarios** en el código fuente a menos que sean estrictamente necesarios.
- **Import alias:** usar `@/components/...`, `@/lib/...`, `@/hooks/...` — nunca rutas relativas largas.
- **Nombres de ruta:** kebab-case para archivos (`clientes.tsx`, `eventos.nuevo.tsx`). Rutas anidadas con `.` (dot notation).
- **Formato automático:** Prettier en pre-commit. Ejecutar `bun run format` antes de commitear.

## Reglas de estilos

- **Solo oklch** para colores. Nunca usar hex (#fff), rgb(), hsl() o named colors.
- Los tokens de diseño están en `src/styles.css`. Agregar nuevos tokens allí, no inline.
- Usar `cn()` (`@/lib/utils`) para composición de clases. No usar template literals para className.
- Tailwind v4: usar `@theme inline` y CSS custom properties. No usar `tailwind.config.js`.
- El tema oscuro se aplica con clase `.dark` en el `<html>`.

## Restricciones arquitectónicas

- **No agregar nuevas librerías** sin consultar la tabla de dependencias en memory.md.
- **No introducir state management externo** (Redux, Zustand, Jotai, etc.). Usar React Query para estado servidor y useState para estado local.
- **No crear nuevos componentes UI** si ya existe un equivalente en shadcn/ui o `src/components/`.
- **No mezclar lógica de servidor y cliente** en un mismo archivo de ruta sin usar `server.handlers.*`.
- **Rutas nuevas** deben registrarse en el sidebar (`app-sidebar.tsx`) si son secciones principales.
- **Todo dato formateado** debe pasar por las funciones en `src/lib/format.ts` (USD, fechas, números).
- **IVA siempre 13%** para cálculos de cotizaciones.

## Principios de refactor

- **Extraer antes de duplicar:** si un patrón se repite 3+ veces, extraer a componente/utilidad.
- **No romper la compatibilidad** con el archivo de ruta existente al refactorizar.
- **Mantener el contrato de tipos** definido en `mock-data.ts` (Customer, Product, EventItem, Quote, etc.).
- **Prohibido tocar `src/routeTree.gen.ts`** — es autogenerado por TanStack Router plugin.
- **Prohibido modificar componentes en `src/components/ui/`** — son generados por shadcn CLI.

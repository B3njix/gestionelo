# Inicio de Sesión - Instrucciones Persistentes

## Antes de cualquier cambio, leer en orden:

1. **memory.md** — Estado actual, stack, riesgos, prioridades.
2. **rules.md** — Convenciones de código, restricciones, principios de refactor.
3. **architecture.md** — Capas, flujos, rutas, feature flags.
4. **decisions.md** — Decisiones técnicas históricas y trade-offs.
5. **todos.md** — Deuda técnica y roadmap.
6. **AGENTS.md** — Reglas de Lovable.dev (no reescribir historia git).

## Comportamiento esperado

- No modificar `src/routeTree.gen.ts` ni `src/components/ui/` sin autorización explícita.
- No introducir nuevas dependencias sin verificar duplicación con las existentes.
- Usar `@/` path alias para todos los imports.
- Usar `cn()` para composición de clases Tailwind.
- Usar `formatUSD()`, `formatDate()`, `formatNumber()` para cualquier dato formateado.
- IVA siempre 13% en cálculos financieros.
- No hacer force push, rebase ni amend de commits publicados.
- No deployar sin antes ejecutar `bun run lint` y `bun run build`.

## Al iniciar trabajo nuevo

- Leer los archivos de contexto listados arriba.
- Verificar `git status` y `git log --oneline -5` para entender cambios recientes.
- Si el trabajo involucra una ruta específica, leer el archivo de ruta completo antes de editar.
- Si el trabajo involucra mock data, considerar si es momento de migrar a repositorio.

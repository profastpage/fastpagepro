## AGENTS.md

### Skills Obligatorias Segun La Tarea

- Usa `$master-frontend` para landing pages, bloques visuales, theming, animaciones, componentes y refinamiento UX.
- Usa `$master-backend` para endpoints, auth, Prisma, Firebase, validaciones, integraciones y reglas de seguridad.
- Usa `$master-fullstack` cuando el cambio abarque experiencia UI y logica server-side en la misma tarea.
- `$master-frontend` y `$master-fullstack` implican UI totalmente responsive como baseline obligatorio: mobile-first, sin overflow horizontal, con `max-width: 100%` donde haga falta, grids responsive, top navbar fija en mobile si existe navegacion superior, sidebar solo en desktop si existe navegacion lateral y cards apiladas verticalmente en mobile.

### Orden De Lectura Antes De Cambiar Codigo

1. Leer `docs/contract.md` si existe.
2. Leer `docs/context.md` si existe.
3. Leer `docs/PROJECT_CONTEXT.md` solo como resumen derivado.
4. En cambios UI, leer `docs/UI_GUARDRAILS.md` y `docs/CARTA_THEMING.md`.
5. Si falta documentacion, usar `README.md` y la estructura real del proyecto como referencia.

### Reglas Del Proyecto

- Preservar el lenguaje visual premium del sistema.
- Mantener cambios de diff minimo: no refactorizar zonas no relacionadas.
- Reutilizar componentes, patrones y utilidades existentes antes de crear variantes nuevas.
- En backend, validar input y mantener contratos HTTP estables salvo que el usuario pida romperlos.
- Nunca exponer secretos, tokens o stack traces.

### Librerias Y Criterio Tecnico

- `sharp`: usar cuando haya procesamiento de imagenes.
- `cloudinary`: usar cuando haga falta entrega publica o variantes de imagen estables.
- `@rive-app/react-webgl2`, `framer-motion`, `gsap`: usar solo si aportan valor real y con fallback ligero cuando aplique.
- `@upstash/ratelimit` + `@upstash/redis`: usar para rate limiting en rutas sensibles.
- `zod`: usar para validar `body`, `query` y `params` en backend.
- Evitar complejidad visual o tecnica innecesaria en tareas simples.

### Validacion Obligatoria

- Ejecutar `npm run typecheck` despues de cambios relevantes.
- Ejecutar `npm run build` antes de cerrar cambios importantes.
- Ejecutar `npm run lint` cuando se toquen componentes, rutas o utilidades compartidas.

### Flujo De Trabajo

- Respetar la identidad visual y las reglas documentadas del proyecto.
- No hacer commits, push ni deploy salvo que el usuario lo pida explicitamente.
- Si cambian rutas, contratos, arquitectura o env vars, actualizar la documentacion correspondiente.

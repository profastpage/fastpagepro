## Reglas Permanentes de Ejecucion

### Uso Autonomo de Librerias Instaladas

- El agente puede elegir y usar automaticamente las librerias ya instaladas cuando aporten valor real al resultado.
- El agente puede combinar librerias para maximizar calidad visual, UX, rendimiento y mantenibilidad sin pedir instrucciones detalladas previas.
- El agente debe validar siempre estabilidad tecnica despues de cambios relevantes (`npm run typecheck` y, cuando aplique, `npm run build`).

### Politica Automatizada por Libreria

- `sharp`: usar por defecto en backend para optimizacion de imagenes (resize, compresion, conversion de formato, thumbnails) cuando se procese o genere media.
- `cloudinary`: usar por defecto para offload, entrega y transformacion de imagenes en produccion cuando se requiera URL publica estable, CDN y variantes de calidad/tamano.
- `@rive-app/react-webgl2`: usar en frontend para animaciones interactivas premium en secciones clave (hero, onboarding, conversion) solo cuando el impacto UX lo justifique.
- En dispositivos low-end o con `prefers-reduced-motion`, priorizar fallback ligero (imagen estatica/CSS) sobre animaciones pesadas.
- Evitar usar estas librerias si la tarea es simple y se resuelve mejor con HTML/CSS/JS nativo sin aumentar complejidad.

### UI Guardrails Obligatorio

- Para cualquier cambio de interfaz, aplicar obligatoriamente `docs/UI_GUARDRAILS.md` antes de editar y validar al finalizar.
- Mantener cambios no destructivos y de diff minimo: no refactorizar UI no relacionada.
- Antes de cerrar una tarea UI, validar como minimo ausencia de x-scroll y overlaps en `320px`, `375px`, `768px` y `1440px`.
- Con cada cambio aprobado y validado, hacer siempre `git add -A`, `git commit`, `git push` y desplegar en Vercel para ver la actualizacion publicada.

### Entrega Continua Obligatoria

- Flujo obligatorio por cada cambio: validar (`npm run typecheck` y/o `npm run build`), luego `commit`, `push` a GitHub y `deploy` a Vercel.
- No cerrar una tarea sin dejar el cambio subido y desplegado, salvo que el usuario indique explicitamente no desplegar.

### Backend Guardrails Obligatorio

- Para cualquier implementacion backend nueva o cambio en endpoints existentes, aplicar validacion de entrada con `zod` (request body/query/params) y devolver errores `400` claros cuando falle.
- Aplicar rate limit server-side por ruta sensible usando `@upstash/ratelimit` + `@upstash/redis` (`auth`, `payments`, `referrals`, operaciones intensivas).
- Usar identificadores y sufijos no predecibles con `nanoid`/`customAlphabet`; evitar `Math.random` para IDs de negocio, referencias o codigos.
- Mantener compatibilidad hacia atras: no romper contrato HTTP existente (shape de response, codigos principales y rutas publicas) salvo solicitud explicita.
- En endpoints autenticados, verificar identidad por backend (`requireFirebaseUser` o equivalente) y no confiar en datos de usuario enviados por el cliente.
- En flujos de pago (Stripe u otros), aplicar idempotencia y controles de estado para evitar dobles cobros/doble activacion.
- Estandarizar errores operativos: `401` no autorizado, `403` prohibido, `404` no encontrado, `409` conflicto, `429` rate limit, `503` servicio no disponible.
- Al cerrar tareas backend, validar obligatoriamente con `npm run typecheck` y, cuando aplique, `npm run build`.

### Excepciones que Requieren Confirmacion

- Cambios de arquitectura o infraestructura con riesgo de ruptura.
- Integraciones o APIs con costo economico.
- Cambios sensibles de seguridad, autenticacion o autorizacion.
- Migraciones amplias con impacto transversal.

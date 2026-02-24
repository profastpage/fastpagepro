# PROJECT_CONTEXT

## Resumen

Este repositorio usa Next.js App Router y expone endpoints en `src/app/api`.
Se aplico una migracion incremental hacia arquitectura 3C (Contract, Core, Context)
sin cambios de rutas publicas ni cambios de esquema en Firestore.

## Modulo migrado a 3C (fase 1)

- Modulo: `publish`
- Ruta publica preservada: `POST /api/publish`

### Contract (`src/contract/publish`)

- DTOs de entrada/salida del caso de uso.
- Interfaz del caso de uso.
- Puertos para repositorio y servicio de inyeccion de tracking.

### Core (`src/core/publish`)

- Caso de uso puro `PublishSiteCoreUseCase`.
- Reglas de validacion y optimizacion HTML.
- Sin imports de Next.js, Firebase u otros frameworks.

### Context (`src/context/publish`)

- Adaptador de repositorio a `sitesStorage` actual.
- Adaptador de tracking a `injectMetricsTracking`.
- Builder para instanciar el caso de uso con dependencias concretas.

## Compatibilidad

- Se mantiene el endpoint y shape de respuesta de `POST /api/publish`.
- Se mantiene el storage `cloned_sites` via `sitesStorage`.
- Sin cambios en rutas de frontend ni contratos publicos existentes.

## Modulo nuevo: Link Hub (dashboard)

- Ruta privada: `/linkhub`
- Ruta publica: `/bio/[slug]`
- Coleccion Firestore: `link_profiles`

### Alcance

- Editor estilo Linktree dentro del dashboard para configurar:
  - foto de perfil
  - nombre y bio
  - slug publico
  - enlaces sociales/CTA
  - tema visual
- Personalizacion avanzada de imagen y branding:
  - adjuntar avatar por archivo (con optimizacion cliente)
  - 10 temas adicionales (mas tema RGB custom)
  - color primario y secundario editable para cualquier tema
- Publicacion sin tocar rutas existentes.

## Modulo nuevo: Published Projects (dashboard)

- Ruta privada: `/published`
- Navegacion disponible en:
  - navbar principal (`/components/Nav`)
  - tarjetas del Hub (`/hub`)

### Alcance funcional

- Vista unificada de publicaciones del usuario autenticado:
  - proyectos publicados en `cloned_sites` (Builder, Cloner/Editor, Store)
  - perfil Link Hub publicado en `link_profiles/{uid}`
- Acciones por item:
  - abrir URL publicada
  - copiar URL
  - volver al editor correspondiente

### Flujo de publicacion

- Al publicar desde Builder, Editor o Store se redirige a:
  - `/published?highlight={projectId}&kind=site`
- Al publicar desde Link Hub se redirige a:
  - `/published?highlight=linkhub-{uid}&kind=linkhub`
- El listado en `/published` muestra el item resaltado mediante `highlight`.

### Persistencia

- No se introducen nuevas colecciones ni cambios de esquema.
- Link Hub agrega `publishedAt` opcional dentro de `link_profiles`.
- Builder guarda metadatos para rehidratacion de edicion:
  - `builderBlocks`
  - `builderPrimaryColor`
  - `builderSecondaryColor`

## Firestore Rules Update (2026-02-24)

- Coleccion afectada: `link_profiles`.
- Se reforzo ownership para escritura usando `documentId == auth.uid` y `request.resource.data.userId == auth.uid`.
- Se mantiene lectura publica solo para perfiles `published == true`.
- Se agrego compatibilidad con documentos legacy que no tenian `userId` en el recurso existente, evitando bloqueos de `update` para el propietario real.

## Link Hub 2.0 Upgrade (2026-02-24)

- Ruta privada: `/linkhub` y ruta publica: `/bio/[slug]`.
- Link Hub ahora soporta modo de negocio:
  - `restaurant`: tabs `contacto + carta + ubicacion`
  - `general`: tabs `contacto + catalogo + ubicacion`
- Se agrega modulo de catalogo digital online configurable:
  - categorias y productos/items dinamicos
  - precios, precio referencial, badge y emoji por item
- Se agrega modulo de ubicacion:
  - direccion
  - mapa embebido y URL de Google Maps
  - horarios en multilinea
- Se agrega modulo de activacion comercial:
  - seccion `Catalogo digital online`
  - 3 planes editables (titulo, precios, features, CTA)
- Persistencia:
  - se mantienen documentos en `link_profiles/{uid}`
  - se extiende schema sin romper documentos existentes mediante normalizacion de defaults.

## Link Hub Editor UX Boost (2026-02-24)

- Editor de catalogo/carta optimizado para operacion diaria:
  - busqueda de items en tiempo real dentro del editor
  - acciones rapidas por item: mover, duplicar y eliminar
  - preview de imagen por item dentro del formulario
- Carga de imagen simplificada:
  - subida de portada por archivo (con optimizacion en cliente)
  - subida de imagen por producto/item por archivo (con optimizacion en cliente)
  - soporte continuo de URL manual para casos avanzados
- Resiliencia para usuarios no tecnicos:
  - borrador local automatico en navegador por usuario autenticado
  - recuperacion de borrador local reciente al abrir `/linkhub`

## Public Bio Responsive Nav Fix (2026-02-24)

- Ruta publica ajustada: `/bio/[slug]`.
- Mobile:
  - menu inferior fijo, centrado y alineado con safe-area
  - botones de `contacto/carta- catalogo/ubicacion` con ancho uniforme y texto truncado para evitar desbordes
- Desktop:
  - layout expandido (sin marco tipo telefono angosto)
  - tabs de navegacion visibles arriba del contenido principal
- Se mantiene compatibilidad de datos y comportamiento funcional de secciones.

## Public Bio Header + Share UX (2026-02-24)

- Header superior fijo dentro del card con:
  - avatar pequeno del perfil
  - boton de compartir (Web Share API con fallback a copiar enlace)
- Comportamiento por submenu:
  - `contacto`: mantiene portada + avatar grande
  - `carta/catalogo` y `ubicacion`: vista compacta (solo avatar pequeno arriba, sin hero grande)
- Buscador en tiempo real de carta/catalogo mantenido y con placeholder contextual:
  - `Buscar en la carta...`
  - `Buscar en el catalogo...`

## Public Carta/Catalogo Sticky + Scroll Sync (2026-02-24)

- Ruta publica ajustada: `/bio/[slug]` en la tab `carta/catalogo`.
- UX mobile/desktop en catalogo:
  - bloque superior de buscador + chips de categorias permanece fijo (`sticky`) durante el scroll interno de productos.
  - auto-seleccion de categoria por posicion de scroll: el chip activo cambia segun la seccion visible (ej. `Chicharrones`).
  - click en chip realiza scroll hacia la categoria respetando offset del bloque sticky.
  - chips y lista usan `no-scrollbar` para evitar barras visuales incomodas en horizontal/vertical.
- Publico final:
  - la seccion de planes/comercial se mantiene solo en dashboard de creacion (`/linkhub`) y no se renderiza en la pagina publicada del cliente (`/bio/[slug]`).

## Public Bio Theme-Surface Alignment (2026-02-24)

- Ruta publica ajustada: `/bio/[slug]`.
- Se reemplazan fondos negros duros en la experiencia publicada por superficies derivadas de los colores del tema del usuario:
  - fondo general de pagina y wrapper
  - barra superior con avatar + compartir
  - bloque sticky de buscador/categorias en carta/catalogo
  - tarjetas de secciones y tarjetas de items
  - menu inferior mobile
- Se refuerza consistencia visual:
  - gradientes coherentes con `themePrimaryColor` y `themeSecondaryColor`
  - profundidad sutil en botones activos mediante sombra tematica
  - mejor continuidad visual entre contacto, carta/catalogo y ubicacion.

## Link Hub Cover Slider (2026-02-24)

- Dashboard `/linkhub`:
  - portada ahora soporta hasta `5` imagenes por perfil (`coverImageUrls`).
  - carga multiple por archivo (`input[file][multiple]`) con optimizacion cliente.
  - alta por URL manual + validacion.
  - grilla de previews con eliminacion individual y accion `Quitar todo`.
- Persistencia:
  - se agrega `coverImageUrls: string[]` al perfil.
  - compatibilidad backward: `coverImageUrl` legacy se mantiene y se sincroniza al primer elemento del array.
- Publico `/bio/[slug]`:
  - en `contacto`, si existen 2 o mas portadas se activa carrusel automatico con transicion elegante (fade + zoom suave).
  - si hay una sola portada se muestra fija; si no hay portada se mantiene fallback de gradiente.

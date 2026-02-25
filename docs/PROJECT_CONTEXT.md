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

## Public Contact Social UX (2026-02-24)

- Ruta publica ajustada: `/bio/[slug]` en tab `contacto`.
- Redes sociales:
  - se muestran como iconos tipo app (dinamicos segun enlaces configurados en dashboard).
  - color visual por red (Facebook, Instagram, TikTok, WhatsApp, etc.) para una UX mas clara y moderna.
- CTA de contacto:
  - botones `Llamar ahora` y `Escribir ahora` con estilo limpio tipo tarjeta.
  - `Escribir ahora` usa icono de WhatsApp y abre `wa.me` segun el numero configurado en dashboard.
  - `Llamar ahora` usa `tel:` segun telefono configurado en dashboard.
- Se elimina lista redundante de enlaces con texto en la tarjeta de contacto para reducir ruido y mejorar conversion.

## Landing Readability + Encoding Guard (2026-02-24)

- Ruta ajustada: `/` (landing principal).
- Mejoras visuales de lectura:
  - subtitulo del hero con mejor jerarquia y salto de linea limpio en desktop.
  - CTA principal sin ruido visual innecesario para lectura mas clara.
  - FAQ mobile/desktop con mejor contraste, padding, altura de linea y estados abiertos mas legibles.
- Correccion transversal de textos:
  - se agrega `fixMojibake()` en `LanguageContext` para normalizar caracteres mal codificados (`Ãƒ`, `Ã‚`, etc.) al momento de traducir (`t(key)`).
  - esto mejora acentos, signos y legibilidad en landing y en el resto de pantallas que consumen el mismo contexto de idioma.

## Link Hub Top Actions (2026-02-24)

- Ruta privada ajustada: `/linkhub`.
- UX de edicion:
  - bloque de acciones `Guardar borrador / Publicar Link Hub / Copiar URL` movido a la parte superior del editor.
  - bloque superior fijo (`sticky`) para acceso rapido continuo en mobile y desktop.
  - se elimina duplicado de botones al final del formulario para simplificar flujo.

## Link Hub Item Editor + Auto Description AI-like (2026-02-24)

- Ruta privada ajustada: `/linkhub`.
- Mejoras de edicion de items:
  - boton explicito `Agregar item` en el header de carta/catalogo y en estado vacio.
  - seleccion de categoria robusta por item con fallback automatico si la categoria original ya no existe.
  - selector visual de categoria por item reforzado para reducir errores al editar catalogos grandes.
- Sugerencias automaticas de descripcion comercial:
  - boton por item `Sugerir descripcion`.
  - boton masivo `Sugerir descripciones` para todos los items.
  - generacion dinamica basada en titulo + pistas del nombre de imagen URL.
  - textos variables con enfoque de venta y emojis para restaurantes y negocios generales.

## Public Bio Static Scroll + Compact Language Toggle (2026-02-24)

- Ruta publica ajustada: `/bio/[slug]`.
- Comportamiento de scroll:
  - se bloquea scroll vertical global (desktop + mobile) dentro de la pagina publica.
  - tabs `contacto` y `ubicacion` quedan estaticas (sin desplazamiento vertical de pagina).
  - solo `carta/catalogo` conserva scroll interno en el listado de items/productos.
- Control de idioma:
  - boton `EN/ES` optimizado para `/bio/*` en formato pequeno y fijo en esquina.
  - se mantiene 100% funcional y sin interferir con el flujo de navegacion inferior.

## SaaS Subscription System (2026-02-24)

- Nuevo modulo de suscripciones para LinkHub y paginas B2B:
  - planes: `FREE`, `BUSINESS`, `PRO`
  - features controladas por plan:
    - temas premium/categoria
    - IA de personalizacion
    - metricas
    - dominio personalizado
    - quitar branding
    - multi usuario
    - optimizacion de conversion
- Persistencia SQL via Prisma:
  - `prisma/schema.prisma` con modelos:
    - `Subscription`
    - `SubscriptionRequest` (soporte pagos manuales y estado pendiente)
  - enums:
    - `PlanType`
    - `SubscriptionStatus`
    - `PaymentMethod`
    - `SubscriptionRequestStatus`
- Servicios y helpers:
  - `src/lib/permissions.ts` con `canAccessFeature(userPlan, feature)` y limites por plan.
  - `src/lib/subscription/service.ts` con logica de:
    - provision `FREE` por defecto
    - expiracion automatica
    - resumen de consumo y limites
    - solicitudes de upgrade con pago manual
  - `src/lib/ai/themeRecommender.ts` para recomendaciones IA (solo PRO).
- API nuevas:
  - `GET /api/subscription/current`
  - `POST /api/subscription/request`
  - `POST /api/subscription/session`
  - `POST /api/subscription/admin/approve`
  - `POST /api/ai/theme-recommender`
- Billing:
  - nueva ruta: `/dashboard/billing`
  - incluye tabla comparativa de planes, seleccion de plan y metodo de pago, instrucciones, subida de comprobante y estado pendiente.
- UI reusable:
  - `PricingTable`
  - `PlanBadge`
  - `SubscriptionExpiryBanner`
- Middleware de plan:
  - `middleware.ts` valida cookie de sesion de suscripcion firmada.
  - bloquea rutas premium segun feature requerida.
- Integraciones de control:
  - `Builder`, `Store` y `Editor` validan limite de paginas publicadas antes de publicar.
  - `LinkHub` aplica control por plan:
    - `FREE`: solo temas basicos
    - `BUSINESS/PRO`: personalizacion avanzada de colores
    - `PRO`: funciones IA de sugerencia automatica
  - `Hub` y `LinkHub` muestran badge de plan activo y banner de expiracion.

## Public Bio Header Compact Section Title (2026-02-24)

- Ruta publica ajustada: `/bio/[slug]`.
- UX en `carta/catalogo` y `ubicacion`:
  - titulo de seccion movido al header superior, centrado (`CARTA`/`CATALOGO`/`UBICACION`).
  - se elimina el bloque grande intermedio de titulo para liberar altura util del contenido.
  - resultado: mayor espacio visible para buscador, chips y lista de productos en mobile y desktop.

## LinkHub Top Actions Mobile Icon-Only (2026-02-24)

- Ruta privada ajustada: `/linkhub`.
- En mobile:
  - bloque sticky superior de acciones ahora muestra solo iconos pequenos para `guardar`, `publicar` y `copiar`.
  - botones alineados en fila de derecha a izquierda.
  - se agregan `title`/`aria-label` para claridad y accesibilidad.
- En desktop:
  - se mantiene el formato completo con texto en cada boton.

## LinkHub FREE Theme Curation (2026-02-24)

- Ruta privada ajustada: `/linkhub`.
- Ajuste del catalogo de temas para plan `FREE`:
  - se prioriza visual premium en los primeros temas disponibles:
    - `Black Gold Deluxe` (negro + dorado)
    - `Monochrome Luxe` (blanco/negro)
  - al mantenerse la restriccion FREE por "primeros 3 temas", ambos quedan visibles y seleccionables sin upgrade.

## Public Bio UI Polish + Text Tone Selector (2026-02-25)

- Rutas ajustadas:
  - dashboard privado: `/linkhub`
  - pagina publica: `/bio/[slug]`
- Nuevo control de estilo de texto configurable desde dashboard:
  - `Texto blanco`
  - `Texto negro`
  - `Texto dorado`
  - `Negro + dorado`
- Persistencia de perfil:
  - nuevo campo `textTone` en `LinkHubProfile`
  - normalizacion backward compatible para perfiles legacy (default: `white`)
- UX publica optimizada:
  - barra superior en `carta/catalogo` y `ubicacion` mas compacta en mobile (estilo delgado y encuadrado)
  - el titulo de seccion (`CARTA`/`UBICACION`) se muestra centrado dentro de la barra superior compacta
  - botones de contacto mejorados en desktop para evitar recortes y mantener alineacion estable.

## LinkHub 20 Themes by Category (2026-02-25)

- Ruta privada ajustada: `/linkhub`.
- Catalogo de temas ampliado a `20` temas visuales.
- Nuevo eje de segmentacion de temas por categoria:
  - `food` (comida)
  - `fashion` (ropa)
  - `technology` (tecnologia)
- Persistencia:
  - nuevo campo `themeCategory` en `LinkHubProfile` con normalizacion backward compatible.
- UX de editor:
  - selector de `Categoria visual` en dashboard.
  - en rubro restaurante, la categoria de temas queda forzada a `food`.
  - grilla de temas muestra solo los temas exclusivos de la categoria activa.
  - contador muestra total global de temas y cantidad exclusiva por categoria activa.

## Google Maps Normalization Fix (2026-02-25)

- Ruta privada ajustada: `/linkhub` (seccion ubicacion).
- Normalizacion robusta de entrada para mapas:
  - acepta `link de Google Maps`
  - acepta `URL embed`
  - acepta `codigo <iframe ...>`
  - acepta `direccion en texto`
- Persistencia:
  - convierte automaticamente a `mapEmbedUrl` valido para iframe.
  - genera `mapsUrl` valido para abrir direccion en app/navegador.
- Resultado:
  - se evita error 404 al renderizar mapa cuando el usuario pega formatos mixtos.
  - cada cliente puede pegar su enlace/direccion y ver la ubicacion correctamente en la pagina publica.

## Public Bio Cart + WhatsApp Checkout (2026-02-25)

- Ruta publica ajustada: `/bio/[slug]` en la pestaña `carta/catalogo`.
- Nuevo flujo de compra para cliente final:
  - agregar productos/platos al carrito desde cada tarjeta.
  - boton flotante de carrito en mobile y acceso directo en desktop.
  - panel `Mi Pedido` tematico segun colores del tema activo.
  - control de cantidades, eliminacion por item y vaciado de carrito.
- Checkout integrado:
  - formulario de nombre y telefono.
  - opcion de entrega (`domicilio`, `recoger`, `comer en local`).
  - forma de pago (`efectivo`, `transferencia`, `yape`, `plin`).
  - cupon con validacion simple (`FAST5`, `FAST10`).
  - regla de descuento automatico por monto (5% desde `S/80`).
  - aceptacion obligatoria de terminos antes de enviar.
- Envio a WhatsApp:
  - genera mensaje ordenado, amable y con emojis.
  - incluye detalle por item, cantidades, subtotales, descuentos, total y datos del cliente.
  - abre `wa.me` al numero configurado en el perfil (`whatsappNumber` con fallback a `phoneNumber`).

## Global Layout Guard + LinkHub Fixed Top Actions (2026-02-25)

- Global:
  - se bloquea desplazamiento horizontal accidental en toda la plataforma (`layout` + `globals`).
  - objetivo: evitar deslizamiento izquierda/derecha fuera de secciones explicitamente horizontales (ej. carruseles/chips internos).
- LinkHub dashboard (`/linkhub`):
  - barra de acciones `Guardar / Publicar / Copiar` movida a posicion fija debajo del header de Fast Page.
  - permanece visible al hacer scroll hacia arriba o abajo.
  - se mantiene alineada y centrada con el ancho del contenido principal en mobile y desktop.

## Theme Color Persistence Fix (2026-02-25)

- Rutas ajustadas:
  - dashboard privado: `/linkhub`
  - normalizacion de perfil: `src/lib/linkHubProfile.ts`
- Correcciones de persistencia:
  - fallback de `themePrimaryColor` y `themeSecondaryColor` ahora usa el preset del tema seleccionado (no un tema base fijo).
  - al ajustar `themeCategory` o `businessType`, si el tema actual sigue siendo valido, ya no se resetean colores.
- Resultado:
  - los dos colores del tema se conservan al `guardar`, `publicar` y abrir URL publicada.
  - la vista publica queda consistente con el preview del dashboard.

## LinkHub Actions Repositioned by Viewport (2026-02-25)

- Ruta ajustada: `/linkhub`.
- Comportamiento nuevo de acciones `Guardar / Publicar / Copiar`:
  - `mobile` (`< md`): barra superior fija con iconos pequenos.
  - `desktop` (`>= md`): bloque de acciones movido debajo del panel `Preview Mobile`, dentro del sidebar derecho.
- Resultado UX:
  - en PC se libera la parte superior del formulario principal.
  - las acciones quedan visualmente ancladas al preview y ordenadas en un bloque estable.

## LinkHub Mobile Framing + Overflow Hardening (2026-02-25)

- Ruta ajustada: `/linkhub`.
- Orden visual mobile-first alineado al formato de tarjetas de `Billing`:
  - contenedor principal mobile ahora usa `max-w-md` centrado.
  - barra superior de acciones mobile tambien centrada con el mismo ancho.
- Correcciones de desborde horizontal en editor de carta/catalogo:
  - filas de acciones y encabezados ahora envuelven (`flex-wrap`) en mobile.
  - bloques de categorias y controles pasan a stacking en pantallas pequenas.
  - botones largos de item (`Duplicar`, `Sugerir`, `Eliminar`) reducen densidad en mobile para no romper marco.
- Resultado:
  - Link Hub queda encasillado y ordenado como en el patron visual de la imagen de referencia.
  - desaparece el corte lateral/overflow en secciones de item y categorias.

## LinkHub Black/Gold Theme Available for Everyone (2026-02-25)

- Archivo ajustado: `src/lib/linkHubProfile.ts`.
- Se aplico estilo negro + dorado deluxe (bordes y contraste premium) en 3 temas clave:
  - `midnight` -> `Noir Gold Deluxe` (comida)
  - `runway` -> `Runway Gold` (ropa)
  - `obsidian` -> `Obsidian Gold Tech` (tecnologia)
- Disponibilidad para todos los planes:
  - se reordeno `LINK_HUB_THEME_CATEGORY_MAP` para que los temas black/gold queden entre los primeros de cada categoria.
  - esto garantiza visibilidad en plan `FREE` (limite de 3 temas por categoria) y en `BUSINESS/PRO`.
- Nota:
  - se mantienen 20 temas totales, sin aumentar el catalogo global.

## Public Bio Dark Satin Visual Pass (2026-02-25)

- Ruta ajustada: `/bio/[slug]`.
- Mejora visual global aplicada a todos los temas:
  - base de fondo mas oscura (elimina el look claro/lavado).
  - overlay satinado/tornasol suave (negro + plata) en contenedor principal y superficies.
  - tabs, chips, buscador, sticky de catalogo y cards con gradientes dark premium.
  - botones de contacto y panel de carrito con estilo oscuro consistente.
  - inputs de checkout ajustados a apariencia dark para evitar bloques claros.
- Resultado:
  - la pagina publica se mantiene alineada con el preview premium oscuro y con mejor percepcion deluxe.

## Carta Theming Premium System (2026-02-25)

- Nuevo modulo: `src/theme/cartaThemes.ts`
  - sistema de design tokens para Carta Digital:
    - `background`, `surface`, `surface2`
    - `text`, `mutedText`
    - `primary`, `primaryHover`, `primaryText`
    - `accent`, `accentHover`
    - `border`, `ring`, `shadow`
    - `chip*`, `nav*`, `badge*`, `button*`, `input*`, `gradientHero`
  - 8 presets premium:
    - `gourmet`, `cafe`, `sushi`, `fastfood`
    - `polleria_parrilla`, `healthy`, `desserts`, `bar_drinks`
  - mapeo de rubro a tema default: `DEFAULT_THEME_BY_RUBRO`
  - helper de recomendacion: `recommendCartaThemeIdByRubro`
- Nuevo provider: `src/theme/CartaThemeProvider.tsx`
  - aplica tokens como CSS variables en contenedor de carta publica.
- Persistencia:
  - `LinkHubProfile` incluye `cartaThemeId`
  - normalizacion y defaults actualizados para sugerencia automatica por rubro
  - se guarda en `link_profiles/{uid}`.
- UI dashboard `/linkhub`:
  - selector de tema de carta con preview mini en vivo.
  - accion `Sugerir por rubro`.
- UI publica `/bio/[slug]`:
  - migracion de chips, menu inferior, botones, buscador, cards, badges, header y checkout a variables de tema.
  - microinteracciones estandarizadas (hover/active/focus) con look premium.

## Super Admin Plan Control Lock (2026-02-25)

- Ruta privada reforzada: `/admin`.
- Nuevos endpoints admin para suscripcion:
  - `POST /api/subscription/admin/summaries`
  - `POST /api/subscription/admin/manage`
- Seguridad:
  - solo el correo `afiliadosprobusiness@gmail.com` puede aprobar/asignar planes.
  - control server-side unificado con helper `assertSuperAdmin`.
- Gestion real de planes en Prisma desde panel super admin:
  - activar `BUSINESS` o `PRO` al usuario final.
  - desactivar premium y pasar a `FREE`.
  - al asignar plan se expiran suscripciones `ACTIVE/PENDING` previas del usuario para evitar conflictos.
- Panel `/admin`:
  - muestra plan actual por usuario (badge + estado + vencimiento).
  - selector de plan por fila (`FREE/BUSINESS/PRO`).
  - acciones directas: `Activar` y `Free`.
  - feedback inmediato por usuario y sincronizacion de estado.

## Public Bio White Shell + Themed Menu (2026-02-25)

- Ruta ajustada: `/bio/[slug]`.
- Cambio visual principal:
  - base de interfaz ahora en blanco limpio (fondo, tarjetas, paneles, formularios y header).
  - mejor legibilidad general con texto oscuro estable.
- Color dinamico por tema concentrado en menu:
  - chips/categorias activos
  - tabs de navegacion (desktop y mobile)
  - barra inferior activa
- Resultado UX:
  - apariencia alineada a referencia de carta blanca profesional.
  - menu conserva identidad de color segun tema elegido por el usuario.

## Public Bio Rounded Frames + Accent Words (2026-02-25)

- Ruta ajustada: `/bio/[slug]`.
- Refinamiento visual:
  - marcos mas redondeados en contenedor principal, secciones, tarjetas de producto y barra inferior.
  - bordes y sombras suaves para un look fino/ordenado tipo referencia.
- Acento de color del menu aplicado a palabras clave:
  - nombre principal con ultima palabra en color del tema.
  - titulos clave de secciones (`Contacto`, `Carta/Catalogo`, `Ubicacion`, `Horarios`) con color del menu activo.
  - categorias de la carta destacadas con el mismo color de tema.

## LinkHub Preview Aligned with Carta Digital (2026-02-25)

- Ruta ajustada: `/linkhub` (sidebar de `Preview Mobile`).
- Se reemplazo el preview oscuro legacy por una maqueta real de Carta Digital:
  - shell blanco y limpio.
  - header compacto con avatar + compartir.
  - portada + avatar central.
  - bloque de `CARTA/CATALOGO` con buscador y chips de categoria.
  - cards de productos/items en mini.
  - barra inferior de 3 tabs (Contacto/Carta-Ubicacion) con color activo del tema.
- El color dinamico del tema se concentra en menu/chips/nav para que el editor refleje el resultado esperado de la carta.

## Carta Digital Naming + Cleanup in Editor (2026-02-25)

- Ruta ajustada: `/linkhub`.
- Cambios de UX en dashboard:
  - se elimino del editor la seccion visual `Catalogo digital online (planes)` para simplificar la configuracion.
  - se mantuvo foco en identidad, carta/catalogo, contacto, ubicacion y preview mobile.
- Renombrado visible en UI:
  - textos principales migrados de `Link Hub` a `Carta Digital` en el editor.
  - etiquetas relacionadas actualizadas tambien en vistas de publicados y estado de perfil publico para mantener consistencia de marca.

## Carta Digital Full Prompt Alignment (2026-02-25)

- Ruta ajustada: `/linkhub` (dashboard editor).
- Alineacion final con el prompt extenso de theming premium:
  - preview mobile ahora usa tokens reales de `cartaThemeId` (no colores legacy del tema de editor).
  - selector de tema de carta con mini previews (swatches + nombre + rubro) para cambio en 1 click.
  - consistencia visual del preview en chips, nav, buscador, tarjetas, textos y CTA.
- Cleanup de naming residual:
  - fallback de titulo comercial interno cambiado a `Carta Digital`.
- Documentacion nueva:
  - `docs/CARTA_THEMING.md` con guia corta para agregar temas y mapearlos por rubro.

## Carta Background Mode Toggle (2026-02-25)

- Rutas ajustadas:
  - Dashboard: `/linkhub`
  - Publica: `/bio/[slug]`
- Nueva preferencia por usuario en `link_profiles`:
  - `cartaBackgroundMode: "white" | "theme"`
- UX:
  - nuevo control en `Tema visual deluxe` para elegir:
    - `Fondo blanco` (estilo limpio)
    - `Fondo del tema` (respeta el preset completo, incluido background)
  - el `Preview Mobile` ahora refleja esta eleccion en vivo.
- Render publico:
  - `/bio/[slug]` aplica la eleccion persistida para fondo, superficies y menu.

## Gold Click Keywords in Bio (2026-02-25)

- Ruta ajustada: `/bio/[slug]`.
- Se agrego resaltado dorado estilo landing en palabras clave del texto `bio`.
- Palabras destacadas ahora son accionables:
  - `carta/menu/catalogo` -> abre tab Carta.
  - `ubicacion/mapa/direccion` -> abre tab Ubicacion.
  - `contacto` -> abre tab Contacto.
  - `llamar/telefono` -> ejecuta llamada (si hay telefono).
  - `whatsapp/pedido/reservas` -> abre WhatsApp (si esta configurado).

## Super Admin Auth Reliability Fix (2026-02-25)

- Rutas afectadas:
  - `/api/subscription/session`
  - `/api/subscription/admin/summaries`
  - `/api/subscription/admin/manage`
  - `/api/subscription/current`
  - `/api/subscription/request`
  - `/api/ai/theme-recommender`
- Problema corregido:
  - respuestas `503` por `SERVICE_UNAVAILABLE` cuando Firebase Admin SDK no estaba inicializado.
- Cambios aplicados:
  - `src/lib/firebaseAdmin.ts` ahora soporta 2 estrategias de credenciales:
    - `FIREBASE_SERVICE_ACCOUNT_KEY` (JSON o base64)
    - variables separadas: `FIREBASE_PROJECT_ID`, `FIREBASE_CLIENT_EMAIL`, `FIREBASE_PRIVATE_KEY`
  - `src/lib/server/requireFirebaseUser.ts` incorpora fallback seguro de verificacion de token via Identity Toolkit cuando `adminAuth` no esta disponible.
  - se mantiene autorizacion estricta de super admin por correo root (`afiliadosprobusiness@gmail.com`).

## Carta Theme Sync on Save/Publish (2026-02-25)

- Rutas ajustadas:
  - `/linkhub` (editor + preview)
  - `/bio/[slug]` (publica)
- Mejora aplicada:
  - al elegir un tema visual deluxe (grid de 20 temas) ahora se sincroniza automaticamente un `cartaThemeId` compatible.
  - al guardar/publicar, `cartaThemeId` y `cartaBackgroundMode` se persisten explicitamente.
- en la pagina publica, si un perfil antiguo no tiene `cartaThemeId`, se aplica fallback desde el tema visual seleccionado para mantener coherencia.

## Super Admin Auth + Rules Hardening (2026-02-25)

- Rutas/archivos ajustados:
  - `/api/subscription/session`
  - `/api/subscription/admin/summaries`
  - `/api/subscription/admin/manage`
  - `src/lib/server/requireFirebaseUser.ts`
  - `firestore.rules`
  - `/admin` (UI)
- Correcciones aplicadas:
  - `requireFirebaseUser` ahora usa fallback automatico a Identity Toolkit cuando `adminAuth.verifyIdToken()` falla por infraestructura/credenciales.
  - se agrega resolucion robusta de `API key` y `projectId` con fallback al proyecto base para evitar `503` por variables faltantes en despliegue.
  - reglas de Firestore para `isAdmin()` ahora validan el email root en forma case-insensitive (`lower()`), evitando falsos negativos por mayusculas.
  - `users/{userId}` permite `create` por admin para operaciones de recuperacion/soporte sin bloquear el panel.
  - en `/admin`, un fallo de sincronizacion de planes ya no bloquea la tabla completa de usuarios; se muestra aviso parcial.

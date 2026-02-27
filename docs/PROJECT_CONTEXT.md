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

## Super Admin Plan Activation Fallback (2026-02-25)

- Rutas/archivos ajustados:
  - `/admin` (UI de gestion de planes)
  - `src/lib/subscription/service.ts`
  - `/api/subscription/session`
- Problema corregido:
  - errores `500` en `subscription/admin/summaries`, `subscription/admin/manage` y `subscription/session` cuando Prisma/DB no responde.
- Correcciones aplicadas:
  - el servicio de suscripciones ahora usa fallback transparente a Firestore (`users/{uid}`) para lectura/escritura de plan cuando Prisma falla.
  - el panel `/admin` ahora aplica plan con fallback directo por cliente a Firestore si la API de planes falla.
  - `/api/subscription/session` deja de romper con `500` si falta secreto de cookie y responde modo degradado sin cookie.

## Super Admin Firestore-First Plan Apply (2026-02-25)

- Ruta ajustada: `/admin`.
- Cambio de estrategia en activacion/desactivacion:
  - el panel aplica primero el plan en Firestore (`users/{uid}`) como fuente primaria de estado visible.
  - la llamada a `/api/subscription/admin/manage` queda como sincronizacion best-effort para historial SQL/billing.
- Resultado:
  - si la API de suscripciones cae con `500`, el plan igual queda aplicado y visible en el panel.

## Service Worker Cleanup + Admin Plan Stability (2026-02-25)

- Rutas/archivos ajustados:
  - `src/components/ServiceWorkerCleanup.tsx`
  - `src/app/layout.tsx`
  - `/admin`
- Cambios aplicados:
  - se agrega limpieza automatica de service workers y caches legacy al cargar la app para evitar interceptores obsoletos (`sw.js`) que rompen requests `POST`.
  - el panel super admin elimina dependencia operativa de `/api/subscription/admin/*` para activacion de plan y trabaja en modo Firestore-first (`users/{uid}`).
- Resultado:
  - activacion `FREE / BUSINESS / PRO` estable desde el panel, incluso con APIs de suscripcion temporalmente inestables.

## LinkHub Desktop Preview Width + Right Actions (2026-02-25)

- Ruta ajustada: `/linkhub`.
- Cambios de layout en desktop:
  - columna derecha del `Preview Mobile` reducida para encajar mejor en PC.
  - `Preview Mobile` con shell ligeramente mas compacto.
  - barra de acciones (`Guardar`, `Publicar`, `Copiar`) alineada al extremo derecho y con anchos consistentes por boton.
- Resultado:
  - composicion mas ordenada en escritorio, sin sensacion de preview sobredimensionado ni botones desalineados.

## Subscription Sync from Super Admin to Digital Menu (2026-02-25)

- Modulo ajustado: `useSubscription` (cliente).
- Problema corregido:
  - el dashboard `/admin` mostraba plan actualizado en `users/{uid}`, pero `/linkhub` seguia tomando `FREE` por depender de APIs de suscripcion inestables.
- Correccion aplicada:
  - `useSubscription` ahora combina API + lectura directa de `users/{uid}` en Firestore.
  - cuando existe `subscriptionPlan` en Firestore, ese valor se usa como fuente efectiva para plan/features (`FREE`, `BUSINESS`, `PRO`) en Digital Menu.
- Resultado:
  - funciones premium en `/linkhub` (temas premium, IA, personalizacion avanzada) se habilitan segun el plan elegido en Super Admin.

## Online Store Public Storefront Split (2026-02-25)

- Ruta nueva publica:
  - `/t/[slug]`
- Objetivo:
  - separar completamente el editor de Online Store (`/store`) del storefront publico.
  - mantener el editor actual sin mezclar con Carta Digital.
- Persistencia:
  - `cloned_sites` ahora guarda `storeSlug` para proyectos `source: "store-builder"`.
  - URL publica de tienda para proyectos store-builder: `/t/{storeSlug}`.
- UX storefront implementada (mobile-first):
  - mini header (logo/nombre/carrito)
  - hero compacto
  - chips de categorias con scroll horizontal
  - bloque de ofertas especiales (cuando aplica)
  - buscador + ordenar
  - grid responsive ecommerce (`2` movil, `3` tablet, `4` desktop)
  - carrito flotante + `Cart Drawer`
  - checkout MVP (nombre, celular, direccion, nota)
  - envio por WhatsApp y guardado de pedidos en Firestore
  - footer oscuro con enlaces de contacto
- Theming:
  - storefront usa variables CSS derivadas de `STORE_THEMES` + `customRgb` (sin hardcodear colores de marca fija).
- Integraciones de dashboard:
  - `/store` agrega boton `Ver tienda` que abre `/t/{slug}` en nueva pestana.
  - `/published` para `source: "store-builder"` apunta a `/t/{storeSlug}` en lugar de `/preview/{id}`.
- Reglas Firestore ajustadas:
  - lectura publica solo para `cloned_sites` publicados de `source: "store-builder"`.
  - nueva coleccion `store_orders` con `create` publico validado para checkout y lectura restringida a admin/owner.

## Online Store Visual Editor Revamp (2026-02-25)

- Ruta privada actualizada: `/store`.
- Cambio principal:
  - editor convertido a modo visual inline (WYSIWYG) sobre la misma plantilla.
  - textos e imagenes editables directamente dentro del canvas (sin depender de panel separado para todo).
- UX editor:
  - switch `PC / Movil` para revisar y editar responsive real.
  - carga de imagenes desde la misma pagina para portada, logo y productos.
  - edicion inline de productos (badge, nombre, descripcion, categoria, precio, CTA).
  - bloque de ofertas con carrusel horizontal en modo movil.
- Temas dinamicos:
  - fondo claro con acentos dinamicos por tema y colores customizables.
  - combinaciones tipo rojo/negro, dorado/negro y variantes aqua/mint/mono manteniendo superficie blanca.
- Ruta publica alineada: `/t/[slug]`.
  - estructura visual tipo catalogo ecommerce multirubro:
    - mini header
    - hero compacto
    - ofertas especiales
    - buscador + chips de categoria + ordenar
    - grid de productos
    - paginacion
    - footer oscuro social
    - carrito flotante + drawer + checkout MVP por WhatsApp

## Billing Rules Refresh + Plan Permissions Hook (2026-02-25)

- Rutas/modulos ajustados:
  - `/dashboard/billing`
  - `src/lib/permissions.ts`
  - `src/hooks/usePlanPermissions.ts`
  - `src/components/subscription/PricingTable.tsx`
  - `src/lib/subscription/plans.ts`
  - `src/lib/subscription/service.ts`
  - `middleware.ts`
- Reglas de negocio aplicadas:
  - branding removible: solo `PRO` (y preparado para `AGENCY`).
  - dominio propio: habilitado desde `BUSINESS`.
  - IA por nivel: `none` (Starter), `basic` (Business), `advanced` (Pro).
  - metricas por nivel: `none` (Starter), `basic` (Business), `pro` (Pro).
  - limites:
    - Starter: `1` proyecto, `10` productos por proyecto
    - Business: `5` proyectos, `50` productos por proyecto
    - Pro: `20` proyectos, productos ilimitados
- Hook central nuevo:
  - `usePlanPermissions()` expone:
    - `canRemoveBranding`
    - `canUseCustomDomain`
    - `canUseCloner`
    - `aiLevel`
    - `analyticsLevel`
    - `maxProjects`
    - `maxProductsPerProject`
  - calcula uso real publicado y alerta de upsell al `80%` de limites.
- Firestore model compat:
  - se soporta `users/{uid}.plan` (`starter/business/pro/agency`) sin romper `subscriptionPlan` legacy.
  - sincronizacion escribe ambos campos para convivencia progresiva.
- Upsell inteligente:
  - Billing muestra upgrade contextual por:
    - intento de IA sin plan apto
    - intento de quitar branding sin Pro
    - acceso a insights Pro sin Pro
    - intento de cloner sin Pro
    - cercania al 80% de limites
  - Hub redirige a Billing con contexto si se intenta abrir `/cloner/web` sin permiso.
- Pricing copy actualizado:
  - Starter / Business / Pro con precios oficiales (`S/0`, `S/59`, `S/99`).
  - enfasis visual de:
    - `50 productos`
    - `Productos ilimitados`
    - `Branding removible`
    - `IA avanzada`

## Unified Editor Core + Starter Lock (2026-02-26)

- Nuevo modulo transversal: `src/editor-core`
  - `EditorProvider`
  - `useEditorState`
  - `useAutosave`
  - `usePublish`
  - `usePlanPermissions` (re-export centralizado)
  - `useAIAssistant`
  - persistencia draft/published en `projects/{id}` via `storage.ts`
- Nuevo set de componentes reutilizables:
  - `src/components/editor/InlineEditable.tsx`
  - `src/components/editor/EditorSidebar.tsx`
- Integraciones iniciales del core:
  - `/builder`: sincroniza estado con `editor-core`, autosave y publish unificado con espejo en `projects`.
  - `/editor/[id]`: envuelto con `EditorProvider`, sincroniza dirty state con editor-core.
  - `/store`: envuelto con `EditorProvider`, autosave + publish unificado, sincronizacion en `projects`.
- Navegacion con bloqueo Starter:
  - `Nav` muestra `candado` en `Builder`, `Templates`, `Cloner` y `Online Store` para plan `starter`.
  - hover/click en item bloqueado muestra mensaje de upgrade a `Business` o `Pro`.
- Bloqueo real por middleware:
  - rutas `/builder`, `/templates` y `/store` ahora requieren feature `fullStore`.
  - `starter` es redirigido a `/dashboard/billing`.
- Firestore rules extendidas:
  - nueva coleccion `projects` con ownership/admin para draft/published.
  - nueva coleccion `analytics` ligada a ownership del proyecto.
- Metrics por nivel:
  - `starter`: pantalla de upsell (sin metricas).
  - `business/pro`: habilitado; pro mantiene modo completo.

## Online Store Editable Marketing Template (2026-02-26)

- Ruta privada ajustada: `/store`.
- Mejora aplicada al editor visual:
  - plantilla inicial completa con copy de marketing editable (`Edita aqui / Escribe aqui`).
  - catalogo demo multirubro con fotos reales de productos para arrancar rapido.
  - boton `Plantilla marketing` para recargar estructura base en un clic.
  - placeholders y estados vacios mejorados en portada, logo y tarjetas de producto.
- Persistencia:
  - al cargar proyectos legacy desde `cloned_sites`, se completa config y productos con defaults para evitar pantallas incompletas.

## Store Loading Loop + Subscription Current Fallback (2026-02-26)

- Ruta privada ajustada: `/store`.
- Correccion aplicada:
  - se elimina loop de recarga del proyecto que podia dejar el estado `loadingProject` activo de forma continua.
  - causa raiz: efecto de carga dependia del objeto `editor` completo (identidad cambiante por render), provocando relanzamiento continuo del fetch.
  - la carga inicial de `cloned_sites` ahora se ejecuta solo por `projectId` + `user`, con cancelacion segura.
- API ajustada: `/api/subscription/current`
  - ante error interno no-auth, devuelve fallback `FREE` con estado degradado (`200`) en lugar de `500`.
  - evita que el frontend quede en estado inestable cuando falla temporalmente Prisma o servicios de suscripcion.
- Service worker cleanup:
  - se incremento version de limpieza (`fp_sw_cleanup_v2`) para forzar invalidacion de caches/SW legacy en clientes que seguian con bundle antiguo.

## Custom Domain Auth Sync (2026-02-26)

- Dominio canonico de autenticacion actualizado en frontend:
  - `fastpagespro.com`
- Alias de autenticacion soportados:
  - `www.fastpagespro.com`
  - `fastpagepro.com`
  - `www.fastpagepro.com`
  - aliases legacy de Vercel
- Ruta ajustada:
  - `/auth` ahora redirige hosts alias hacia el dominio canonico antes de OAuth Google.
- Sesion de suscripcion:
  - `/api/subscription/session` ahora fija `cookie domain` dinamico para compartir sesion entre `www` y apex (`.fastpagespro.com` y fallback `.fastpagepro.com`).

## Store Editor Mobile + Desktop Layout Pass (2026-02-26)

- Ruta ajustada: `/store`.
- Modo movil:
  - se bloquea desborde horizontal global para evitar desplazamiento lateral del editor.
  - bloque de ofertas en modo carrusel interno (snap) con 1-2 tarjetas visibles segun ancho.
  - grilla de productos en modo movil ajustada a `1` columna y `2` columnas desde anchos mayores para mantener orden visual.
- Tarjetas de producto (editor):
  - bordes de campos internos aclarados con estilo casi imperceptible (`soft white/light`) para mejor legibilidad.
  - inputs de descripcion/metadata forzados a fondo blanco y texto oscuro para evitar contraste negro sobre negro.
- Modo desktop:
  - panel lateral de edicion movido al lado izquierdo con layout uniforme en pantalla amplia.

## Landing SaaS Conversion Revamp (2026-02-26)

- Ruta ajustada: `/` (home principal).
- Refactor completo de landing con foco conversion SaaS:
  - hero orientado a resultado con selector de intencion (`Landing`, `Online Store`, `Carta Digital`, `Cloner`).
  - CTA principal y secundarios con tracking (`cta_primary_click`, `view_demo_click`, `view_pricing_click`).
  - seccion de modulos del ecosistema con eventos `module_click_*` para Builder, Templates, Cloner, Store, Menu, Metrics e IA.
  - bloques de conversion: como funciona, casos de uso, demos, pricing comparativo, FAQ y CTA final.
- SEO:
  - `src/app/page.tsx` ahora define metadata de pagina (title, description, canonical y OpenGraph) para App Router.
- Footer:
  - agrega enlaces directos a `CARTA DIGITAL`, `PRICING` y `LOGIN` sin romper enlaces existentes.

## Store Theme Sync + Permission Recovery (2026-02-26)

- Ruta ajustada: `/store`.
- Tema dinamico:
  - al seleccionar preset visual, ahora se sincronizan `themeId + customRgb(accent, accent2)` para que todos los acentos cambien inmediatamente.
  - se reemplaza badge de oferta hardcodeado en rojo por color basado en `--vs-accent`.
- Persistencia y permisos:
  - `projectId` del editor ahora usa key de localStorage por usuario (`fastpage_store_project_id:{uid}`).
  - compatibilidad con key legacy y migracion automatica.
  - si se detecta borrador de otra cuenta o `permission-denied`, el editor limpia el id conflictivo y crea un borrador nuevo para evitar bloqueo de guardado.
- Layout PC/Mobile:
  - mayor separacion entre header, sidebar y canvas para evitar choques visuales.
  - ajustes de `sticky top` y `grid gaps` para mantener orden profesional en desktop y mobile.
  - toast de error reubicado para no superponerse con controles flotantes.

## Auth Domain + Layout Stabilization (2026-02-26)

- Dominio canónico actualizado a `www.fastpagepro.com` para autenticación OAuth y SEO home.
- Alias de redirección conservados para compatibilidad:
  - `fastpagepro.com`
  - `fastpagespro.com`
  - `www.fastpagespro.com`
  - hosts Vercel legacy
- `/auth`:
  - se eliminó el bloqueo global de `overflow/touchAction` en `html/body` que afectaba interacción en móvil/PC.
  - layout responsive ajustado con espaciado seguro (`pt` superior por navbar global, `overflow-x-hidden`) y fallback visual de carga.
- Sesión de suscripción:
  - orden de dominios base ajustado para priorizar `.fastpagepro.com` y compartir cookies entre `www` + apex.

## Landing Conversion Optimization LATAM (2026-02-26)

- Ruta afectada: `/` (home).
- Se rehizo `src/components/landing/LandingHome.tsx` con foco de conversion para LATAM:
  - Hero con headline principal orientado a WhatsApp conversion.
  - CTA principal `Empezar gratis` + secundario `Ver como funciona`.
  - Microcopy de confianza bajo CTA (`Sin tarjeta`, `Configuracion en minutos`, `Hecho para negocios de Latam`).
  - Nuevo bloque `Sistema FastPage`: `Visitas -> Landing -> WhatsApp -> Metricas -> Escala`.
  - Casos segmentados de alto impacto para Restaurantes, Tiendas Online y Servicios.
  - Nueva seccion `Mira FastPage en accion` con mockup, preview de flujo WhatsApp y placeholder de demo corta.
  - Pricing con psicologia de conversion (badge `Mas elegido por negocios`, refuerzo Business/Pro).
  - Header sticky desktop de conversion + sticky CTA mobile.
- SEO:
  - `src/app/page.tsx` actualizado con metadata orientada a conversion LATAM (title, description, OG y Twitter).

## Public Domain Lockdown (2026-02-26)

- Dominio publico permitido unicamente:
  - `www.fastpagepro.com` (canonico)
  - `fastpagepro.com` (alias apex)
- Se removieron defaults de hosts alternos/legacy en app:
  - `src/app/auth/page.tsx` (`NEXT_PUBLIC_AUTH_ALIAS_HOSTS` default)
  - `.env.example` (`NEXT_PUBLIC_AUTH_ALIAS_HOSTS`, `SUBSCRIPTION_COOKIE_BASE_DOMAINS`)
  - `src/app/api/subscription/session/route.ts` (cookie base domains fallback)
- Se agrego host-guard en `middleware.ts`:
  - en produccion, cualquier host no permitido redirige 308 al canonico.
  - para `/api/*` en host no permitido responde `403 Host no permitido`.

## Demo WhatsApp Unification + Resilient Images (2026-02-26)

- Modulos ajustados: demos publicas /demo/* (restaurant, ecommerce, services).
- WhatsApp oficial unificado para todas las demos: +51 919 662 011 (51919662011).
- Mensajeria de demo mejorada:
  - saludo inicial en negrita
  - estructura ordenada por secciones
  - tono amable con emojis y puntuacion.
- UX de precios en demos:
  - precio principal reducido ligeramente para mejor balance visual en mobile.
- Carga de imagenes robusta:
  - nuevo DemoImage con fallback SVG local cuando falla una URL remota.
  - aplicado en cards de demo y vistas demo para evitar bloques vacios.


## Landing Modules Demo Redirect + Demo Back Controls (2026-02-26)

- Landing / (seccion Todo en uno):
  - Templates ahora abre demo de servicios (/demo/services/consultoria-pro).
  - Online Store ahora abre demo ecommerce (/demo/ecommerce/urban-wear).
  - Carta Digital ahora abre demo restaurante (/demo/restaurant/sushi-prime).
  - Pro Metrics ahora abre demo de metricas (/demo/services/pro-metrics).
  - se elimina el modulo IA de la grilla.
  - chip IA para copy oculto en mobile (se mantiene en desktop).
- Demos /demo/*:
  - barra superior con Volver al inicio + Crear mi version gratis.
  - CTA sticky visible tambien en restaurante mobile con offset para no tapar la navegacion inferior.
- Carta Digital demo (restaurant):
  - soporte de profileImage por demo para avatar circular estable sobre portada.
  - chips del buscador con 
o-scrollbar para eliminar barra horizontal gris.


## Ecommerce Demo Mobile Vertical Flow (2026-02-26)

- Ruta ajustada: demos Online Store (/demo/ecommerce/*).
- Layout mobile ahora prioriza flujo estatico de arriba hacia abajo:
  - grid de productos en 1 columna en mobile (2 columnas desde sm).
  - chips de categoria con 
o-scrollbar para evitar barra visible.
  - boton flotante de carrito oculto en mobile para evitar superposicion; se mantiene en desktop.


## Dashboard Mobile Nav Spacing + Width Fit (2026-02-26)

- Componente ajustado: `src/components/Nav.tsx`.
- Mejoras UX mobile:
  - los items del menu lateral ahora renderizan a ancho completo (`w-full`) para evitar superposicion visual de tarjetas.
  - se normalizo `leading` y separacion vertical entre filas para mantener lectura clara en listas largas.
  - el panel lateral mobile se limito a un ancho maximo de `250px` para mantener el despliegue compacto y consistente.
- Plan locks:
  - se mantiene sin cambios la logica de candados para funciones restringidas por plan.

## Link Hub Theme Suggestion + White Background Preview Sync (2026-02-26)

- Ruta privada ajustada: `/linkhub`.
- Seccion `Temas oficiales � Carta Digital`:
  - accion `Sugerir por rubro` ahora aplica el tema sugerido y deja `Fondo blanco` activo por defecto.
- Preview mobile del editor:
  - cuando `Fondo blanco` esta activo, textos principales e inactivos pasan a paleta oscura legible.
  - se mantienen acentos del tema seleccionado (primary/accent/chips activos) para conservar identidad visual.
- Persistencia:
  - `cartaBackgroundMode` y `cartaThemeId` quedan listos para guardado/publicacion sin cambios breaking.

## Ecommerce Demo + Store Dashboard Frame Alignment (2026-02-26)

- Rutas/Componentes ajustados:
  - `src/components/demo/DemoExperience.tsx`
  - `src/components/demo/EcommerceDemo.tsx`
  - `src/components/demo/StickyCTA.tsx`
  - `src/app/store/page.tsx`
- Objetivo UX:
  - mantener encuadre horizontal simetrico en mobile (borde derecho alineado al izquierdo) en demos `Online Store` y en dashboard `Tienda Online`.
- Cambios aplicados:
  - `min-w-0` y `w-full` en contenedores clave para prevenir desbordes laterales en grillas/cards.
  - CTA sticky mobile normalizado a `left/right` simetricos para evitar desfase lateral.
  - preview mobile del dashboard con `overflow-x-clip` y contenedor `min-w-0`.
  - grilla de productos mobile del dashboard ajustada a `sm:grid-cols-2` (evita forzar 2 columnas en anchos angostos).
  - carrusel de ofertas mobile con padding horizontal simetrico.

## Store Builder Mobile Offers Single-Slide Carousel (2026-02-26)

- Ruta ajustada: `/store` (constructor dashboard).
- Seccion `Ofertas especiales` en modo preview mobile:
  - se cambio a carrusel horizontal de 1 card por vista (`auto-cols-[100%]`).
  - scroll horizontal con `snap` por card para ver las demas ofertas deslizando.
  - se mantiene desktop sin cambios (grilla de ofertas).
- Objetivo: vista mobile-first mas ordenada y alineada, sin mostrar 5 ofertas comprimidas al mismo tiempo.

## Store Offers Carousel Controls + Mobile Default (2026-02-26)

- Ruta ajustada: `/store`.
- Seccion `Ofertas especiales`:
  - carrusel mobile mantiene 1 card por vista con swipe horizontal y snap.
  - se agregan controles visibles `izquierda/derecha` para desplazar ofertas.
- UX mobile-first:
  - el editor inicia en `viewMode = mobile` por defecto para previsualizacion inmediata en formato telefono.

## Global Mobile Overflow Guard + Overlay Safe Bottom (2026-02-26)

- Archivo ajustado: `src/app/globals.css`.
- Fix no destructivo global:
  - se refuerza `overflow-x: hidden` en raiz y wrappers para evitar scroll horizontal accidental.
  - `main/section/article/aside/header/footer` con `max-width: 100%` y `min-width: 0` para prevenir desbordes en grids/flex.
  - `img/video/canvas/iframe` limitados a `max-width: 100%`; media visual mantiene `h-auto`.
- Mobile overlays:
  - se agrega `padding-bottom` de seguridad a `main` en mobile para que barras fijas inferiores no tapen contenido.

## Global No-Overlap / Vertical-Flow Guard (2026-02-26)

- Ajuste no destructivo mobile-first para prevenir overflow horizontal y solapes por overlays.
- Elemento puntual corregido por overflow potencial:
  - `src/components/landing/LandingHome.tsx` (carrusel de testimonios) cambio de `-mx-2` a `w-full max-w-full` manteniendo dise�o y scroll interno.
- Guardas globales aplicadas en `src/app/globals.css`:
  - wrappers base en flujo (`main/section/article/aside/header/footer`) con `w-full max-w-full min-w-0`.
  - media (`img/video/canvas/iframe`) con `max-width: 100%` y `h-auto` para imagen/video/canvas.
  - `html/body` con `overflow-x: hidden` reforzado.
  - `padding-bottom` mobile de seguridad para evitar cobertura por CTAs/barras fijas.
- Validacion runtime (Playwright + Chromium, localhost):
  - viewport 375 y 1440 en `/`, `/demo/ecommerce/urban-wear`, `/store` => `scrollWidth == clientWidth` (sin x-scroll global).

## Demo Landing Sticky CTA Non-Overlap (2026-02-26)

- Componente ajustado: `src/components/demo/DemoExperience.tsx` (flujo restaurant).
- Mobile:
  - `StickyCTA` se reposiciona mas arriba usando safe-area (`bottom-[calc(env(safe-area-inset-bottom)+6.75rem)]`).
  - evita solape visual con la barra inferior de navegacion del demo (`Contacto/Carta/Ubicacion`).
- Desktop: sin cambios de layout.

## Restaurant Demo Cart CTA Non-Overlap + WhatsApp Cart Icon (2026-02-26)

- Componente ajustado: `src/components/demo/RestaurantDemo.tsx`.
- Seccion `Carta` en demos de landing:
  - boton flotante `Mi pedido` reposicionado para evitar solape con `StickyCTA` en mobile y desktop.
  - iconografia mejorada en boton de pedido: `WhatsApp + carrito` junto al texto.
- Validacion puntual en `/demo/restaurant/sushi-prime`:
  - viewport 375: sin x-scroll y sin overlap.
  - viewport 1440: sin x-scroll y sin overlap.

## Auth API hardening for subscription trial (2026-02-26)

- Modulo ajustado: `src/lib/server/requireFirebaseUser.ts`.
- Problema corregido:
  - en algunos entornos, al activar "14 dias gratis", la validacion server-side del token podia caer en `Identity Toolkit` y fallar por restricciones de API key, devolviendo `Servicio de autenticacion no disponible`.
- Correccion aplicada:
  - se agrega verificacion principal por certificados publicos de Firebase Secure Token (Google x509) sin depender de API key.
  - orden de fallback actualizado:
    1) Firebase Admin SDK
    2) verificacion JWT por certificados publicos
    3) Identity Toolkit (ultimo recurso)
- Resultado:
  - mayor estabilidad al crear/activar trial Business desde Billing, incluso cuando Firebase Admin no esta disponible en runtime.

## Subscription auth fallback hardening (2026-02-26)

- Modulos ajustados:
  - `src/lib/server/requireFirebaseUser.ts`
  - `src/lib/firebaseAdmin.ts`
  - `src/app/dashboard/billing/page.tsx`
  - `src/app/api/subscription/request/route.ts`
- Mejoras aplicadas:
  - nuevo fallback de verificacion de ID token via `https://oauth2.googleapis.com/tokeninfo` (sin API key) antes de usar Identity Toolkit.
  - inicializacion de Firebase Admin mas tolerante a variables con nombres alternos y `private_key` con comillas/escapes.
  - envio de trial desde Billing ahora fuerza refresh de token (`getIdToken(true)`).
  - respuesta de `/api/subscription/request` diferencia error de autenticacion vs almacenamiento de suscripcion.
- Objetivo:
  - eliminar el falso `Servicio de autenticacion no disponible` al activar los 14 dias gratis en entornos con restricciones de API key o configuracion parcial de Admin SDK.

## Subscription trial storage fallback via Firestore REST (2026-02-26)

- Modulo ajustado: `src/app/api/subscription/request/route.ts`.
- Problema corregido:
  - al activar trial Business, si Prisma o Admin SDK no estaban disponibles, el endpoint devolvia 503 (`subscription storage unavailable`).
- Correccion aplicada:
  - para `trial=true` y plan `BUSINESS`, se agrega fallback de escritura directa en Firestore REST usando el ID token del usuario autenticado.
  - se escribe en `users/{uid}`: plan business, ventana de 14 dias y flags de trial usado.
  - se sincroniza `link_profiles/{uid}` para desbloqueo de acceso activo cuando corresponde.
- Resultado:
  - los clientes guardados en Firebase pueden activar trial aunque el storage SQL/Admin SDK falle temporalmente.

## Subscription request notifications linked to Super Admin (2026-02-26)

- Modulos ajustados:
  - `src/app/api/subscription/request/route.ts`
  - `src/app/admin/page.tsx`
- Cambios aplicados:
  - cada solicitud enviada desde Billing (trial, pago o free) ahora escribe metadatos vinculados en `users/{uid}`:
    - `latestSubscriptionRequest*` (plan, tipo, estado, notas, fechas, unread).
  - se agrega escritura best-effort de evento en `subscription_notifications/*` (sin bloquear el flujo del cliente si falla).
  - si Prisma falla al crear una solicitud de pago, el endpoint usa fallback Firestore y responde exito para que la solicitud igual llegue al panel admin.
  - el panel `/admin` muestra bandeja de notificaciones en tiempo real con:
    - cliente, correo, plan solicitado, tipo, estado, metodo, fecha y notas.
    - contador de pendientes y accion `Marcar leida`.
  - al activar/desactivar plan desde super admin, la solicitud asociada queda marcada como revisada/leida.
- Objetivo:
  - control operativo centralizado del ciclo solicitud -> revision admin -> activacion/desactivacion, enlazado al dashboard de cada cliente.
## Firestore rules hardening for plan activation and billing requests (2026-02-26)

- Modulos ajustados:
  - `firestore.rules`
  - `src/app/api/subscription/request/route.ts`
- Problema corregido:
  - activaciones/suscripciones podian fallar cuando el documento `users/{uid}` aun no existia o cuando faltaban permisos explicitos para notificaciones de solicitud.
- Correccion aplicada:
  - el endpoint de solicitud ahora incluye campos base de identidad (`uid`, email cuando existe, timestamps) al sincronizar `users/{uid}`.
  - sincronizacion de trial tambien asegura `userId` al escribir `link_profiles/{uid}` para compatibilidad con reglas de ownership.
  - errores de reglas Firestore ahora responden `403` con mensaje claro de permisos insuficientes (en lugar de confundirlo con error de autenticacion).
  - reglas Firestore agregan coleccion `subscription_notifications` (create owner/admin, lectura admin y owner, update/delete admin).
  - reglas de `users` y `link_profiles` aceptan create/update owner con compatibilidad si faltan campos legacy (`uid` o `userId`).
- Resultado:
  - solicitudes de trial/pago/free y activaciones de plan quedan operativas de forma consistente para cuentas nuevas y existentes.
## Real-time admin notifications stream from subscription_notifications (2026-02-26)

- Modulos ajustados:
  - `src/app/admin/page.tsx`
  - `src/app/api/subscription/request/route.ts`
- Cambio:
  - el panel super admin ahora escucha en tiempo real `subscription_notifications` (ademas de fallback en `users/{uid}`) para mostrar solicitudes al instante.
  - se agrega enlace `latestSubscriptionNotificationId` en `users/{uid}` al crear solicitud para trazabilidad directa.
  - accion `Marcar leida` y cambios de plan desde admin sincronizan lectura/estado tanto en `users/{uid}` como en `subscription_notifications/{id}`.
- Resultado:
  - la notificacion de Billing aparece en super admin en tiempo real con menor dependencia de campos derivados.
## Firestore ownership compatibility hardening (2026-02-26)

- Archivo ajustado: irestore.rules.
- Problema resuelto:
  - algunos documentos legacy en cloned_sites y projects no tenian userId, lo que provocaba permission-denied al guardar en Store/Builder/Editor para cuentas validas.
- Cambio aplicado:
  - reglas de update ahora permiten reclamo seguro de ownership solo cuando el documento legacy no tiene userId y el request establece userId == auth.uid.
  - para documentos modernos, userId permanece inmutable y solo el owner/admin puede actualizar o borrar.
- Impacto:
  - se elimina falso error de permisos en autosave/publicacion para cuentas autenticadas.
  - la compatibilidad se aplica transversalmente a Store, Builder y Editor al compartir colecciones cloned_sites/projects.

## Link Hub PRO sales features + pricing copy refresh (2026-02-27)

- Modulos ajustados:
  - `src/lib/linkHubProfile.ts`
  - `src/app/linkhub/page.tsx`
  - `src/app/bio/[slug]/page.tsx`
  - `src/components/carta/ProductCard.tsx`
  - `src/lib/subscription/plans.ts`
  - `src/components/subscription/PricingTable.tsx`
  - `src/components/landing/LandingHome.tsx`
  - `src/app/dashboard/billing/page.tsx`
- Cambios funcionales:
  - se agregan capacidades PRO persistentes en `link_profiles`:
    - `proTestimonials` (5 testimonios)
    - `proDeliveryModes` (delivery, pickup, dinein)
    - `proFeaturesUnlocked`
    - por item: `salesCopy` y `galleryImageUrls` (hasta 5 fotos)
  - dashboard `/linkhub` incorpora bloque "Funciones PRO para vender mas" con candado visible para Starter/Business.
  - en plan PRO se habilita:
    - edicion de testimonios reales
    - copys de venta por item (individual y masivo)
    - galeria extra por producto con upload/URL y eliminacion
    - configuracion de despacho en checkout
  - pagina publica `/bio/[slug]` consume funciones PRO:
    - testimonios con transicion en tab contacto
    - `salesCopy` y mini galeria en tarjetas de producto
    - checkout filtra opciones de entrega segun configuracion PRO
  - copy comercial de planes actualizado en Landing/Billing para reforzar beneficios PRO.
- Compatibilidad:
  - normalizacion backward-compatible para perfiles legacy sin nuevos campos.
  - Starter/Business mantienen visibilidad de features con estado bloqueado (sin romper datos existentes).

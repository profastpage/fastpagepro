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

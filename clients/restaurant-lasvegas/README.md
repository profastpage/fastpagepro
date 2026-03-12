# Fastpage 2.0 (Next.js)

Proyecto migrado a formato **Next.js App Router**.

## Estructura principal

- `src/app`: rutas, layouts y API routes de Next.js
- `src/components`: componentes reutilizables
- `src/lib`: utilidades e integraciones
- `src/context`: providers/contexto global

## Comandos

```bash
npm install
npm run dev
npm run build
npm start
```

## Notas

- Se eliminaron archivos legacy estáticos (`.html`, `app.js`, `styles.css`) de la raíz para mantener una base 100% Next.js.

## Theming Premium de Carta (Link Hub)

- Archivo central: `src/theme/cartaThemes.ts`
  - `CARTA_THEMES`: tokens de color/estilo por preset.
  - `CartaThemeId`: tipo de IDs de tema.
  - `DEFAULT_THEME_BY_RUBRO`: mapeo de rubro a tema por defecto.
  - `recommendCartaThemeIdByRubro`: recomendacion automatica por texto de rubro.
- Provider: `src/theme/CartaThemeProvider.tsx`
  - aplica CSS variables de tema en un wrapper para la carta publica.

### Como agregar un nuevo tema

1. Agrega un objeto en `CARTA_THEMES` con un nuevo ID y todos los tokens requeridos.
2. El ID nuevo queda disponible automaticamente en el selector del dashboard (`/linkhub`).
3. Si quieres recomendacion por rubro:
   - agrega entrada en `DEFAULT_THEME_BY_RUBRO`, o
   - extiende reglas de `recommendCartaThemeIdByRubro`.

### Como asignar tema por rubro

- Auto: al normalizar/crear perfil, `cartaThemeId` se sugiere segun rubro.
- Manual: en `/linkhub` -> bloque `Tema premium de carta (menu)` -> selector.
- Persistencia: campo `cartaThemeId` se guarda en `link_profiles/{uid}`.

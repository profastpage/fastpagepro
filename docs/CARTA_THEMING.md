# Carta Digital Theming

## Resumen

El sistema de temas premium de Carta Digital vive en:

- `src/theme/cartaThemes.ts`
- `src/theme/CartaThemeProvider.tsx`

Persistencia en Firestore:

- Documento: `link_profiles/{uid}`
- Campo: `cartaThemeId`

## Agregar un nuevo tema

1. Abrir `src/theme/cartaThemes.ts`.
2. Crear un nuevo preset dentro de `CARTA_THEMES` con un `id` unico y todos los tokens:
   - `background`, `surface`, `surface2`
   - `text`, `mutedText`
   - `primary`, `primaryHover`, `primaryText`
   - `accent`, `accentHover`
   - `border`, `ring`, `shadow`
   - `chip*`, `nav*`, `badge*`, `button*`, `input*`, `gradientHero`
3. Guardar. El selector del dashboard lo detecta automaticamente desde `CARTA_THEME_OPTIONS`.

Ejemplo minimo:

```ts
my_theme: {
  id: "my_theme",
  name: "My Theme",
  rubro: "Mi Rubro",
  tokens: {
    background: "#0b1020",
    surface: "linear-gradient(...)",
    surface2: "linear-gradient(...)",
    text: "#f8fafc",
    mutedText: "#cbd5e1",
    primary: "#38bdf8",
    primaryHover: "#0ea5e9",
    primaryText: "#082f49",
    accent: "#22c55e",
    accentHover: "#16a34a",
    border: "rgba(56,189,248,0.28)",
    ring: "rgba(56,189,248,0.4)",
    shadow: "0 16px 30px -24px rgba(56,189,248,0.45)",
    chipBg: "rgba(15,23,42,0.9)",
    chipText: "#e2e8f0",
    chipActiveBg: "linear-gradient(...)",
    chipActiveText: "#f8fafc",
    chipBorder: "rgba(56,189,248,0.32)",
    navBg: "linear-gradient(...)",
    navActiveBg: "linear-gradient(...)",
    navActiveText: "#f8fafc",
    navText: "#cbd5e1",
    badgeBg: "linear-gradient(...)",
    badgeText: "#f8fafc",
    buttonBg: "linear-gradient(...)",
    buttonText: "#f8fafc",
    buttonSecondaryBg: "rgba(15,23,42,0.88)",
    inputBg: "rgba(15,23,42,0.88)",
    inputText: "#f8fafc",
    placeholder: "#94a3b8",
    inputBorder: "rgba(56,189,248,0.3)",
    gradientHero: "linear-gradient(...)",
  },
}
```

## Asignar tema por rubro (auto recomendacion)

1. Abrir `DEFAULT_THEME_BY_RUBRO` en `src/theme/cartaThemes.ts`.
2. Agregar o ajustar el mapeo:

```ts
"Mi Rubro": "my_theme",
```

3. Si deseas heuristica flexible por texto, ampliar `recommendCartaThemeIdByRubro`.

## Flujo en dashboard

- Ruta: `/linkhub`
- Selector: bloque `Tema premium de carta (menu)`
- Vista previa: se actualiza en vivo en `Preview Mobile`.
- Guardado: al usar `Guardar borrador` o `Publicar Carta Digital`.

## Validacion recomendada

Ejecutar:

```bash
npm run typecheck
npm run build
```

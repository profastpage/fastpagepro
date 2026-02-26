export type CartaThemeTokens = {
  background: string;
  surface: string;
  surface2: string;
  text: string;
  mutedText: string;
  primary: string;
  primaryHover: string;
  primaryText: string;
  accent: string;
  accentHover: string;
  border: string;
  ring: string;
  shadow: string;
  chipBg: string;
  chipText: string;
  chipActiveBg: string;
  chipActiveText: string;
  chipBorder: string;
  navBg: string;
  navActiveBg: string;
  navActiveText: string;
  navText: string;
  badgeBg: string;
  badgeText: string;
  buttonBg: string;
  buttonText: string;
  buttonSecondaryBg: string;
  inputBg: string;
  inputText: string;
  placeholder: string;
  inputBorder: string;
  gradientHero: string;
};

export type CartaThemePreset = {
  id: string;
  name: string;
  rubro: string;
  previewImage: string;
  previewDescription: string;
  official: boolean;
  sortOrder: number;
  tokens: CartaThemeTokens;
};

export const CARTA_THEMES = {
  gourmet: {
    id: "gourmet",
    name: "Ceviche House",
    rubro: "Tema oficial · Carta Digital",
    previewImage: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?q=80&w=1600&auto=format&fit=crop",
    previewDescription: "Carta marina enfocada en pedidos por WhatsApp.",
    official: true,
    sortOrder: 4,
    tokens: {
      background: "#05070d",
      surface: "linear-gradient(160deg, rgba(255,255,255,0.05) 0%, rgba(250,204,21,0.08) 34%, rgba(3,7,18,0.92) 100%)",
      surface2: "linear-gradient(145deg, rgba(2,6,23,0.95) 0%, rgba(180,83,9,0.16) 100%)",
      text: "#f8fafc",
      mutedText: "#cbd5e1",
      primary: "#d4a84f",
      primaryHover: "#e4bf70",
      primaryText: "#0b1220",
      accent: "#b45309",
      accentHover: "#c66a1a",
      border: "rgba(212,168,79,0.34)",
      ring: "rgba(212,168,79,0.46)",
      shadow: "0 18px 36px -24px rgba(212,168,79,0.55)",
      chipBg: "rgba(12,18,30,0.88)",
      chipText: "#e2e8f0",
      chipActiveBg: "linear-gradient(130deg, rgba(212,168,79,0.34) 0%, rgba(180,83,9,0.26) 100%)",
      chipActiveText: "#fff7ed",
      chipBorder: "rgba(212,168,79,0.42)",
      navBg: "linear-gradient(120deg, rgba(3,7,18,0.95) 0%, rgba(10,15,27,0.95) 100%)",
      navActiveBg: "linear-gradient(125deg, rgba(212,168,79,0.34) 0%, rgba(180,83,9,0.28) 100%)",
      navActiveText: "#fff7ed",
      navText: "#cbd5e1",
      badgeBg: "linear-gradient(120deg, rgba(127,29,29,0.9) 0%, rgba(212,168,79,0.36) 100%)",
      badgeText: "#fef2f2",
      buttonBg: "linear-gradient(130deg, rgba(212,168,79,0.34) 0%, rgba(180,83,9,0.3) 100%)",
      buttonText: "#fff7ed",
      buttonSecondaryBg: "rgba(11,18,32,0.88)",
      inputBg: "rgba(9,14,26,0.86)",
      inputText: "#f8fafc",
      placeholder: "#94a3b8",
      inputBorder: "rgba(212,168,79,0.34)",
      gradientHero: "linear-gradient(120deg, rgba(3,7,18,0.96) 0%, rgba(212,168,79,0.22) 42%, rgba(180,83,9,0.2) 100%)",
    },
  },
  cafe: {
    id: "cafe",
    name: "Coffee Route",
    rubro: "Tema oficial · Carta Digital",
    previewImage: "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?q=80&w=1600&auto=format&fit=crop",
    previewDescription: "Menu cafeteria con upsell y recomendados.",
    official: true,
    sortOrder: 3,
    tokens: {
      background: "#f5ede2",
      surface: "linear-gradient(150deg, rgba(255,255,255,0.88) 0%, rgba(210,180,140,0.2) 100%)",
      surface2: "linear-gradient(140deg, rgba(255,255,255,0.95) 0%, rgba(205,133,63,0.18) 100%)",
      text: "#3a281f",
      mutedText: "#6c5648",
      primary: "#6f4e37",
      primaryHover: "#5b3f2d",
      primaryText: "#fff7ed",
      accent: "#b86f50",
      accentHover: "#9f5f45",
      border: "rgba(111,78,55,0.24)",
      ring: "rgba(111,78,55,0.38)",
      shadow: "0 16px 30px -24px rgba(111,78,55,0.35)",
      chipBg: "rgba(255,250,244,0.92)",
      chipText: "#4a3226",
      chipActiveBg: "linear-gradient(130deg, rgba(111,78,55,0.92) 0%, rgba(91,63,45,0.9) 100%)",
      chipActiveText: "#fff7ed",
      chipBorder: "rgba(111,78,55,0.26)",
      navBg: "linear-gradient(120deg, rgba(255,249,242,0.92) 0%, rgba(241,226,206,0.92) 100%)",
      navActiveBg: "linear-gradient(130deg, rgba(111,78,55,0.9) 0%, rgba(91,63,45,0.88) 100%)",
      navActiveText: "#fff7ed",
      navText: "#6c5648",
      badgeBg: "linear-gradient(120deg, rgba(184,111,80,0.92) 0%, rgba(111,78,55,0.84) 100%)",
      badgeText: "#fff7ed",
      buttonBg: "linear-gradient(130deg, rgba(111,78,55,0.92) 0%, rgba(91,63,45,0.9) 100%)",
      buttonText: "#fff7ed",
      buttonSecondaryBg: "rgba(111,78,55,0.12)",
      inputBg: "rgba(255,252,247,0.92)",
      inputText: "#3a281f",
      placeholder: "#8b6e5c",
      inputBorder: "rgba(111,78,55,0.24)",
      gradientHero: "linear-gradient(120deg, rgba(255,248,238,0.95) 0%, rgba(210,180,140,0.38) 45%, rgba(184,111,80,0.28) 100%)",
    },
  },
  sushi: {
    id: "sushi",
    name: "Sushi Prime",
    rubro: "Tema oficial · Carta Digital",
    previewImage: "https://images.unsplash.com/photo-1579871494447-9811cf80d66c?q=80&w=1600&auto=format&fit=crop",
    previewDescription: "Carta premium con favoritos del dia y pedidos por WhatsApp.",
    official: true,
    sortOrder: 1,
    tokens: {
      background: "#08090c",
      surface: "linear-gradient(160deg, rgba(255,255,255,0.04) 0%, rgba(185,28,28,0.16) 42%, rgba(10,10,10,0.92) 100%)",
      surface2: "linear-gradient(145deg, rgba(10,10,10,0.95) 0%, rgba(153,27,27,0.18) 100%)",
      text: "#f5f5f4",
      mutedText: "#d6d3d1",
      primary: "#b91c1c",
      primaryHover: "#991b1b",
      primaryText: "#fff7ed",
      accent: "#f1f5f9",
      accentHover: "#e2e8f0",
      border: "rgba(185,28,28,0.34)",
      ring: "rgba(185,28,28,0.46)",
      shadow: "0 18px 36px -24px rgba(185,28,28,0.45)",
      chipBg: "rgba(24,24,27,0.9)",
      chipText: "#e7e5e4",
      chipActiveBg: "linear-gradient(130deg, rgba(185,28,28,0.9) 0%, rgba(127,29,29,0.84) 100%)",
      chipActiveText: "#fff7ed",
      chipBorder: "rgba(185,28,28,0.38)",
      navBg: "linear-gradient(120deg, rgba(9,9,11,0.95) 0%, rgba(24,24,27,0.95) 100%)",
      navActiveBg: "linear-gradient(130deg, rgba(185,28,28,0.86) 0%, rgba(127,29,29,0.84) 100%)",
      navActiveText: "#fff7ed",
      navText: "#d6d3d1",
      badgeBg: "linear-gradient(120deg, rgba(185,28,28,0.95) 0%, rgba(239,68,68,0.8) 100%)",
      badgeText: "#fff5f5",
      buttonBg: "linear-gradient(130deg, rgba(185,28,28,0.9) 0%, rgba(127,29,29,0.88) 100%)",
      buttonText: "#fff7ed",
      buttonSecondaryBg: "rgba(24,24,27,0.88)",
      inputBg: "rgba(24,24,27,0.9)",
      inputText: "#f5f5f4",
      placeholder: "#a8a29e",
      inputBorder: "rgba(185,28,28,0.32)",
      gradientHero: "linear-gradient(120deg, rgba(9,9,11,0.96) 0%, rgba(185,28,28,0.24) 45%, rgba(245,245,244,0.08) 100%)",
    },
  },
  fastfood: {
    id: "fastfood",
    name: "Burger Lab",
    rubro: "Tema oficial · Carta Digital",
    previewImage: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?q=80&w=1600&auto=format&fit=crop",
    previewDescription: "Combos rapidos y categorias para delivery.",
    official: true,
    sortOrder: 2,
    tokens: {
      background: "#11151b",
      surface: "linear-gradient(160deg, rgba(255,255,255,0.05) 0%, rgba(251,146,60,0.18) 44%, rgba(15,23,42,0.92) 100%)",
      surface2: "linear-gradient(145deg, rgba(30,41,59,0.94) 0%, rgba(251,191,36,0.16) 100%)",
      text: "#f8fafc",
      mutedText: "#cbd5e1",
      primary: "#f97316",
      primaryHover: "#ea580c",
      primaryText: "#fff7ed",
      accent: "#fbbf24",
      accentHover: "#f59e0b",
      border: "rgba(249,115,22,0.34)",
      ring: "rgba(249,115,22,0.46)",
      shadow: "0 18px 36px -24px rgba(249,115,22,0.45)",
      chipBg: "rgba(15,23,42,0.88)",
      chipText: "#f1f5f9",
      chipActiveBg: "linear-gradient(130deg, rgba(249,115,22,0.9) 0%, rgba(245,158,11,0.84) 100%)",
      chipActiveText: "#fff7ed",
      chipBorder: "rgba(249,115,22,0.38)",
      navBg: "linear-gradient(120deg, rgba(15,23,42,0.96) 0%, rgba(30,41,59,0.95) 100%)",
      navActiveBg: "linear-gradient(130deg, rgba(249,115,22,0.9) 0%, rgba(245,158,11,0.84) 100%)",
      navActiveText: "#fff7ed",
      navText: "#cbd5e1",
      badgeBg: "linear-gradient(120deg, rgba(220,38,38,0.92) 0%, rgba(249,115,22,0.84) 100%)",
      badgeText: "#fff7ed",
      buttonBg: "linear-gradient(130deg, rgba(249,115,22,0.9) 0%, rgba(245,158,11,0.84) 100%)",
      buttonText: "#fff7ed",
      buttonSecondaryBg: "rgba(15,23,42,0.88)",
      inputBg: "rgba(15,23,42,0.88)",
      inputText: "#f8fafc",
      placeholder: "#94a3b8",
      inputBorder: "rgba(249,115,22,0.32)",
      gradientHero: "linear-gradient(120deg, rgba(15,23,42,0.95) 0%, rgba(249,115,22,0.24) 48%, rgba(251,191,36,0.2) 100%)",
    },
  },
  polleria_parrilla: {
    id: "polleria_parrilla",
    name: "Brasa Power",
    rubro: "Tema oficial · Carta Digital",
    previewImage: "https://images.unsplash.com/photo-1600891964092-4316c288032e?q=80&w=1600&auto=format&fit=crop",
    previewDescription: "Pollo a la brasa con combos y delivery por zonas.",
    official: true,
    sortOrder: 6,
    tokens: {
      background: "#080a0d",
      surface: "linear-gradient(160deg, rgba(255,255,255,0.04) 0%, rgba(245,158,11,0.16) 40%, rgba(10,10,10,0.95) 100%)",
      surface2: "linear-gradient(145deg, rgba(15,23,42,0.95) 0%, rgba(217,119,6,0.18) 100%)",
      text: "#f8fafc",
      mutedText: "#d1d5db",
      primary: "#f59e0b",
      primaryHover: "#d97706",
      primaryText: "#fff7ed",
      accent: "#b91c1c",
      accentHover: "#991b1b",
      border: "rgba(245,158,11,0.34)",
      ring: "rgba(245,158,11,0.46)",
      shadow: "0 18px 36px -24px rgba(245,158,11,0.46)",
      chipBg: "rgba(17,24,39,0.9)",
      chipText: "#f3f4f6",
      chipActiveBg: "linear-gradient(130deg, rgba(245,158,11,0.9) 0%, rgba(217,119,6,0.86) 100%)",
      chipActiveText: "#fff7ed",
      chipBorder: "rgba(245,158,11,0.38)",
      navBg: "linear-gradient(120deg, rgba(3,7,18,0.96) 0%, rgba(17,24,39,0.95) 100%)",
      navActiveBg: "linear-gradient(130deg, rgba(245,158,11,0.88) 0%, rgba(217,119,6,0.84) 100%)",
      navActiveText: "#fff7ed",
      navText: "#d1d5db",
      badgeBg: "linear-gradient(120deg, rgba(185,28,28,0.9) 0%, rgba(127,29,29,0.84) 100%)",
      badgeText: "#fef2f2",
      buttonBg: "linear-gradient(130deg, rgba(245,158,11,0.9) 0%, rgba(217,119,6,0.84) 100%)",
      buttonText: "#fff7ed",
      buttonSecondaryBg: "rgba(17,24,39,0.9)",
      inputBg: "rgba(17,24,39,0.9)",
      inputText: "#f8fafc",
      placeholder: "#9ca3af",
      inputBorder: "rgba(245,158,11,0.32)",
      gradientHero: "linear-gradient(120deg, rgba(3,7,18,0.96) 0%, rgba(245,158,11,0.22) 44%, rgba(185,28,28,0.18) 100%)",
    },
  },
  healthy: {
    id: "healthy",
    name: "Tacos Street",
    rubro: "Tema extra · Carta Digital",
    previewImage: "https://images.unsplash.com/photo-1613514785940-daed07799d9b?q=80&w=1600&auto=format&fit=crop",
    previewDescription: "Street food vibrante con acentos verdes y fondo claro.",
    official: false,
    sortOrder: 7,
    tokens: {
      background: "#f7faf8",
      surface: "linear-gradient(155deg, rgba(255,255,255,0.95) 0%, rgba(22,163,74,0.08) 100%)",
      surface2: "linear-gradient(145deg, rgba(255,255,255,0.96) 0%, rgba(132,204,22,0.12) 100%)",
      text: "#1f2937",
      mutedText: "#4b5563",
      primary: "#166534",
      primaryHover: "#14532d",
      primaryText: "#f0fdf4",
      accent: "#84cc16",
      accentHover: "#65a30d",
      border: "rgba(22,101,52,0.24)",
      ring: "rgba(22,101,52,0.34)",
      shadow: "0 16px 30px -24px rgba(22,101,52,0.34)",
      chipBg: "rgba(255,255,255,0.95)",
      chipText: "#1f2937",
      chipActiveBg: "linear-gradient(130deg, rgba(22,101,52,0.92) 0%, rgba(21,128,61,0.9) 100%)",
      chipActiveText: "#f0fdf4",
      chipBorder: "rgba(22,101,52,0.24)",
      navBg: "linear-gradient(120deg, rgba(255,255,255,0.94) 0%, rgba(240,253,244,0.94) 100%)",
      navActiveBg: "linear-gradient(130deg, rgba(22,101,52,0.9) 0%, rgba(21,128,61,0.88) 100%)",
      navActiveText: "#f0fdf4",
      navText: "#4b5563",
      badgeBg: "linear-gradient(120deg, rgba(101,163,13,0.9) 0%, rgba(22,101,52,0.82) 100%)",
      badgeText: "#f7fee7",
      buttonBg: "linear-gradient(130deg, rgba(22,101,52,0.9) 0%, rgba(21,128,61,0.88) 100%)",
      buttonText: "#f0fdf4",
      buttonSecondaryBg: "rgba(22,101,52,0.1)",
      inputBg: "rgba(255,255,255,0.96)",
      inputText: "#1f2937",
      placeholder: "#6b7280",
      inputBorder: "rgba(22,101,52,0.2)",
      gradientHero: "linear-gradient(120deg, rgba(255,255,255,0.98) 0%, rgba(22,163,74,0.14) 48%, rgba(132,204,22,0.12) 100%)",
    },
  },
  desserts: {
    id: "desserts",
    name: "Pizza Norte",
    rubro: "Tema oficial · Carta Digital",
    previewImage: "https://images.unsplash.com/photo-1513104890138-7c749659a591?q=80&w=1600&auto=format&fit=crop",
    previewDescription: "Pizzeria con promos y pedidos rapidos por WhatsApp.",
    official: true,
    sortOrder: 5,
    tokens: {
      background: "#fff5f7",
      surface: "linear-gradient(155deg, rgba(255,255,255,0.96) 0%, rgba(244,114,182,0.12) 100%)",
      surface2: "linear-gradient(145deg, rgba(255,255,255,0.95) 0%, rgba(210,105,30,0.1) 100%)",
      text: "#4a1d2b",
      mutedText: "#7a4b58",
      primary: "#be185d",
      primaryHover: "#9d174d",
      primaryText: "#fff1f2",
      accent: "#a16207",
      accentHover: "#854d0e",
      border: "rgba(190,24,93,0.24)",
      ring: "rgba(190,24,93,0.34)",
      shadow: "0 16px 30px -24px rgba(190,24,93,0.34)",
      chipBg: "rgba(255,255,255,0.95)",
      chipText: "#4a1d2b",
      chipActiveBg: "linear-gradient(130deg, rgba(190,24,93,0.9) 0%, rgba(244,114,182,0.84) 100%)",
      chipActiveText: "#fff1f2",
      chipBorder: "rgba(190,24,93,0.24)",
      navBg: "linear-gradient(120deg, rgba(255,255,255,0.95) 0%, rgba(255,241,242,0.95) 100%)",
      navActiveBg: "linear-gradient(130deg, rgba(190,24,93,0.9) 0%, rgba(244,114,182,0.84) 100%)",
      navActiveText: "#fff1f2",
      navText: "#7a4b58",
      badgeBg: "linear-gradient(120deg, rgba(161,98,7,0.9) 0%, rgba(190,24,93,0.8) 100%)",
      badgeText: "#fff7ed",
      buttonBg: "linear-gradient(130deg, rgba(190,24,93,0.9) 0%, rgba(244,114,182,0.84) 100%)",
      buttonText: "#fff1f2",
      buttonSecondaryBg: "rgba(190,24,93,0.1)",
      inputBg: "rgba(255,255,255,0.96)",
      inputText: "#4a1d2b",
      placeholder: "#8b5e67",
      inputBorder: "rgba(190,24,93,0.2)",
      gradientHero: "linear-gradient(120deg, rgba(255,255,255,0.98) 0%, rgba(244,114,182,0.18) 48%, rgba(161,98,7,0.12) 100%)",
    },
  },
  bar_drinks: {
    id: "bar_drinks",
    name: "Fuego Criollo",
    rubro: "Tema extra · Carta Digital",
    previewImage: "https://images.unsplash.com/photo-1556740749-887f6717d7e4?q=80&w=1600&auto=format&fit=crop",
    previewDescription: "Parrilla urbana premium con look nocturno.",
    official: false,
    sortOrder: 8,
    tokens: {
      background: "#050711",
      surface: "linear-gradient(160deg, rgba(255,255,255,0.04) 0%, rgba(124,58,237,0.18) 44%, rgba(4,10,24,0.94) 100%)",
      surface2: "linear-gradient(145deg, rgba(2,6,23,0.95) 0%, rgba(14,116,144,0.16) 100%)",
      text: "#e2e8f0",
      mutedText: "#a5b4fc",
      primary: "#7c3aed",
      primaryHover: "#6d28d9",
      primaryText: "#eef2ff",
      accent: "#0891b2",
      accentHover: "#0e7490",
      border: "rgba(124,58,237,0.3)",
      ring: "rgba(124,58,237,0.44)",
      shadow: "0 18px 36px -24px rgba(124,58,237,0.44)",
      chipBg: "rgba(2,6,23,0.9)",
      chipText: "#c7d2fe",
      chipActiveBg: "linear-gradient(130deg, rgba(124,58,237,0.9) 0%, rgba(8,145,178,0.82) 100%)",
      chipActiveText: "#eef2ff",
      chipBorder: "rgba(124,58,237,0.34)",
      navBg: "linear-gradient(120deg, rgba(2,6,23,0.95) 0%, rgba(15,23,42,0.95) 100%)",
      navActiveBg: "linear-gradient(130deg, rgba(124,58,237,0.9) 0%, rgba(8,145,178,0.82) 100%)",
      navActiveText: "#eef2ff",
      navText: "#a5b4fc",
      badgeBg: "linear-gradient(120deg, rgba(30,64,175,0.9) 0%, rgba(124,58,237,0.82) 100%)",
      badgeText: "#eef2ff",
      buttonBg: "linear-gradient(130deg, rgba(124,58,237,0.9) 0%, rgba(8,145,178,0.82) 100%)",
      buttonText: "#eef2ff",
      buttonSecondaryBg: "rgba(2,6,23,0.88)",
      inputBg: "rgba(2,6,23,0.88)",
      inputText: "#e2e8f0",
      placeholder: "#94a3b8",
      inputBorder: "rgba(124,58,237,0.3)",
      gradientHero: "linear-gradient(120deg, rgba(2,6,23,0.96) 0%, rgba(124,58,237,0.22) 42%, rgba(8,145,178,0.18) 100%)",
    },
  },
  marina_fresh: {
    id: "marina_fresh",
    name: "Marina Fresh",
    rubro: "Tema extra · Carta Digital",
    previewImage: "https://images.unsplash.com/photo-1559847844-5315695dadae?q=80&w=1600&auto=format&fit=crop",
    previewDescription: "Estilo marino claro para cevicherias y pescados.",
    official: false,
    sortOrder: 9,
    tokens: {
      background: "#f2f9fb",
      surface: "linear-gradient(155deg, rgba(255,255,255,0.96) 0%, rgba(14,116,144,0.12) 100%)",
      surface2: "linear-gradient(145deg, rgba(255,255,255,0.95) 0%, rgba(56,189,248,0.1) 100%)",
      text: "#0f172a",
      mutedText: "#334155",
      primary: "#0e7490",
      primaryHover: "#155e75",
      primaryText: "#ecfeff",
      accent: "#0284c7",
      accentHover: "#0369a1",
      border: "rgba(14,116,144,0.24)",
      ring: "rgba(14,116,144,0.35)",
      shadow: "0 16px 30px -24px rgba(14,116,144,0.38)",
      chipBg: "rgba(255,255,255,0.96)",
      chipText: "#0f172a",
      chipActiveBg: "linear-gradient(130deg, rgba(14,116,144,0.92) 0%, rgba(2,132,199,0.86) 100%)",
      chipActiveText: "#ecfeff",
      chipBorder: "rgba(14,116,144,0.24)",
      navBg: "linear-gradient(120deg, rgba(255,255,255,0.95) 0%, rgba(240,249,255,0.94) 100%)",
      navActiveBg: "linear-gradient(130deg, rgba(14,116,144,0.92) 0%, rgba(2,132,199,0.86) 100%)",
      navActiveText: "#ecfeff",
      navText: "#334155",
      badgeBg: "linear-gradient(120deg, rgba(2,132,199,0.9) 0%, rgba(14,116,144,0.84) 100%)",
      badgeText: "#ecfeff",
      buttonBg: "linear-gradient(130deg, rgba(14,116,144,0.92) 0%, rgba(2,132,199,0.86) 100%)",
      buttonText: "#ecfeff",
      buttonSecondaryBg: "rgba(14,116,144,0.1)",
      inputBg: "rgba(255,255,255,0.96)",
      inputText: "#0f172a",
      placeholder: "#64748b",
      inputBorder: "rgba(14,116,144,0.2)",
      gradientHero: "linear-gradient(120deg, rgba(255,255,255,0.98) 0%, rgba(14,116,144,0.12) 48%, rgba(2,132,199,0.14) 100%)",
    },
  },
  criollo_lima: {
    id: "criollo_lima",
    name: "Criollo Lima",
    rubro: "Tema extra · Carta Digital",
    previewImage: "https://images.unsplash.com/photo-1544025162-d76694265947?q=80&w=1600&auto=format&fit=crop",
    previewDescription: "Carta tradicional con acentos dorados y gran contraste.",
    official: false,
    sortOrder: 10,
    tokens: {
      background: "#101214",
      surface: "linear-gradient(160deg, rgba(255,255,255,0.05) 0%, rgba(202,138,4,0.16) 44%, rgba(9,9,11,0.94) 100%)",
      surface2: "linear-gradient(145deg, rgba(24,24,27,0.95) 0%, rgba(161,98,7,0.2) 100%)",
      text: "#fefce8",
      mutedText: "#fde68a",
      primary: "#ca8a04",
      primaryHover: "#a16207",
      primaryText: "#fff7ed",
      accent: "#f97316",
      accentHover: "#ea580c",
      border: "rgba(202,138,4,0.34)",
      ring: "rgba(202,138,4,0.45)",
      shadow: "0 18px 36px -24px rgba(202,138,4,0.5)",
      chipBg: "rgba(24,24,27,0.9)",
      chipText: "#fde68a",
      chipActiveBg: "linear-gradient(130deg, rgba(202,138,4,0.92) 0%, rgba(249,115,22,0.84) 100%)",
      chipActiveText: "#fff7ed",
      chipBorder: "rgba(202,138,4,0.34)",
      navBg: "linear-gradient(120deg, rgba(9,9,11,0.96) 0%, rgba(24,24,27,0.95) 100%)",
      navActiveBg: "linear-gradient(130deg, rgba(202,138,4,0.92) 0%, rgba(249,115,22,0.84) 100%)",
      navActiveText: "#fff7ed",
      navText: "#fde68a",
      badgeBg: "linear-gradient(120deg, rgba(249,115,22,0.9) 0%, rgba(202,138,4,0.84) 100%)",
      badgeText: "#fff7ed",
      buttonBg: "linear-gradient(130deg, rgba(202,138,4,0.92) 0%, rgba(249,115,22,0.84) 100%)",
      buttonText: "#fff7ed",
      buttonSecondaryBg: "rgba(24,24,27,0.9)",
      inputBg: "rgba(24,24,27,0.9)",
      inputText: "#fefce8",
      placeholder: "#fcd34d",
      inputBorder: "rgba(202,138,4,0.28)",
      gradientHero: "linear-gradient(120deg, rgba(9,9,11,0.96) 0%, rgba(202,138,4,0.26) 44%, rgba(249,115,22,0.2) 100%)",
    },
  },
} as const satisfies Record<string, CartaThemePreset>;

export type CartaThemeId = keyof typeof CARTA_THEMES;

export const DEFAULT_THEME_BY_RUBRO: Record<string, CartaThemeId> = {
  "Gourmet / Fine Dining": "gourmet",
  "Cafe / Bakery": "cafe",
  "Sushi / Asian": "sushi",
  "Fast Food / Burger": "fastfood",
  "Polleria / Parrilla": "polleria_parrilla",
  "Healthy / Vegano": "healthy",
  "Postres / Heladeria": "desserts",
  "Bar / Drinks": "bar_drinks",
  "Restaurante / Cafeteria": "sushi",
  "Tienda / General": "fastfood",
};

const LEGACY_THEME_ALIASES: Record<string, CartaThemeId> = {
  gourmet: "gourmet",
  cafe: "cafe",
  sushi: "sushi",
  fastfood: "fastfood",
  polleria_parrilla: "polleria_parrilla",
  healthy: "healthy",
  desserts: "desserts",
  bar_drinks: "bar_drinks",
};

export const CARTA_THEME_OPTIONS = Object.values(CARTA_THEMES)
  .map((theme) => ({
    id: theme.id as CartaThemeId,
    name: theme.name,
    rubro: theme.rubro,
    preview: [theme.tokens.primary, theme.tokens.accent, theme.tokens.background],
    previewImage: theme.previewImage,
    previewDescription: theme.previewDescription,
    official: theme.official,
    sortOrder: theme.sortOrder,
  }))
  .sort((a, b) => a.sortOrder - b.sortOrder);

export function getSafeCartaThemeId(value?: string | null): CartaThemeId {
  if (!value) return "sushi";
  if (value in CARTA_THEMES) return value as CartaThemeId;
  const alias = LEGACY_THEME_ALIASES[value];
  if (alias && alias in CARTA_THEMES) return alias;
  return "sushi";
}

export function getCartaTheme(themeId?: string | null): CartaThemePreset {
  return CARTA_THEMES[getSafeCartaThemeId(themeId)];
}

export function recommendCartaThemeIdByRubro(rubro?: string | null): CartaThemeId {
  const source = String(rubro || "").toLowerCase().trim();
  if (!source) return "sushi";

  const direct = DEFAULT_THEME_BY_RUBRO[rubro || ""];
  if (direct) return direct;

  if (source.includes("sushi") || source.includes("asian") || source.includes("nikkei") || source.includes("ramen")) {
    return "sushi";
  }
  if (source.includes("cafe") || source.includes("cafeteria") || source.includes("bakery") || source.includes("panader")) {
    return "cafe";
  }
  if (source.includes("burger") || source.includes("fast") || source.includes("hamburg")) {
    return "fastfood";
  }
  if (source.includes("polleria") || source.includes("parrilla") || source.includes("brasa") || source.includes("grill") || source.includes("pollo")) {
    return "polleria_parrilla";
  }
  if (source.includes("ceviche") || source.includes("marino") || source.includes("pescado") || source.includes("marisc")) {
    return "gourmet";
  }
  if (source.includes("pizza") || source.includes("pizzeria")) {
    return "desserts";
  }
  if (source.includes("vegan") || source.includes("vegano") || source.includes("healthy") || source.includes("salud")) {
    return "healthy";
  }
  if (source.includes("postre") || source.includes("helad") || source.includes("dessert") || source.includes("pasteler") || source.includes("dulce")) {
    return "criollo_lima";
  }
  if (source.includes("bar") || source.includes("drink") || source.includes("cocktail") || source.includes("coctel")) {
    return "bar_drinks";
  }
  if (source.includes("taco") || source.includes("mex")) {
    return "healthy";
  }
  if (source.includes("criollo") || source.includes("peruan")) {
    return "criollo_lima";
  }
  if (source.includes("fusion") || source.includes("marina")) {
    return "marina_fresh";
  }
  if (source.includes("gourmet") || source.includes("fine")) {
    return "gourmet";
  }
  return "sushi";
}

export function buildCartaThemeCssVars(themeId?: string | null): Record<string, string> {
  const { tokens } = getCartaTheme(themeId);
  return {
    "--carta-bg": tokens.background,
    "--carta-surface": tokens.surface,
    "--carta-surface-2": tokens.surface2,
    "--carta-text": tokens.text,
    "--carta-muted-text": tokens.mutedText,
    "--carta-primary": tokens.primary,
    "--carta-primary-hover": tokens.primaryHover,
    "--carta-primary-text": tokens.primaryText,
    "--carta-accent": tokens.accent,
    "--carta-accent-hover": tokens.accentHover,
    "--carta-border": tokens.border,
    "--carta-ring": tokens.ring,
    "--carta-shadow": tokens.shadow,
    "--carta-chip-bg": tokens.chipBg,
    "--carta-chip-text": tokens.chipText,
    "--carta-chip-active-bg": tokens.chipActiveBg,
    "--carta-chip-active-text": tokens.chipActiveText,
    "--carta-chip-border": tokens.chipBorder,
    "--carta-nav-bg": tokens.navBg,
    "--carta-nav-active-bg": tokens.navActiveBg,
    "--carta-nav-active-text": tokens.navActiveText,
    "--carta-nav-text": tokens.navText,
    "--carta-badge-bg": tokens.badgeBg,
    "--carta-badge-text": tokens.badgeText,
    "--carta-button-bg": tokens.buttonBg,
    "--carta-button-text": tokens.buttonText,
    "--carta-button-secondary-bg": tokens.buttonSecondaryBg,
    "--carta-input-bg": tokens.inputBg,
    "--carta-input-text": tokens.inputText,
    "--carta-placeholder": tokens.placeholder,
    "--carta-input-border": tokens.inputBorder,
    "--carta-gradient-hero": tokens.gradientHero,
  };
}

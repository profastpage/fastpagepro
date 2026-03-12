export interface ThemeRecommenderInput {
  category: string;
  logoColors: string[];
}

export interface ConversionStructureSuggestion {
  heroHeadlineTemplate: string;
  ctaLabel: string;
  recommendedSections: string[];
  conversionNotes: string[];
}

export interface ThemeRecommenderResult {
  theme: "midnight" | "ocean" | "sunset" | "aurora" | "graphite" | "cobalt";
  suggestedPalette: {
    primary: string;
    secondary: string;
    accent: string;
  };
  structure: ConversionStructureSuggestion;
}

const CATEGORY_THEME_MAP: Record<string, ThemeRecommenderResult["theme"]> = {
  restaurante: "sunset",
  cevicheria: "ocean",
  comida: "sunset",
  tecnologia: "cobalt",
  software: "graphite",
  saas: "graphite",
  moda: "aurora",
  belleza: "aurora",
  salud: "ocean",
  inmobiliaria: "midnight",
  legal: "midnight",
  consultoria: "graphite",
};

function cleanHex(color: string): string | null {
  const normalized = color.trim();
  if (/^#[a-fA-F0-9]{6}$/.test(normalized)) return normalized;
  return null;
}

function pickTheme(category: string): ThemeRecommenderResult["theme"] {
  const normalized = category.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  for (const [key, theme] of Object.entries(CATEGORY_THEME_MAP)) {
    if (normalized.includes(key)) return theme;
  }
  return "midnight";
}

function buildStructure(category: string): ConversionStructureSuggestion {
  const normalized = category.toLowerCase();
  const isRestaurant = /(rest|food|comida|cevich|pizza|burger|cafeter)/.test(normalized);

  if (isRestaurant) {
    return {
      heroHeadlineTemplate: "Sabor que convierte visitas en pedidos",
      ctaLabel: "Pedir por WhatsApp",
      recommendedSections: [
        "Hero con foto principal",
        "Top platos / destacados",
        "Oferta del día con urgencia",
        "Testimonios",
        "Ubicación + horario + botón de pedido",
      ],
      conversionNotes: [
        "Usar precios claros y promociones por tiempo limitado",
        "Mantener CTA fijo visible en mobile",
        "Mostrar prueba social cerca del primer scroll",
      ],
    };
  }

  return {
    heroHeadlineTemplate: "Convierte tráfico en clientes con una propuesta clara",
    ctaLabel: "Solicitar asesoría",
    recommendedSections: [
      "Hero con propuesta de valor",
      "Beneficios principales",
      "Casos de éxito",
      "Paquetes o planes",
      "Formulario corto o CTA WhatsApp",
    ],
    conversionNotes: [
      "Destacar diferenciadores en los primeros 7 segundos",
      "Evitar formularios largos en móvil",
      "Reforzar confianza con logos de clientes o reseñas",
    ],
  };
}

export function recommendThemeAndStructure(input: ThemeRecommenderInput): ThemeRecommenderResult {
  const theme = pickTheme(input.category);
  const sanitizedLogoColors = input.logoColors.map(cleanHex).filter(Boolean) as string[];
  const primary = sanitizedLogoColors[0] || "#f59e0b";
  const secondary = sanitizedLogoColors[1] || "#0ea5e9";
  const accent = sanitizedLogoColors[2] || "#111827";

  return {
    theme,
    suggestedPalette: {
      primary,
      secondary,
      accent,
    },
    structure: buildStructure(input.category),
  };
}

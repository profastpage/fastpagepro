export type SupportedUiLanguage = "es" | "en" | "pt";

const ES_TO_EN_PHRASES: Record<string, string> = {
  "carta digital": "digital menu",
  "tienda online": "online store",
  "ir ahora": "go now",
  "enlace copiado": "link copied",
  "no disponible": "not available",
  "sin stock": "out of stock",
  "mas vendido": "best seller",
  "reserva premium": "premium booking",
  "envio a domicilio": "home delivery",
  "recoger en local": "store pickup",
  "comer en el lugar": "dine in",
};

const EN_TO_ES_PHRASES: Record<string, string> = {
  "digital menu": "carta digital",
  "online store": "tienda online",
  "go now": "ir ahora",
  "link copied": "enlace copiado",
  "not available": "no disponible",
  "out of stock": "sin stock",
  "best seller": "mas vendido",
  "premium booking": "reserva premium",
  "home delivery": "envio a domicilio",
  "store pickup": "recoger en local",
  "dine in": "comer en el lugar",
};

const ES_TO_EN_WORDS: Record<string, string> = {
  contacto: "contact",
  carta: "menu",
  catalogo: "catalog",
  catalogos: "catalogs",
  ubicacion: "location",
  reserva: "booking",
  reservas: "bookings",
  buscar: "search",
  horario: "schedule",
  horarios: "hours",
  personas: "guests",
  persona: "guest",
  nombre: "name",
  celular: "phone",
  telefono: "phone",
  direccion: "address",
  nota: "note",
  enviar: "send",
  pedido: "order",
  pedidos: "orders",
  producto: "product",
  productos: "products",
  categoria: "category",
  categorias: "categories",
  precio: "price",
  precios: "prices",
  foto: "photo",
  fotos: "photos",
  eliminar: "delete",
  agregar: "add",
  guardar: "save",
  publicar: "publish",
  subir: "upload",
  compartir: "share",
  descuento: "discount",
  ofertas: "offers",
  oferta: "offer",
  stock: "stock",
  terminos: "terms",
  condiciones: "conditions",
  abierto: "open",
  cerrado: "closed",
  delivery: "delivery",
  recojo: "pickup",
  tienda: "store",
  negocio: "business",
};

const EN_TO_ES_WORDS: Record<string, string> = {
  contact: "contacto",
  menu: "carta",
  catalog: "catalogo",
  catalogs: "catalogos",
  location: "ubicacion",
  booking: "reserva",
  bookings: "reservas",
  search: "buscar",
  schedule: "horario",
  hours: "horarios",
  guest: "persona",
  guests: "personas",
  name: "nombre",
  phone: "celular",
  address: "direccion",
  note: "nota",
  send: "enviar",
  order: "pedido",
  orders: "pedidos",
  product: "producto",
  products: "productos",
  category: "categoria",
  categories: "categorias",
  price: "precio",
  prices: "precios",
  photo: "foto",
  photos: "fotos",
  delete: "eliminar",
  add: "agregar",
  save: "guardar",
  publish: "publicar",
  upload: "subir",
  share: "compartir",
  discount: "descuento",
  offers: "ofertas",
  offer: "oferta",
  stock: "stock",
  terms: "terminos",
  conditions: "condiciones",
  open: "abierto",
  closed: "cerrado",
  pickup: "recojo",
  store: "tienda",
  business: "negocio",
};

function normalizeKey(value: string): string {
  return String(value || "")
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}

function preserveCase(input: string, output: string): string {
  if (!output) return output;
  if (input.toUpperCase() === input) return output.toUpperCase();
  if (input[0] === input[0]?.toUpperCase()) {
    return output[0]?.toUpperCase() + output.slice(1);
  }
  return output;
}

function replacePhrases(source: string, phraseMap: Record<string, string>): string {
  const normalizedSource = normalizeKey(source);
  const direct = phraseMap[normalizedSource];
  if (direct) return preserveCase(source, direct);

  const phraseEntries = Object.entries(phraseMap).sort((a, b) => b[0].length - a[0].length);
  let result = source;
  phraseEntries.forEach(([from, to]) => {
    const escaped = from.replace(/[.*+?^${}()|[\]\\]/g, "\\$&").replace(/\s+/g, "\\s+");
    const expression = new RegExp(`\\b${escaped}\\b`, "gi");
    result = result.replace(expression, (match) => preserveCase(match, to));
  });

  return result;
}

function replaceWords(source: string, wordMap: Record<string, string>): string {
  return source.replace(/[A-Za-zÀ-ÖØ-öø-ÿ]+/g, (word) => {
    const translated = wordMap[normalizeKey(word)];
    return translated ? preserveCase(word, translated) : word;
  });
}

export function localizeDynamicText(value: string, language: SupportedUiLanguage): string {
  const source = String(value || "");
  if (!source.trim()) return source;

  if (language === "en") {
    return replaceWords(replacePhrases(source, ES_TO_EN_PHRASES), ES_TO_EN_WORDS);
  }

  if (language === "es") {
    return replaceWords(replacePhrases(source, EN_TO_ES_PHRASES), EN_TO_ES_WORDS);
  }

  return source;
}

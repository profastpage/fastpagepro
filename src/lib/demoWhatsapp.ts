export const OFFICIAL_DEMO_WHATSAPP = "51919662011";

export function buildOfficialDemoCallHref(): string {
  return `tel:+${OFFICIAL_DEMO_WHATSAPP}`;
}

export function buildOfficialDemoWhatsappUrl(lines: string[]): string {
  const query = new URLSearchParams({
    phone: OFFICIAL_DEMO_WHATSAPP,
    text: lines.join("\n"),
  });
  return `https://api.whatsapp.com/send?${query.toString()}`;
}

type RestaurantItem = {
  name: string;
  quantity: number;
  lineTotal: string;
};

type EcommerceItem = {
  name: string;
  quantity: number;
  lineTotal: string;
};

export function buildRestaurantDemoMessage(input: {
  title: string;
  address: string;
  items: RestaurantItem[];
  total: string;
}): string[] {
  const e = {
    wave: "👋",
    plate: "🍽️",
    store: "🏢",
    pin: "📍",
    receipt: "🧾",
    money: "💰",
    thanks: "🙏",
    sparkles: "✨",
  };

  const detailLines =
    input.items.length > 0
      ? input.items.map(
          (item, index) =>
            `${index + 1}. ${e.plate} ${item.name} x${item.quantity} - ${item.lineTotal}.`,
        )
      : [`1. ${e.plate} Aun no agregue productos, pero deseo asesoria para mi pedido.`];

  return [
    `${e.wave} *Hola equipo FastPage!*`,
    `${e.plate} *Quiero realizar un pedido desde la demo de Carta Digital.*`,
    "",
    `${e.store} *Negocio:* ${input.title}.`,
    `${e.pin} *Direccion referencial:* ${input.address}.`,
    "",
    `${e.receipt} *Detalle del pedido:*`,
    ...detailLines,
    "",
    `${e.money} *Total estimado:* ${input.total}.`,
    `${e.thanks} Quedo atento(a) a su confirmacion. Muchas gracias ${e.sparkles}`,
  ];
}

export function buildEcommerceDemoMessage(input: {
  title: string;
  deliveryMode: "delivery" | "retiro";
  items: EcommerceItem[];
  total: string;
}): string[] {
  const e = {
    wave: "👋",
    bag: "🛍️",
    tag: "🏷️",
    box: "📦",
    truck: "🚚",
    store: "🏬",
    receipt: "🧾",
    money: "💰",
    thanks: "🙏",
    sparkles: "✨",
  };

  const detailLines =
    input.items.length > 0
      ? input.items.map(
          (item, index) =>
            `${index + 1}. ${e.bag} ${item.name} x${item.quantity} - ${item.lineTotal}.`,
        )
      : [`1. ${e.bag} Aun no agregue productos, pero quiero mas informacion de compra.`];

  const modeLabel =
    input.deliveryMode === "delivery"
      ? `${e.truck} Delivery.`
      : `${e.store} Recojo en tienda.`;

  return [
    `${e.wave} *Hola equipo FastPage!*`,
    `${e.bag} *Quiero finalizar una compra desde la demo de Online Store.*`,
    "",
    `${e.tag} *Tienda:* ${input.title}.`,
    `${e.box} *Modalidad:* ${modeLabel}`,
    "",
    `${e.receipt} *Detalle del pedido:*`,
    ...detailLines,
    "",
    `${e.money} *Total estimado:* ${input.total}.`,
    `${e.thanks} Quedo atento(a) a la confirmacion. Gracias por la ayuda ${e.sparkles}`,
  ];
}

export function buildServicesDemoMessage(input: {
  title: string;
}): string[] {
  const e = {
    wave: "👋",
    puzzle: "🧩",
    building: "🏢",
    target: "🎯",
    thanks: "🙏",
    sparkles: "✨",
  };

  return [
    `${e.wave} *Hola equipo FastPage!*`,
    `${e.puzzle} *Me interesa esta demo de servicios y quiero crear mi version.*`,
    "",
    `${e.building} *Demo seleccionada:* ${input.title}.`,
    `${e.target} *Objetivo:* captar mas clientes y cerrar oportunidades por WhatsApp.`,
    "",
    `${e.thanks} Podrian orientarme con el siguiente paso, por favor? Muchas gracias ${e.sparkles}`,
  ];
}

export const OFFICIAL_DEMO_WHATSAPP = "51919662011";

function normalizePhone(value: string): string {
  const digits = String(value || "").replace(/\D/g, "");
  return digits || OFFICIAL_DEMO_WHATSAPP;
}

export function buildOfficialDemoWhatsappUrl(lines: string[], targetPhone?: string): string {
  const normalized = normalizePhone(targetPhone || OFFICIAL_DEMO_WHATSAPP);
  const text = encodeURIComponent(lines.join("\n"));
  return `https://wa.me/${normalized}?text=${text}`;
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
    wave: "\u{1F44B}",
    plate: "\u{1F37D}\u{FE0F}",
    store: "\u{1F3EA}",
    pin: "\u{1F4CD}",
    receipt: "\u{1F9FE}",
    money: "\u{1F4B0}",
    thanks: "\u{1F64F}",
    sparkles: "\u{2728}",
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
    wave: "\u{1F44B}",
    bag: "\u{1F6CD}\u{FE0F}",
    tag: "\u{1F3F7}\u{FE0F}",
    box: "\u{1F4E6}",
    truck: "\u{1F69A}",
    store: "\u{1F3EC}",
    receipt: "\u{1F9FE}",
    money: "\u{1F4B0}",
    thanks: "\u{1F64F}",
    sparkles: "\u{2728}",
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
    wave: "\u{1F44B}",
    puzzle: "\u{1F9E9}",
    building: "\u{1F3E2}",
    target: "\u{1F3AF}",
    thanks: "\u{1F64F}",
    sparkles: "\u{2728}",
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

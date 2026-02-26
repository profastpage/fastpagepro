export const OFFICIAL_DEMO_WHATSAPP = "51919662011";

function normalizePhone(value: string): string {
  const digits = String(value || "").replace(/\D/g, "");
  return digits || OFFICIAL_DEMO_WHATSAPP;
}

export function buildOfficialDemoWhatsappUrl(lines: string[]): string {
  const normalized = normalizePhone(OFFICIAL_DEMO_WHATSAPP);
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
  const detailLines =
    input.items.length > 0
      ? input.items.map(
          (item, index) =>
            `${index + 1}. 🍽️ ${item.name} x${item.quantity} — ${item.lineTotal}.`,
        )
      : ["1. 🍽️ Aún no agregué productos, pero deseo asesoría para mi pedido."];

  return [
    "👋 *¡Hola equipo FastPage!*",
    "🍴 *Quiero realizar un pedido desde la demo de Carta Digital.*",
    "",
    `🏪 *Negocio:* ${input.title}.`,
    `📍 *Dirección referencial:* ${input.address}.`,
    "",
    "🧾 *Detalle del pedido:*",
    ...detailLines,
    "",
    `💰 *Total estimado:* ${input.total}.`,
    "🙏 Quedo atento(a) a su confirmación. ¡Muchas gracias! ✨",
  ];
}

export function buildEcommerceDemoMessage(input: {
  title: string;
  deliveryMode: "delivery" | "retiro";
  items: EcommerceItem[];
  total: string;
}): string[] {
  const detailLines =
    input.items.length > 0
      ? input.items.map(
          (item, index) =>
            `${index + 1}. 🛍️ ${item.name} x${item.quantity} — ${item.lineTotal}.`,
        )
      : ["1. 🛍️ Aún no agregué productos, pero quiero más información de compra."];

  const modeLabel =
    input.deliveryMode === "delivery" ? "🚚 Delivery." : "🏬 Recojo en tienda.";

  return [
    "👋 *¡Hola equipo FastPage!*",
    "🛒 *Quiero finalizar una compra desde la demo de Online Store.*",
    "",
    `🏷️ *Tienda:* ${input.title}.`,
    `📦 *Modalidad:* ${modeLabel}`,
    "",
    "🧾 *Detalle del pedido:*",
    ...detailLines,
    "",
    `💰 *Total estimado:* ${input.total}.`,
    "🙏 Quedo atento(a) a la confirmación. ¡Gracias por la ayuda! ✨",
  ];
}

export function buildServicesDemoMessage(input: {
  title: string;
}): string[] {
  return [
    "👋 *¡Hola equipo FastPage!*",
    "🧩 *Me interesa esta demo de servicios y quiero crear mi versión.*",
    "",
    `🏢 *Demo seleccionada:* ${input.title}.`,
    "🎯 *Objetivo:* captar más clientes y cerrar oportunidades por WhatsApp.",
    "",
    "🙏 ¿Podrían orientarme con el siguiente paso, por favor? ¡Muchas gracias! ✨",
  ];
}


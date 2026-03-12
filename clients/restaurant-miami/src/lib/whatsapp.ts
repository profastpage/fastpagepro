export function normalizeWhatsappDigits(raw: string): string {
  return String(raw || "").replace(/\D/g, "");
}

export function buildWhatsappSendUrl(rawPhone: string, text?: string): string {
  const digits = normalizeWhatsappDigits(rawPhone);
  if (!digits) return "";

  const params = new URLSearchParams({ phone: digits });
  const normalizedText = String(text || "").trim();
  if (normalizedText) {
    params.set("text", normalizedText);
  }
  return `https://api.whatsapp.com/send?${params.toString()}`;
}

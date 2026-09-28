/**
 * Builds a WhatsApp click-to-chat link, pre-filling a message when one is given.
 * `phoneNumber` may contain "+", spaces, or dashes; only digits are kept.
 */
export function buildWhatsAppUrl(phoneNumber: string, message?: string): string {
  const digits = phoneNumber.replace(/\D/g, "");
  const chatUrl = `https://wa.me/${digits}`;
  return message ? `${chatUrl}?text=${encodeURIComponent(message)}` : chatUrl;
}

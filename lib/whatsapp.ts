/**
 * Builds a WhatsApp click-to-chat link with a pre-filled message.
 * `phoneNumber` may contain "+", spaces, or dashes; only digits are kept.
 */
export function buildWhatsAppUrl(phoneNumber: string, message: string): string {
  const digits = phoneNumber.replace(/\D/g, "");
  return `https://wa.me/${digits}?text=${encodeURIComponent(message)}`;
}

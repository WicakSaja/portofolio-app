export function formatWhatsAppUrl(phone: string): string {
  if (!phone) return "#";
  const trimmed = phone.trim();
  if (trimmed.startsWith("http://") || trimmed.startsWith("https://")) {
    return trimmed;
  }
  let cleanNumber = trimmed.replace(/\D/g, "");
  if (cleanNumber.startsWith("0")) {
    cleanNumber = "62" + cleanNumber.slice(1);
  }
  return `https://wa.me/${cleanNumber}`;
}

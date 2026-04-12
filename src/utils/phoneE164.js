/**
 * Normalize Indian mobile input to E.164 (+91XXXXXXXXXX) for OTP SMS API.
 */
export function toIndiaE164(phone) {
  const s = String(phone ?? "").replace(/\s/g, "");
  if (!s) return "";
  if (s.startsWith("+")) {
    const digits = s.replace(/\D/g, "");
    if (digits.length >= 10) return `+${digits}`;
    return s;
  }
  let digits = s.replace(/\D/g, "");
  if (digits.startsWith("91") && digits.length === 12) {
    digits = digits.slice(2);
  }
  if (digits.length === 10) {
    return `+91${digits}`;
  }
  if (digits.length > 10) {
    return `+91${digits.slice(-10)}`;
  }
  return "";
}

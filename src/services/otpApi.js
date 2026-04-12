import axios from "axios";

const rawBase =
  (process.env.REACT_APP_OTP_BASE_URL || "http://localhost:8081").replace(
    /\/$/,
    ""
  );

export const otpApiClient = axios.create({
  baseURL: rawBase,
  headers: { "Content-Type": "application/json" },
  timeout: 30000,
});

export function parseOtpAxiosError(err) {
  const status = err?.response?.status;
  const data = err?.response?.data;
  const msg =
    typeof data === "string"
      ? data
      : data?.message || data?.error || data?.detail;
  if (status === 503) {
    return (
      msg ||
      "Verification service is temporarily unavailable. Please try again later."
    );
  }
  if (status === 400) {
    return msg || "Invalid request. Check your details and try again.";
  }
  return msg || err?.message || "Something went wrong.";
}

export function pickOtpCodeLength(data) {
  const d = data && typeof data === "object" ? data : {};
  const raw =
    d.codeLength ??
    d["code-length"] ??
    d.otp?.codeLength ??
    d.otp?.["code-length"];
  const n = Number(raw);
  if (Number.isFinite(n) && n > 0 && n <= 12) return n;
  return 6;
}

export function pickExpiresInSeconds(data) {
  const d = data && typeof data === "object" ? data : {};
  const n = Number(
    d.expiresInSeconds ?? d.expires_in_seconds ?? d.expiresIn ?? 300
  );
  if (Number.isFinite(n) && n > 0) return n;
  return 300;
}

export const sendEmailOtp = (email) =>
  otpApiClient.post("/api/otp/email/send", { email });

export const verifyEmailOtp = (email, code) =>
  otpApiClient.post("/api/otp/email/verify", { email, code });

export const sendSmsOtp = (phone) =>
  otpApiClient.post("/api/otp/sms/send", { phone });

export const verifySmsOtp = (phone, code) =>
  otpApiClient.post("/api/otp/sms/verify", { phone, code });

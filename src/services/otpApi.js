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

/**
 * Public contact form: request an email OTP before the message is accepted.
 * POST `/api/otp/email/contact`
 *
 * Expected JSON body (application/json):
 *
 * | Field           | Type   | Required | Description |
 * |----------------|--------|----------|-------------|
 * | `email`        | string | yes      | Inbox that receives the OTP; must match the contact form email. |
 * | `name`         | string | yes      | Sender full name. |
 * | `phone`        | string | no       | Optional; empty string omitted by caller if unused. |
 * | `subject`      | string | yes      | Subject category key, e.g. `general`, `booking`, `vendor`, `technical`, `feedback`. |
 * | `subjectLabel` | string | yes      | Human-readable label for the same category (logging / email template). |
 * | `message`      | string | yes      | Full message body; server may truncate or store for post-verify submit. |
 *
 * Example:
 * ```json
 * {
 *   "email": "user@example.com",
 *   "name": "Jane Doe",
 *   "phone": "9876543210",
 *   "subject": "booking",
 *   "subjectLabel": "Booking Support",
 *   "message": "I need help changing my event date."
 * }
 * ```
 *
 * Verification after delivery: reuse {@link verifyEmailOtp} with the same `email` and the code:
 * `POST /api/otp/email/verify` body `{ email, code }`.
 *
 * @param {ContactEmailOtpPayload} payload
 * @returns {Promise<import('axios').AxiosResponse>}
 */
export const sendContactEmailOtp = (payload) =>
  otpApiClient.post("/api/otp/email/contact", payload);

/** @typedef {Object} ContactEmailOtpPayload
 * @property {string} email
 * @property {string} name
 * @property {string} [phone]
 * @property {string} subject
 * @property {string} subjectLabel
 * @property {string} message
 */

export const sendSmsOtp = (phone) =>
  otpApiClient.post("/api/otp/sms/send", { phone });

export const verifySmsOtp = (phone, code) =>
  otpApiClient.post("/api/otp/sms/verify", { phone, code });

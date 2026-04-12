import React, { useState, useEffect, useRef, useCallback } from "react";
import { Modal, Button, Form, Spinner, Alert } from "react-bootstrap";
import {
  sendEmailOtp,
  sendSmsOtp,
  verifyEmailOtp,
  verifySmsOtp,
  parseOtpAxiosError,
  pickOtpCodeLength,
  pickExpiresInSeconds,
} from "../services/otpApi";

const RESEND_COOLDOWN_MS = 2 * 60 * 1000;
const MAX_RESENDS = 3;

/**
 * OTP verification step inside a Bootstrap modal.
 * @param {boolean} show
 * @param {() => void} onHide
 * @param {'email'|'sms'} channel
 * @param {string} value — email address, or E.164 phone (use toIndiaE164 for SMS)
 * @param {() => void} onVerified
 * @param {string} [title]
 */
export default function OtpVerificationModal({
  show,
  onHide,
  channel,
  value,
  onVerified,
  title,
}) {
  const [otpLength, setOtpLength] = useState(6);
  const [digits, setDigits] = useState(() => Array(6).fill(""));
  const [loading, setLoading] = useState(false);
  const [verifying, setVerifying] = useState(false);
  const [error, setError] = useState(null);
  const [resendUsed, setResendUsed] = useState(0);
  const [resendAvailableAt, setResendAvailableAt] = useState(0);
  const [codeExpiresAt, setCodeExpiresAt] = useState(0);
  const [, setTick] = useState(0);
  const inputRefs = useRef([]);

  useEffect(() => {
    if (!show) return undefined;
    const id = setInterval(() => setTick((t) => t + 1), 1000);
    return () => clearInterval(id);
  }, [show]);

  const setDigitAt = (index, ch) => {
    const raw = String(ch ?? "");
    const c =
      raw === ""
        ? ""
        : raw.replace(/\D/g, "").slice(-1) || "";
    setDigits((prev) => {
      const next = [...prev];
      while (next.length < otpLength) next.push("");
      next[index] = c;
      return next.slice(0, otpLength);
    });
    if (c && index < otpLength - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const performSend = useCallback(
    async (isManualResend) => {
      const v = String(value || "").trim();
      if (!v) {
        setError("Missing email or phone for verification.");
        return;
      }
      setLoading(true);
      setError(null);
      try {
        const res =
          channel === "email"
            ? await sendEmailOtp(v)
            : await sendSmsOtp(v);
        const data = res?.data;
        const len = pickOtpCodeLength(data);
        setOtpLength(len);
        setDigits(Array(len).fill(""));
        const expSec = pickExpiresInSeconds(data);
        setCodeExpiresAt(Date.now() + expSec * 1000);
        setResendAvailableAt(Date.now() + RESEND_COOLDOWN_MS);
        if (isManualResend) {
          setResendUsed((u) => Math.min(MAX_RESENDS, u + 1));
        }
      } catch (err) {
        setError(parseOtpAxiosError(err));
      } finally {
        setLoading(false);
      }
    },
    [channel, value]
  );

  useEffect(() => {
    if (!show || !String(value || "").trim()) {
      return undefined;
    }
    setResendUsed(0);
    setError(null);
    setOtpLength(6);
    setDigits(Array(6).fill(""));
    let cancelled = false;
    (async () => {
      setLoading(true);
      try {
        const v = String(value).trim();
        const res =
          channel === "email" ? await sendEmailOtp(v) : await sendSmsOtp(v);
        if (cancelled) return;
        const data = res?.data;
        const len = pickOtpCodeLength(data);
        setOtpLength(len);
        setDigits(Array(len).fill(""));
        setCodeExpiresAt(Date.now() + pickExpiresInSeconds(data) * 1000);
        setResendAvailableAt(Date.now() + RESEND_COOLDOWN_MS);
      } catch (err) {
        if (!cancelled) setError(parseOtpAxiosError(err));
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [show, channel, value]);

  useEffect(() => {
    if (show && !loading && digits.length === otpLength) {
      inputRefs.current[0]?.focus();
    }
  }, [show, loading, otpLength, digits.length]);

  const handleKeyDown = (index, e) => {
    if (e.key === "Backspace") {
      if (digits[index]) {
        e.preventDefault();
        setDigitAt(index, "");
      } else if (index > 0) {
        inputRefs.current[index - 1]?.focus();
      }
    }
  };

  const handlePaste = (e) => {
    const text = e.clipboardData.getData("text").replace(/\D/g, "");
    if (!text) return;
    e.preventDefault();
    const chars = text.slice(0, otpLength).split("");
    setDigits((prev) => {
      const next = [...prev];
      for (let i = 0; i < otpLength; i += 1) {
        next[i] = chars[i] || "";
      }
      return next;
    });
    const focusIdx = Math.min(chars.length, otpLength - 1);
    inputRefs.current[focusIdx]?.focus();
  };

  const handleVerify = async () => {
    const code = digits.join("");
    if (code.length !== otpLength || !/^\d+$/.test(code)) {
      setError(`Enter the ${otpLength}-digit code.`);
      return;
    }
    const v = String(value || "").trim();
    setVerifying(true);
    setError(null);
    try {
      if (channel === "email") {
        await verifyEmailOtp(v, code);
      } else {
        await verifySmsOtp(v, code);
      }
      onVerified?.();
    } catch (err) {
      setError(parseOtpAxiosError(err));
    } finally {
      setVerifying(false);
    }
  };

  const resendCooldownLeft = Math.max(
    0,
    Math.ceil((resendAvailableAt - Date.now()) / 1000)
  );
  const codeExpiryLeft = Math.max(
    0,
    Math.ceil((codeExpiresAt - Date.now()) / 1000)
  );
  const canResend =
    resendUsed < MAX_RESENDS && resendCooldownLeft === 0 && !loading;
  const resendsRemaining = MAX_RESENDS - resendUsed;

  const heading =
    title ||
    (channel === "email"
      ? "Verify your email"
      : "Verify your phone number");

  const displayValue = String(value || "").trim();

  return (
    <Modal show={show} onHide={onHide} centered backdrop="static">
      <Modal.Header closeButton>
        <Modal.Title>{heading}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <p className="text-muted small mb-3">
          We sent a {otpLength}-digit code to{" "}
          <strong>{displayValue}</strong>
        </p>

        {error && (
          <Alert variant="danger" className="py-2" dismissible onClose={() => setError(null)}>
            {error}
          </Alert>
        )}

        {loading ? (
          <div className="text-center py-4">
            <Spinner animation="border" className="me-2" />
            Sending code…
          </div>
        ) : (
          <>
            <div
              className="d-flex gap-2 justify-content-center mb-3 flex-wrap"
              onPaste={handlePaste}
            >
              {Array.from({ length: otpLength }, (_, i) => (
                <Form.Control
                  key={i}
                  ref={(el) => {
                    inputRefs.current[i] = el;
                  }}
                  type="text"
                  inputMode="numeric"
                  autoComplete="one-time-code"
                  value={digits[i] || ""}
                  maxLength={1}
                  className="text-center fs-4"
                  style={{ width: "3rem", height: "3rem" }}
                  onChange={(e) => setDigitAt(i, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(i, e)}
                  disabled={verifying}
                />
              ))}
            </div>

            <div className="small text-muted mb-3 text-center">
              Code expires in{" "}
              <strong>
                {Math.floor(codeExpiryLeft / 60)}:
                {String(codeExpiryLeft % 60).padStart(2, "0")}
              </strong>
            </div>

            <div className="d-flex flex-column gap-2">
              <Button
                variant="primary"
                onClick={handleVerify}
                disabled={verifying || digits.join("").length !== otpLength}
              >
                {verifying ? (
                  <>
                    <Spinner size="sm" className="me-2" /> Verifying…
                  </>
                ) : (
                  "Verify"
                )}
              </Button>
              <Button
                variant="outline-secondary"
                size="sm"
                disabled={!canResend || verifying}
                onClick={() => performSend(true)}
              >
                {resendCooldownLeft > 0
                  ? `Resend in ${Math.floor(resendCooldownLeft / 60)}:${String(
                      resendCooldownLeft % 60
                    ).padStart(2, "0")}`
                  : resendUsed >= MAX_RESENDS
                  ? "Resend limit reached"
                  : `Resend code (${resendsRemaining} left)`}
              </Button>
            </div>
          </>
        )}
      </Modal.Body>
    </Modal>
  );
}

import React, { useState, useEffect, useCallback, useMemo } from "react";
import {
  Container,
  Row,
  Col,
  Card,
  Form,
  Button,
  Tab,
  Tabs,
  Alert,
  Spinner,
  InputGroup,
} from "react-bootstrap";
import { motion } from "framer-motion";
import { FaUser, FaStore, FaEnvelope, FaLock, FaPhone } from "react-icons/fa";
import { useNavigate, useSearchParams } from "react-router-dom";
import { UserLogin, UserRegister, getPublicVendorInvite } from "../services/api";
import OtpVerificationModal from "../components/OtpVerificationModal";
import { toIndiaE164 } from "../utils/phoneE164";
import {
  VENDOR_INVITE_TOKEN_KEY,
  VENDOR_INVITE_DATA_KEY,
  PENDING_VENDOR_SIGNUP_EMAIL_KEY,
} from "../constants/vendorInviteStorage";
import { validateLogin, validateSignup } from "../utils/formValidation";

function splitNameHint(displayName) {
  if (!displayName || !String(displayName).trim()) {
    return { first: "", last: "" };
  }
  const parts = String(displayName).trim().split(/\s+/);
  if (parts.length === 1) return { first: parts[0], last: "" };
  return { first: parts[0], last: parts.slice(1).join(" ") };
}

const Auth = () => {
  const [activeTab, setActiveTab] = useState("login");
  const [_userType, set_userType] = useState("client");
  const [searchParams] = useSearchParams();
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const [inviteLoading, setInviteLoading] = useState(false);
  const [invitePayload, setInvitePayload] = useState(null);
  const [inviteFetchError, setInviteFetchError] = useState(null);
  const [signupOtpStep, setSignupOtpStep] = useState(null);
  const [signupSubmitting, setSignupSubmitting] = useState(false);

  const vendorInviteParam = searchParams.get("vendorInvite");

  const clearInviteStorage = useCallback(() => {
    sessionStorage.removeItem(VENDOR_INVITE_TOKEN_KEY);
    sessionStorage.removeItem(VENDOR_INVITE_DATA_KEY);
  }, []);

  useEffect(() => {
    const type = searchParams.get("type");
    if (type === "client" || type === "vendor") {
      set_userType(type);
    }
    const tab = searchParams.get("tab");
    if (tab === "signup" || tab === "login") {
      setActiveTab(tab);
    }
  }, [searchParams]);

  useEffect(() => {
    if (!vendorInviteParam || !vendorInviteParam.trim()) {
      clearInviteStorage();
      setInvitePayload(null);
      setInviteFetchError(null);
      setInviteLoading(false);
      return;
    }

    const token = vendorInviteParam.trim();
    let cancelled = false;
    setInviteLoading(true);
    setInviteFetchError(null);
    setInvitePayload(null);

    sessionStorage.setItem(VENDOR_INVITE_TOKEN_KEY, token);

    (async () => {
      try {
        const res = await getPublicVendorInvite(token);
        const data = res?.data;
        if (cancelled) return;

        setInvitePayload(data);
        sessionStorage.setItem(VENDOR_INVITE_DATA_KEY, JSON.stringify(data));

        const expiredInvalid =
          data?.valid === false && data?.expired === true;
        const consumed = data?.consumed === true;

        if (expiredInvalid || consumed) {
          clearInviteStorage();
        }

        if (data?.valid === true && !consumed) {
          set_userType("vendor");
          setActiveTab("signup");
          const phone =
            data.contactPhone || data.suggestedBusinessPhone || "";
          setSignupData((prev) => ({
            ...prev,
            phone: phone || prev.phone,
            userType: "vendor",
          }));
        }
      } catch (err) {
        if (cancelled) return;
        console.error("Vendor invite lookup failed", err);
        setInviteFetchError(
          err?.response?.data?.message ||
            err?.message ||
            "Could not validate this invite link. Try again or sign up without an invite."
        );
        clearInviteStorage();
        setInvitePayload(null);
      } finally {
        if (!cancelled) setInviteLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [vendorInviteParam, clearInviteStorage]);

  const [loginData, setLoginData] = useState({
    email: "",
    passwordHash: "",
  });

  const [signupData, setSignupData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    passwordHash: "",
    confirmPassword: "",
    phone: "",
    userType: "",
  });

  const loginValidation = useMemo(
    () =>
      validateLogin({
        email: loginData.email,
        passwordHash: loginData.passwordHash,
      }),
    [loginData.email, loginData.passwordHash]
  );

  const signupValidation = useMemo(
    () => validateSignup(signupData),
    [signupData]
  );

  const loginErrors = loginValidation.errors;
  const signupErrors = signupValidation.errors;

  const inviteExpired =
    invitePayload && invitePayload.valid === false && invitePayload.expired === true;
  const inviteConsumed = invitePayload && invitePayload.consumed === true;
  const inviteValid = invitePayload && invitePayload.valid === true && !inviteConsumed;

  const namePlaceholders = inviteValid
    ? {
        first:
          splitNameHint(invitePayload.vendorDisplayName).first ||
          splitNameHint(invitePayload.suggestedBusinessName).first ||
          "First name",
        last:
          splitNameHint(invitePayload.vendorDisplayName).last ||
          splitNameHint(invitePayload.suggestedBusinessName).last ||
          "Last name",
      }
    : { first: "Enter your first name", last: "Enter your last name" };

  const signupInviteBlocked =
    !!vendorInviteParam &&
    (inviteLoading ||
      inviteExpired ||
      inviteConsumed ||
      (inviteFetchError && !invitePayload));

  const handleLogin = async (e) => {
    e.preventDefault();
    setError(null);
    if (!loginValidation.valid) return;
    try {
      const response = await UserLogin(loginData);

      const loginType = (response?.data?.userType || "").toString().toLowerCase();
      if (response.status === 200 && loginType === "client") {
        sessionStorage.setItem("userId", response?.data?.userId);
        navigate("/user-dashboard");
      } else if (response.status === 200 && loginType === "vendor") {
        sessionStorage.setItem("userId", response?.data?.userId);
        sessionStorage.setItem("vendorId", response?.data?.vendorId);
        if (response.data.vendorId === -1) {
          navigate("/vendor-onboarding");
          return;
        }
        navigate("/vendor-dashboard");
      }
    } catch (error) {
      console.log(error);
      if (error.response && error.response.status === 401) {
        setError("Invalid email or password. Please try again.");
      }
    }
  };

  const handlePass = () => {
    if (_userType === "client") {
      setLoginData({
        email: "e@e.c",
        passwordHash: "r",
      });
    } else {
      setLoginData({
        email: "coastalfeast@gmail.com",
        passwordHash: "vendor123",
      });
    }
  };

  const buildSignupBody = () => {
    const userTypeEnum = _userType === "vendor" ? "VENDOR" : "CLIENT";
    return {
      email: signupData.email,
      firstName: signupData.firstName,
      lastName: signupData.lastName,
      phone: signupData.phone,
      passwordHash: signupData.passwordHash,
      userType: userTypeEnum,
    };
  };

  const runSignupAfterOtp = async () => {
    setSignupOtpStep(null);
    setSignupSubmitting(true);
    setError(null);
    try {
      const body = buildSignupBody();
      const response = await UserRegister(body);

      const resType = (response?.data?.userType || "").toString().toLowerCase();
      if (response.status === 200 && resType === "client") {
        clearInviteStorage();
        sessionStorage.removeItem(PENDING_VENDOR_SIGNUP_EMAIL_KEY);
        sessionStorage.setItem("userId", response?.data?.id);
        navigate("/user-dashboard");
      } else if (response.status === 200 && resType === "vendor") {
        sessionStorage.setItem("userId", response?.data?.id);
        sessionStorage.setItem(
          PENDING_VENDOR_SIGNUP_EMAIL_KEY,
          signupData.email || ""
        );
        navigate("/vendor-onboarding");
      }
    } catch (error) {
      console.log(error);
      const msg =
        error?.response?.data?.message ||
        error?.response?.data ||
        error?.message ||
        "Sign up failed.";
      setError(typeof msg === "string" ? msg : JSON.stringify(msg));
    } finally {
      setSignupSubmitting(false);
    }
  };

  const startSignupVerification = () => {
    setError(null);
    if (!signupValidation.valid) return;

    if (vendorInviteParam && (inviteExpired || inviteConsumed)) {
      setError(
        inviteExpired
          ? "This invite link has expired. You can still sign up as a vendor without this link."
          : "This link was already used."
      );
      return;
    }

    const e164 = toIndiaE164(signupData.phone);
    if (!e164 || e164.replace(/\D/g, "").length < 12) {
      setError(
        "Enter a valid 10-digit Indian mobile number so we can send an SMS code."
      );
      return;
    }

    setSignupOtpStep("email");
  };

  const containerVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: "easeOut" },
    },
  };

  const showInviteToggle = !vendorInviteParam || (!inviteLoading && !inviteValid);

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
        paddingTop: "100px",
        paddingBottom: "50px",
      }}
    >
      <Container>
        <motion.div
          initial="hidden"
          animate="visible"
          variants={containerVariants}
        >
          <Row className="justify-content-center">
            <Col md={8} lg={6}>
              <Card
                className="shadow-lg border-0"
                style={{ borderRadius: "20px" }}
              >
                <Card.Body className="p-5">
                  <div className="text-center mb-4">
                    <h2 className="fw-bold text-primary mb-2">
                      Welcome to BookMyVendor
                    </h2>
                    <p className="text-muted">
                      {_userType === "client"
                        ? "Find and book amazing vendors"
                        : "Grow your business with us"}
                    </p>
                  </div>

                  {vendorInviteParam && inviteLoading && (
                    <Alert variant="info" className="d-flex align-items-center gap-2">
                      <Spinner animation="border" size="sm" />
                      <span>Checking your invite link…</span>
                    </Alert>
                  )}

                  {inviteFetchError && (
                    <Alert variant="warning">{inviteFetchError}</Alert>
                  )}

                  {inviteExpired && (
                    <Alert variant="danger" role="alert">
                      This invite link has expired.
                    </Alert>
                  )}

                  {inviteConsumed && (
                    <Alert variant="warning" role="alert">
                      This link was already used.
                    </Alert>
                  )}

                  {inviteValid && invitePayload && (
                    <Alert variant="success" role="status">
                      <strong>You&apos;re invited</strong>
                      {invitePayload.eventTitle ? (
                        <>
                          {" "}
                          for event: <strong>{invitePayload.eventTitle}</strong>
                        </>
                      ) : null}
                      {invitePayload.serviceName ? (
                        <div className="small mt-1 text-muted">
                          Service: {invitePayload.serviceName}
                        </div>
                      ) : null}
                    </Alert>
                  )}

                  {/* User Type Selection */}
                  {showInviteToggle && (
                    <div className="mb-4">
                      <div className="d-flex justify-content-center gap-3">
                        <Button
                          variant={
                            _userType === "client" ? "primary" : "outline-primary"
                          }
                          onClick={() => set_userType("client")}
                          className="d-flex align-items-center gap-2 px-4"
                          style={{ borderRadius: "25px" }}
                        >
                          <FaUser />
                          I&apos;m a Client
                        </Button>
                        <Button
                          variant={
                            _userType === "vendor" ? "primary" : "outline-primary"
                          }
                          onClick={() => set_userType("vendor")}
                          className="d-flex align-items-center gap-2 px-4"
                          style={{ borderRadius: "25px" }}
                        >
                          <FaStore />
                          I&apos;m a Vendor
                        </Button>
                      </div>
                    </div>
                  )}

                  {inviteValid && (
                    <p className="text-center small text-muted mb-3">
                      Complete signup as a <strong>vendor</strong> to continue
                      with your invite.
                    </p>
                  )}

                  <Tabs
                    activeKey={activeTab}
                    onSelect={(k) => {
                      setActiveTab(k);
                      setError(null);
                    }}
                    className="mb-4"
                    justify
                  >
                    <Tab eventKey="login" title="Login">
                      <Form onSubmit={handleLogin} noValidate>
                        {error && (
                          <Alert
                            variant="danger"
                            onClose={() => setError(null)}
                            dismissible
                          >
                            {error}
                          </Alert>
                        )}
                        <Form.Group className="mb-3">
                          <Form.Label>Email Address</Form.Label>
                          <InputGroup
                            hasValidation
                            className="auth-input-icon-group rounded-3 shadow-sm"
                          >
                            <InputGroup.Text className="bg-light text-secondary border-end-0">
                              <FaEnvelope aria-hidden />
                            </InputGroup.Text>
                            <Form.Control
                              type="email"
                              placeholder="Enter your email"
                              value={loginData.email}
                              onChange={(e) => {
                                setLoginData({
                                  ...loginData,
                                  email: e.target.value,
                                });
                              }}
                              isInvalid={!!loginErrors.email}
                              className="border-start-0"
                            />
                            <Form.Control.Feedback type="invalid">
                              {loginErrors.email}
                            </Form.Control.Feedback>
                          </InputGroup>
                        </Form.Group>

                        <Form.Group className="mb-4">
                          <Form.Label>Password</Form.Label>
                          <InputGroup
                            hasValidation
                            className="auth-input-icon-group rounded-3 shadow-sm"
                          >
                            <InputGroup.Text className="bg-light text-secondary border-end-0">
                              <FaLock aria-hidden />
                            </InputGroup.Text>
                            <Form.Control
                              type="password"
                              placeholder="Enter your password"
                              value={loginData.passwordHash}
                              onChange={(e) => {
                                setLoginData({
                                  ...loginData,
                                  passwordHash: e.target.value,
                                });
                              }}
                              isInvalid={!!loginErrors.password}
                              className="border-start-0"
                            />
                            <Form.Control.Feedback type="invalid">
                              {loginErrors.password}
                            </Form.Control.Feedback>
                          </InputGroup>
                        </Form.Group>
                        <Button onClick={handlePass} className="w-100 mb-3">
                          Fill
                        </Button>

                        <Button
                          type="submit"
                          variant="primary"
                          size="lg"
                          className="w-100 mb-3"
                          style={{ borderRadius: "10px" }}
                          disabled={!loginValidation.valid}
                        >
                          Login as{" "}
                          {_userType === "client" ? "Client" : "Vendor"}
                        </Button>
                      </Form>
                    </Tab>

                    <Tab eventKey="signup" title="Sign Up">
                      <Form
                        onSubmit={(e) => e.preventDefault()}
                        aria-busy={inviteLoading}
                        noValidate
                      >
                        {error && (
                          <Alert
                            variant="danger"
                            onClose={() => setError(null)}
                            dismissible
                            className="mb-3"
                          >
                            {error}
                          </Alert>
                        )}
                        <Form.Group className="mb-3">
                          <Row>
                            <Col md={6} className="mb-3 mb-md-0">
                              <Form.Label>
                                {_userType === "vendor"
                                  ? "First name"
                                  : "First Name"}
                              </Form.Label>
                              <InputGroup
                                hasValidation
                                className="auth-input-icon-group rounded-3 shadow-sm"
                              >
                                <InputGroup.Text className="bg-light text-secondary border-end-0">
                                  <FaUser aria-hidden />
                                </InputGroup.Text>
                                <Form.Control
                                  type="text"
                                  placeholder={namePlaceholders.first}
                                  value={signupData.firstName}
                                  onChange={(e) => {
                                    setSignupData({
                                      ...signupData,
                                      firstName: e.target.value,
                                    });
                                  }}
                                  isInvalid={!!signupErrors.firstName}
                                  className="border-start-0"
                                  disabled={
                                    !!vendorInviteParam &&
                                    (inviteLoading ||
                                      inviteExpired ||
                                      inviteConsumed)
                                  }
                                />
                                <Form.Control.Feedback type="invalid">
                                  {signupErrors.firstName}
                                </Form.Control.Feedback>
                              </InputGroup>
                            </Col>
                            <Col md={6}>
                              <Form.Label>
                                {_userType === "vendor"
                                  ? "Last name"
                                  : "Last Name"}
                              </Form.Label>
                              <InputGroup
                                hasValidation
                                className="auth-input-icon-group rounded-3 shadow-sm"
                              >
                                <InputGroup.Text className="bg-light text-secondary border-end-0">
                                  <FaUser aria-hidden />
                                </InputGroup.Text>
                                <Form.Control
                                  type="text"
                                  placeholder={namePlaceholders.last}
                                  value={signupData.lastName}
                                  onChange={(e) => {
                                    setSignupData({
                                      ...signupData,
                                      lastName: e.target.value,
                                    });
                                  }}
                                  isInvalid={!!signupErrors.lastName}
                                  className="border-start-0"
                                  disabled={
                                    !!vendorInviteParam &&
                                    (inviteLoading ||
                                      inviteExpired ||
                                      inviteConsumed)
                                  }
                                />
                                <Form.Control.Feedback type="invalid">
                                  {signupErrors.lastName}
                                </Form.Control.Feedback>
                              </InputGroup>
                            </Col>
                          </Row>
                        </Form.Group>

                        <Form.Group className="mb-3">
                          <Form.Label>Email Address</Form.Label>
                          <InputGroup
                            hasValidation
                            className="auth-input-icon-group rounded-3 shadow-sm"
                          >
                            <InputGroup.Text className="bg-light text-secondary border-end-0">
                              <FaEnvelope aria-hidden />
                            </InputGroup.Text>
                            <Form.Control
                              type="email"
                              placeholder="Enter your email"
                              value={signupData.email}
                              onChange={(e) => {
                                setSignupData({
                                  ...signupData,
                                  email: e.target.value,
                                });
                              }}
                              isInvalid={!!signupErrors.email}
                              className="border-start-0"
                              disabled={
                                !!vendorInviteParam &&
                                (inviteLoading ||
                                  inviteExpired ||
                                  inviteConsumed)
                              }
                              autoComplete="email"
                            />
                            <Form.Control.Feedback type="invalid">
                              {signupErrors.email}
                            </Form.Control.Feedback>
                          </InputGroup>
                        </Form.Group>

                        <Form.Group className="mb-3">
                          <Form.Label>Phone Number</Form.Label>
                          <InputGroup
                            hasValidation
                            className="auth-input-icon-group rounded-3 shadow-sm"
                          >
                            <InputGroup.Text className="bg-light text-secondary border-end-0">
                              <FaPhone aria-hidden />
                            </InputGroup.Text>
                            <Form.Control
                              type="tel"
                              placeholder={
                                inviteValid
                                  ? "From your invite (you can edit if needed)"
                                  : "Enter your phone number"
                              }
                              value={signupData.phone}
                              onChange={(e) => {
                                setSignupData({
                                  ...signupData,
                                  phone: e.target.value,
                                });
                              }}
                              isInvalid={!!signupErrors.phone}
                              className="border-start-0"
                              disabled={
                                !!vendorInviteParam &&
                                (inviteLoading ||
                                  inviteExpired ||
                                  inviteConsumed)
                              }
                              autoComplete="tel"
                            />
                            <Form.Control.Feedback type="invalid">
                              {signupErrors.phone}
                            </Form.Control.Feedback>
                          </InputGroup>
                        </Form.Group>

                        <Form.Group className="mb-3">
                          <Form.Label>Password</Form.Label>
                          <InputGroup
                            hasValidation
                            className="auth-input-icon-group rounded-3 shadow-sm"
                          >
                            <InputGroup.Text className="bg-light text-secondary border-end-0">
                              <FaLock aria-hidden />
                            </InputGroup.Text>
                            <Form.Control
                              type="password"
                              placeholder="Create a password"
                              value={signupData.passwordHash}
                              onChange={(e) => {
                                setSignupData({
                                  ...signupData,
                                  passwordHash: e.target.value,
                                });
                              }}
                              isInvalid={!!signupErrors.passwordHash}
                              className="border-start-0"
                              disabled={
                                !!vendorInviteParam &&
                                (inviteLoading ||
                                  inviteExpired ||
                                  inviteConsumed)
                              }
                              autoComplete="new-password"
                            />
                            <Form.Control.Feedback type="invalid">
                              {signupErrors.passwordHash}
                            </Form.Control.Feedback>
                          </InputGroup>
                        </Form.Group>

                        <Form.Group className="mb-4">
                          <Form.Label>Confirm Password</Form.Label>
                          <InputGroup
                            hasValidation
                            className="auth-input-icon-group rounded-3 shadow-sm"
                          >
                            <InputGroup.Text className="bg-light text-secondary border-end-0">
                              <FaLock aria-hidden />
                            </InputGroup.Text>
                            <Form.Control
                              type="password"
                              placeholder="Confirm your password"
                              value={signupData.confirmPassword}
                              onChange={(e) => {
                                setSignupData({
                                  ...signupData,
                                  confirmPassword: e.target.value,
                                });
                              }}
                              isInvalid={!!signupErrors.confirmPassword}
                              className="border-start-0"
                              disabled={
                                !!vendorInviteParam &&
                                (inviteLoading ||
                                  inviteExpired ||
                                  inviteConsumed)
                              }
                              autoComplete="new-password"
                            />
                            <Form.Control.Feedback type="invalid">
                              {signupErrors.confirmPassword}
                            </Form.Control.Feedback>
                          </InputGroup>
                        </Form.Group>

                        <Button
                          type="button"
                          variant="primary"
                          size="lg"
                          className="w-100 mb-3"
                          style={{ borderRadius: "10px" }}
                          disabled={
                            signupInviteBlocked ||
                            !signupValidation.valid ||
                            signupSubmitting
                          }
                          onClick={startSignupVerification}
                        >
                          {signupSubmitting ? (
                            <>
                              <Spinner size="sm" className="me-2" />
                              Creating account…
                            </>
                          ) : (
                            <>
                              Verify email &amp; phone, then sign up as{" "}
                              {_userType === "client" ? "Client" : "Vendor"}
                            </>
                          )}
                        </Button>
                      </Form>
                    </Tab>
                  </Tabs>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </motion.div>
      </Container>

      {signupOtpStep === "email" && (
        <OtpVerificationModal
          key={`signup-email-${signupData.email}`}
          show
          channel="email"
          value={signupData.email.trim()}
          onHide={() => setSignupOtpStep(null)}
          onVerified={() => setSignupOtpStep("sms")}
          title="Verify email for sign-up"
        />
      )}
      {signupOtpStep === "sms" && (
        <OtpVerificationModal
          key={`signup-sms-${signupData.phone}`}
          show
          channel="sms"
          value={toIndiaE164(signupData.phone)}
          onHide={() => setSignupOtpStep(null)}
          onVerified={() => {
            void runSignupAfterOtp();
          }}
          title="Verify phone for sign-up"
        />
      )}
    </div>
  );
};

export default Auth;

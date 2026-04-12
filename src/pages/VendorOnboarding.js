import React, { useEffect, useMemo, useState } from "react";
import {
  Container,
  Row,
  Col,
  Card,
  Form,
  Button,
  Alert,
  Spinner,
} from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { VendorOnBoarding, fetchAllServicesAvailable } from "../services/api"; // added fetchAllServicesAvailable
import {
  VENDOR_INVITE_TOKEN_KEY,
  VENDOR_INVITE_DATA_KEY,
  PENDING_VENDOR_SIGNUP_EMAIL_KEY,
} from "../constants/vendorInviteStorage";
import { validateVendorOnboardingForm } from "../utils/formValidation";

const VendorOnboarding = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    businessName: "",
    businessDescription: "",
    businessAddress: "",
    city: "",
    state: "",
    country: "India",
    pincode: "",
    businessPhone: "",
    businessEmail: "",
    businessLogoUrl: "",
    yearsOfExperience: "",
    isFeatured: false,
    isApproved: false,
    rating: 0.0,
    totalReviews: 0,
    extra: "",
    servicesProvided: [],
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // services loaded from backend
  const [services, setServices] = useState([]);
  const [servicesLoading, setServicesLoading] = useState(true);
  const [servicesError, setServicesError] = useState(null);
  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);
  const [selectedState, setSelectedState] = useState("");
  const [selectedCity, setSelectedCity] = useState("");
  const [location, setLocation] = useState("");
  const [inviteInfo, setInviteInfo] = useState(null);
  const [vendorInviteToken, setVendorInviteToken] = useState(null);
  const [invitedServiceId, setInvitedServiceId] = useState(null);

  useEffect(() => {
    const token = sessionStorage.getItem(VENDOR_INVITE_TOKEN_KEY);
    const raw = sessionStorage.getItem(VENDOR_INVITE_DATA_KEY);
    setVendorInviteToken(token || null);
    if (token && raw) {
      try {
        const data = JSON.parse(raw);
        setInviteInfo(data);
        if (data.serviceId != null && data.serviceId !== "") {
          setInvitedServiceId(String(data.serviceId));
        }
        setForm((prev) => ({
          ...prev,
          businessName:
            data.suggestedBusinessName ||
            data.vendorDisplayName ||
            prev.businessName,
          businessDescription: data.serviceName
            ? `Offers ${data.serviceName} (from your invite).`
            : prev.businessDescription,
          businessAddress:
            data.suggestedBusinessAddress ||
            data.venueAddress ||
            prev.businessAddress,
          businessPhone:
            data.suggestedBusinessPhone ||
            data.contactPhone ||
            prev.businessPhone,
          businessEmail:
            sessionStorage.getItem(PENDING_VENDOR_SIGNUP_EMAIL_KEY) ||
            prev.businessEmail,
        }));
      } catch (e) {
        console.warn("Could not parse vendor invite data", e);
      }
    }
  }, []);

  useEffect(() => {
    let mounted = true;
    setServicesLoading(true);
    fetchAllServicesAvailable()
      .then((resp) => {
        const list = resp?.data ?? resp ?? [];
        if (!mounted) return;
        setServices(list);
        setServicesLoading(false);
      })
      .catch((err) => {
        console.error("Failed to load services", err);
        if (!mounted) return;
        setServicesError("Failed to load service types");
        setServicesLoading(false);
      });
      const fetchStates = async () => {
        try {
          const res = await fetch(
            "https://countriesnow.space/api/v0.1/countries/states",
            {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ country: "India" }),
            }
          );
          const data = await res.json();
          setStates(data.data.states.map((s) => s.name));
        } catch (err) {
          console.error("Failed to fetch states", err);
        }
      };
  
      fetchStates();
    return () => {
      mounted = false;
    };

  }, []);

  const fetchCities = async (state) => {
    try {
      const res = await fetch(
        "https://countriesnow.space/api/v0.1/countries/state/cities",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            country: "India",
            state,
          }),
        }
      );
      const data = await res.json();
      setCities(data.data);
    } catch (err) {
      console.error("Failed to fetch cities", err);
    }
  };

  useEffect(() => {
    if (selectedCity && selectedState) {
      setLocation(`${selectedCity}, ${selectedState}, India`);
    }
  }, [selectedCity, selectedState]);

  const userIdFromStorage = () => {
    const id = sessionStorage.getItem("userId");
    return id ? id : null;
  };

  const onboardingValidation = useMemo(
    () => validateVendorOnboardingForm(form, selectedState, selectedCity),
    [form, selectedState, selectedCity]
  );
  const oe = onboardingValidation.errors;
  const onboardingValid = onboardingValidation.valid;

  const validate = () => {
    const { valid, errors } = validateVendorOnboardingForm(
      form,
      selectedState,
      selectedCity
    );
    if (!valid) {
      const msg = Object.values(errors)[0];
      setError(msg || "Please complete all required fields.");
      return false;
    }
    setError(null);
    return true;
  };

  const toggleServiceSelection = (serviceId) => {
    const sid = String(serviceId);
    if (invitedServiceId && sid === invitedServiceId) {
      return;
    }
    setForm((prev) => {
      const normalized = prev.servicesProvided.map((id) => String(id));
      const exists = normalized.includes(sid);
      const nextArr = exists
        ? prev.servicesProvided.filter((id) => String(id) !== sid)
        : [...prev.servicesProvided, serviceId];
      return { ...prev, servicesProvided: nextArr };
    });
  };

  useEffect(() => {
    if (!invitedServiceId || !services.length) return;
    setForm((prev) => {
      const has = prev.servicesProvided.some(
        (id) => String(id) === String(invitedServiceId)
      );
      if (has) return prev;
      return {
        ...prev,
        servicesProvided: [...prev.servicesProvided, invitedServiceId],
      };
    });
  }, [invitedServiceId, services]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    const userId = userIdFromStorage();
    if (!userId) {
      setError("User not signed in or user id missing. Please login first.");
      return;
    }

    // Build map expected by backend. Backend currently expects string values in map.
    // Note: servicesProvided is sent as JSON string. Backend should parse it (or accept comma list).
    const serviceIds = [
      ...new Set(
        [...form.servicesProvided.map((id) => String(id))].filter(Boolean)
      ),
    ];
    if (invitedServiceId && !serviceIds.includes(String(invitedServiceId))) {
      serviceIds.push(String(invitedServiceId));
    }

    const payload = {
      userId: String(userId),
      businessName: form.businessName,
      businessDescription: form.businessDescription || "",
      businessAddress: form.businessAddress,
      city: selectedCity,
      state: selectedState,
      country: "India",
      pincode: form.pincode,
      businessPhone: form.businessPhone || "",
      businessEmail: form.businessEmail || "",
      businessLogoUrl: form.businessLogoUrl || "",
      yearsOfExperience: form.yearsOfExperience
        ? String(form.yearsOfExperience)
        : "",
      isFeatured: String(form.isFeatured),
      isApproved: String(form.isApproved),
      rating: String(form.rating ?? 0.0),
      totalReviews: String(form.totalReviews ?? 0),
      servicesProvided: JSON.stringify(
        serviceIds.map((id) => {
          const n = Number(id);
          return Number.isNaN(n) ? id : n;
        })
      ),
    };

    if (vendorInviteToken) {
      payload.vendorInviteToken = vendorInviteToken;
    }

    setLoading(true);
    setError(null);

    const hadInvite = Boolean(vendorInviteToken);

    try {
      const resp = await VendorOnBoarding(payload);
      sessionStorage.setItem("userId", resp?.data?.userId);
      sessionStorage.setItem("vendorId", resp?.data?.vendorId);
      sessionStorage.removeItem(VENDOR_INVITE_TOKEN_KEY);
      sessionStorage.removeItem(VENDOR_INVITE_DATA_KEY);
      sessionStorage.removeItem(PENDING_VENDOR_SIGNUP_EMAIL_KEY);
      console.log("Vendor onboarding response:", resp?.data);
      navigate(
        hadInvite ? "/vendor-dashboard?tab=bookings" : "/vendor-dashboard"
      );
    } catch (err) {
      console.error("Failed to create vendor profile", err);
      const msg =
        err?.response?.data?.message ||
        err?.response?.data ||
        err.message ||
        "Failed to create vendor profile";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

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
        <Row className="justify-content-center">
          <Col md={8} lg={6}>
            <Card
              className="shadow-lg border-0"
              style={{ borderRadius: "20px" }}
            >
              <Card.Body className="p-5">
                <div className="text-center mb-4">
                  <h2 className="fw-bold text-primary mb-2">
                    Vendor Onboarding
                  </h2>
                  <p className="text-muted">
                    Tell us about your business to complete setup
                  </p>
                </div>

                {error && (
                  <Alert
                    variant="danger"
                    onClose={() => setError(null)}
                    dismissible
                  >
                    {error}
                  </Alert>
                )}

                {inviteInfo && (
                  <Alert variant="info" className="small">
                    <strong>Invite</strong>
                    {inviteInfo.eventTitle ? (
                      <> — {inviteInfo.eventTitle}</>
                    ) : null}
                    {inviteInfo.venueAddress ? (
                      <div className="text-muted mt-1">{inviteInfo.venueAddress}</div>
                    ) : null}
                    {inviteInfo.serviceName ? (
                      <div className="mt-1">
                        Requested service: <strong>{inviteInfo.serviceName}</strong>{" "}
                        (included in your services below)
                      </div>
                    ) : null}
                  </Alert>
                )}

                <Form onSubmit={handleSubmit} noValidate>
                  <Form.Group className="mb-3">
                    <Form.Label>Company Name</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="Enter your company name"
                      value={form.businessName}
                      onChange={(e) =>
                        setForm({ ...form, businessName: e.target.value })
                      }
                      style={{ borderRadius: "10px" }}
                      isInvalid={!!oe.businessName}
                    />
                    <Form.Control.Feedback type="invalid">
                      {oe.businessName}
                    </Form.Control.Feedback>
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label>Services Provided</Form.Label>

                    {servicesLoading ? (
                      <div className="mb-2">
                        <Spinner
                          animation="border"
                          size="sm"
                          className="me-2"
                        />{" "}
                        Loading services...
                      </div>
                    ) : servicesError ? (
                      <Alert variant="warning">{servicesError}</Alert>
                    ) : (
                      <div
                        style={{
                          maxHeight: 220,
                          overflowY: "auto",
                          padding: 10,
                          border: "1px solid #eee",
                          borderRadius: 8,
                        }}
                      >
                        {services.length === 0 && (
                          <div className="text-muted small">
                            No services available
                          </div>
                        )}
                        {services.map((s) => {
                          const isInvited =
                            invitedServiceId &&
                            String(s.serviceId) === String(invitedServiceId);
                          return (
                            <Form.Check
                              key={s.serviceId}
                              type="checkbox"
                              id={`svc-${s.serviceId}`}
                              label={
                                isInvited ? `${s.name} (from invite)` : s.name
                              }
                              checked={
                                form.servicesProvided.includes(
                                  String(s.serviceId)
                                ) || form.servicesProvided.includes(s.serviceId)
                              }
                              onChange={() => toggleServiceSelection(s.serviceId)}
                              className="mb-1"
                              disabled={!!isInvited}
                            />
                          );
                        })}
                      </div>
                    )}
                    <Form.Text className="text-muted">
                      Select all services you provide.
                    </Form.Text>
                    {oe.servicesProvided && (
                      <div className="invalid-feedback d-block" role="alert">
                        {oe.servicesProvided}
                      </div>
                    )}
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label>Address</Form.Label>
                    <Form.Control
                      as="textarea"
                      rows={2}
                      placeholder="Street address, area, landmark"
                      value={form.businessAddress}
                      onChange={(e) =>
                        setForm({ ...form, businessAddress: e.target.value })
                      }
                      style={{ borderRadius: "10px" }}
                      isInvalid={!!oe.businessAddress}
                    />
                    <Form.Control.Feedback type="invalid">
                      {oe.businessAddress}
                    </Form.Control.Feedback>
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Row>
                      <Col md={6} className="mb-3 mb-md-0">
                        <Form.Label>State</Form.Label>
                        <Form.Select
                          className="mb-2"
                          value={selectedState}
                          onChange={(e) => {
                            const state = e.target.value;
                            setSelectedState(state);
                            setSelectedCity("");
                            setCities([]);
                            fetchCities(state);
                          }}
                          isInvalid={!!oe.state}
                        >
                          <option value="">Select State</option>
                          {states.map((state) => (
                            <option key={state} value={state}>
                              {state}
                            </option>
                          ))}
                        </Form.Select>
                        <Form.Control.Feedback type="invalid">
                          {oe.state}
                        </Form.Control.Feedback>
                      </Col>
                      <Col md={6}>
                        <Form.Label>City</Form.Label>
                        <Form.Select
                          className="mb-2"
                          value={selectedCity}
                          onChange={(e) => setSelectedCity(e.target.value)}
                          disabled={!selectedState}
                          isInvalid={!!oe.city}
                        >
                          <option value="">Select City</option>
                          {cities.map((city) => (
                            <option key={city} value={city}>
                              {city}
                            </option>
                          ))}
                        </Form.Select>
                        <Form.Control.Feedback type="invalid">
                          {oe.city}
                        </Form.Control.Feedback>
                      </Col>
                    </Row>
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Row>
                      <Col md={6} className="mb-3 mb-md-0">
                        <Form.Label>Pincode</Form.Label>
                        <Form.Control
                          type="text"
                          inputMode="numeric"
                          pattern="\d{6}"
                          placeholder="6-digit pincode"
                          value={form.pincode}
                          onChange={(e) =>
                            setForm({ ...form, pincode: e.target.value })
                          }
                          style={{ borderRadius: "10px" }}
                          isInvalid={!!oe.pincode}
                        />
                        <Form.Control.Feedback type="invalid">
                          {oe.pincode}
                        </Form.Control.Feedback>
                      </Col>
                      <Col md={6}>
                        <Form.Label>Phone</Form.Label>
                        <Form.Control
                          type="tel"
                          placeholder="Business phone (optional)"
                          value={form.businessPhone}
                          onChange={(e) =>
                            setForm({ ...form, businessPhone: e.target.value })
                          }
                          style={{ borderRadius: "10px" }}
                          isInvalid={!!oe.businessPhone}
                        />
                        <Form.Control.Feedback type="invalid">
                          {oe.businessPhone}
                        </Form.Control.Feedback>
                      </Col>
                    </Row>
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label>Business Email (optional)</Form.Label>
                    <Form.Control
                      type="email"
                      placeholder="contact@yourbusiness.com"
                      value={form.businessEmail}
                      onChange={(e) =>
                        setForm({ ...form, businessEmail: e.target.value })
                      }
                      style={{ borderRadius: "10px" }}
                      isInvalid={!!oe.businessEmail}
                    />
                    <Form.Control.Feedback type="invalid">
                      {oe.businessEmail}
                    </Form.Control.Feedback>
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label>Years of Experience</Form.Label>
                    <Form.Control
                      type="number"
                      min="0"
                      placeholder="e.g., 5"
                      value={form.yearsOfExperience}
                      onChange={(e) =>
                        setForm({ ...form, yearsOfExperience: e.target.value })
                      }
                      style={{ borderRadius: "10px" }}
                    />
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label>
                      Business Logo URL (optional, can be updated later)
                    </Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="https://example.com/logo.jpg"
                      value={form.businessLogoUrl}
                      onChange={(e) =>
                        setForm({ ...form, businessLogoUrl: e.target.value })
                      }
                      style={{ borderRadius: "10px" }}
                    />
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label>
                      Small Description about your Business
                    </Form.Label>
                    <Form.Control
                      as="textarea"
                      rows={3}
                      placeholder="Anything else that would help you reach your customers..."
                      value={form.extra}
                      onChange={(e) =>
                        setForm({ ...form, extra: e.target.value })
                      }
                      style={{ borderRadius: "10px" }}
                    />
                  </Form.Group>

                  <Button
                    type="submit"
                    variant="primary"
                    size="lg"
                    className="w-100"
                    style={{ borderRadius: "10px" }}
                    disabled={loading || !onboardingValid}
                  >
                    {loading ? (
                      <>
                        <Spinner
                          animation="border"
                          size="sm"
                          className="me-2"
                        />{" "}
                        Saving...
                      </>
                    ) : (
                      "Save and Continue"
                    )}
                  </Button>
                </Form>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default VendorOnboarding;

import React, { useEffect, useState } from "react";
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

  const validate = () => {
    if (
      !form.businessName ||
      !form.businessAddress ||
      !form.state ||
      !form.pincode
    ) {
      setError(
        "Please fill required fields: Company Name, Address, City, State and Pincode."
      );
      return false;
    }
    if (!/^\d{6}$/.test(form.pincode)) {
      setError("Please enter a valid 6-digit pincode.");
      return false;
    }
    setError(null);
    return true;
  };

  const toggleServiceSelection = (serviceId) => {
    setForm((prev) => {
      const exists = prev.servicesProvided.includes(serviceId);
      const nextArr = exists
        ? prev.servicesProvided.filter((id) => id !== serviceId)
        : [...prev.servicesProvided, serviceId];
      return { ...prev, servicesProvided: nextArr };
    });
  };

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
      // key addition: servicesProvided as JSON string of IDs
      servicesProvided: JSON.stringify(form.servicesProvided),
    };

    setLoading(true);
    setError(null);

    try {
      const resp = await VendorOnBoarding(payload);
      sessionStorage.setItem("userId", resp?.data?.userId);
      sessionStorage.setItem("vendorId", resp?.data?.vendorId);
      console.log("Vendor onboarding response:", resp?.data);
      // navigate to vendor dashboard or profile page
      navigate("/vendor-dashboard");
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

                <Form onSubmit={handleSubmit}>
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
                      required
                    />
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
                        {services.map((s) => (
                          <Form.Check
                            key={s.serviceId}
                            type="checkbox"
                            id={`svc-${s.serviceId}`}
                            label={s.name}
                            checked={
                              form.servicesProvided.includes(
                                String(s.serviceId)
                              ) || form.servicesProvided.includes(s.serviceId)
                            }
                            onChange={() => toggleServiceSelection(s.serviceId)}
                            className="mb-1"
                          />
                        ))}
                      </div>
                    )}
                    <Form.Text className="text-muted">
                      Select all services you provide.
                    </Form.Text>
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
                      required
                    />
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Row>
                      <Col md={6} className="mb-3 mb-md-0">
                        <Form.Label>City</Form.Label>
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
                        >
                          <option value="">Select State</option>
                          {states.map((state) => (
                            <option key={state} value={state}>
                              {state}
                            </option>
                          ))}
                        </Form.Select>
                      </Col>
                      <Col md={6}>
                        <Form.Label>State</Form.Label>
                        <Form.Select
                          className="mb-2"
                          value={selectedCity}
                          onChange={(e) => setSelectedCity(e.target.value)}
                          disabled={!selectedState}
                        >
                          <option value="">Select City</option>
                          {cities.map((city) => (
                            <option key={city} value={city}>
                              {city}
                            </option>
                          ))}
                        </Form.Select>
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
                          required
                        />
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
                        />
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
                    />
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
                    disabled={loading}
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

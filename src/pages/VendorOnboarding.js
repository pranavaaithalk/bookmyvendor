import React, { useState } from "react";
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
import axios from "axios";
import { VendorOnBoarding } from "../services/api";

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
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const userIdFromStorage = () => {
    const id = localStorage.getItem("userId");
    return id ? id : null;
  };

  const validate = () => {
    // basic validation: required fields and 6-digit pincode
    if (
      !form.businessName ||
      !form.businessAddress ||
      !form.city ||
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
    // optionally validate phone/email...
    setError(null);
    return true;
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
    const payload = {
      userId: String(userId),
      businessName: form.businessName,
      businessDescription: form.businessDescription || "",
      businessAddress: form.businessAddress,
      city: form.city,
      state: form.state,
      country: form.country || "India",
      pincode: form.pincode,
      businessPhone: form.businessPhone || "",
      businessEmail: form.businessEmail || "",
      businessLogoUrl: form.businessLogoUrl || "",
      yearsOfExperience: form.yearsOfExperience
        ? String(form.yearsOfExperience)
        : "",
      isFeatured: String(form.isFeatured), // controller uses Boolean.parseBoolean
      isApproved: String(form.isApproved),
      rating: 0.0,
      totalReviews: 0,
    };

    setLoading(true);
    setError(null);

    try {
      const resp = await VendorOnBoarding(payload);

      // success - backend returns created VendorProfile
      console.log("Vendor onboarding response:", resp?.data);
      // navigate to vendor dashboard or profile page
      navigate("/vendor-dashboard");
    } catch (err) {
      console.error("Failed to create vendor profile", err);
      // show server message if available
      const msg =
        err?.response?.data?.message ||
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
                    <Form.Label>Business Type / Short Description</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="e.g., Catering, Photographer, Decorator"
                      value={form.businessDescription}
                      onChange={(e) =>
                        setForm({
                          ...form,
                          businessDescription: e.target.value,
                        })
                      }
                      style={{ borderRadius: "10px" }}
                    />
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
                        <Form.Control
                          type="text"
                          placeholder="City"
                          value={form.city}
                          onChange={(e) =>
                            setForm({ ...form, city: e.target.value })
                          }
                          style={{ borderRadius: "10px" }}
                          required
                        />
                      </Col>
                      <Col md={6}>
                        <Form.Label>State</Form.Label>
                        <Form.Control
                          type="text"
                          placeholder="State"
                          value={form.state}
                          onChange={(e) =>
                            setForm({ ...form, state: e.target.value })
                          }
                          style={{ borderRadius: "10px" }}
                          required
                        />
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
                    <Form.Label>Business Email</Form.Label>
                    <Form.Control
                      type="email"
                      placeholder="contact@yourbusiness.com (optional)"
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
                    <Form.Label>Business Logo URL (optional)</Form.Label>
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
                    <Form.Label>Additional Details</Form.Label>
                    <Form.Control
                      as="textarea"
                      rows={3}
                      placeholder="Anything else you'd like us to know"
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

/**
 * Shared form validation helpers for the app.
 */

export function trim(v) {
  return (v ?? "").trim();
}

export function isNonEmpty(v) {
  return trim(v).length > 0;
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
export function isValidEmail(v) {
  return EMAIL_RE.test(trim(v));
}

/** Indian mobile: 10 digits; allows optional +91 / 91 prefix and spaces */
export function isValidIndiaMobile(v) {
  const s = trim(v).replace(/\s/g, "");
  if (!s) return false;
  let digits = s;
  if (digits.startsWith("+91")) digits = digits.slice(3);
  else if (digits.startsWith("91") && digits.length === 12) digits = digits.slice(2);
  return /^\d{10}$/.test(digits);
}

export function isValidIndiaMobileOptional(v) {
  if (!trim(v)) return true;
  return isValidIndiaMobile(v);
}

export function isValidPincodeIN(v) {
  return /^\d{6}$/.test(trim(v));
}

export const PASSWORD_MIN_LENGTH = 8;

export function validateLogin({ email, password }) {
  const errors = {};
  if (!isNonEmpty(email)) errors.email = "Email is required.";
  else if (!isValidEmail(email)) errors.email = "Enter a valid email address.";
  if (!isNonEmpty(password)) errors.password = "Password is required.";
  return { valid: Object.keys(errors).length === 0, errors };
}

export function validateSignup(data) {
  const errors = {};
  if (!isNonEmpty(data.firstName)) errors.firstName = "First name is required.";
  if (!isNonEmpty(data.lastName)) errors.lastName = "Last name is required.";
  if (!isNonEmpty(data.email)) errors.email = "Email is required.";
  else if (!isValidEmail(data.email)) errors.email = "Enter a valid email address.";
  if (!isNonEmpty(data.phone)) errors.phone = "Phone number is required.";
  else if (!isValidIndiaMobile(data.phone)) {
    errors.phone = "Enter a valid 10-digit mobile number.";
  }
  if (!isNonEmpty(data.passwordHash)) errors.passwordHash = "Password is required.";
  else if (trim(data.passwordHash).length < PASSWORD_MIN_LENGTH) {
    errors.passwordHash = `Password must be at least ${PASSWORD_MIN_LENGTH} characters.`;
  }
  if (!isNonEmpty(data.confirmPassword)) {
    errors.confirmPassword = "Please confirm your password.";
  } else if (trim(data.passwordHash) !== trim(data.confirmPassword)) {
    errors.confirmPassword = "Passwords do not match.";
  }
  return { valid: Object.keys(errors).length === 0, errors };
}

export function validateContactForm(data) {
  const errors = {};
  if (!isNonEmpty(data.name)) errors.name = "Full name is required.";
  if (!isNonEmpty(data.email)) errors.email = "Email is required.";
  else if (!isValidEmail(data.email)) errors.email = "Enter a valid email address.";
  if (!isNonEmpty(data.subject)) errors.subject = "Please select a subject.";
  if (!isNonEmpty(data.message)) errors.message = "Message is required.";
  else if (trim(data.message).length < 10) {
    errors.message = "Please enter at least 10 characters.";
  }
  if (trim(data.phone) && !isValidIndiaMobile(data.phone)) {
    errors.phone = "Enter a valid 10-digit phone number or leave blank.";
  }
  return { valid: Object.keys(errors).length === 0, errors };
}

export function validateClientProfile(form) {
  const errors = {};
  if (!isNonEmpty(form.firstName)) errors.firstName = "First name is required.";
  if (!isNonEmpty(form.lastName)) errors.lastName = "Last name is required.";
  if (!isNonEmpty(form.phone)) errors.phone = "Phone number is required.";
  else if (!isValidIndiaMobile(form.phone)) {
    errors.phone = "Enter a valid 10-digit mobile number.";
  }
  return { valid: Object.keys(errors).length === 0, errors };
}

export function validateVendorProfile(form) {
  const errors = {};
  if (!isNonEmpty(form.name)) errors.name = "Business name is required.";
  if (!isNonEmpty(form.location)) errors.location = "Location is required.";
  if (!isNonEmpty(form.phone)) errors.phone = "Phone number is required.";
  else if (!isValidIndiaMobile(form.phone)) {
    errors.phone = "Enter a valid 10-digit mobile number.";
  }
  if (!isNonEmpty(form.experience)) errors.experience = "Experience is required.";
  if (!isNonEmpty(form.priceRange)) errors.priceRange = "Price range is required.";
  if (!isNonEmpty(form.description)) errors.description = "Description is required.";
  return { valid: Object.keys(errors).length === 0, errors };
}

export function validateBookingStep1(data) {
  const errors = {};
  if (!isNonEmpty(data.eventDate)) errors.eventDate = "Event date is required.";
  if (!isNonEmpty(data.eventTime)) errors.eventTime = "Event time is required.";
  if (!isNonEmpty(data.venue)) errors.venue = "Venue address is required.";
  const gc = Number(data.guestCount);
  if (!isNonEmpty(data.guestCount) || Number.isNaN(gc) || gc < 1) {
    errors.guestCount = "Enter a valid guest count (at least 1).";
  }
  return { valid: Object.keys(errors).length === 0, errors };
}

export function validateBookingStep2(data) {
  const errors = {};
  if (!isNonEmpty(data.contactName)) errors.contactName = "Full name is required.";
  if (!isNonEmpty(data.contactPhone)) errors.contactPhone = "Phone number is required.";
  else if (!isValidIndiaMobile(data.contactPhone)) {
    errors.contactPhone = "Enter a valid 10-digit mobile number.";
  }
  if (!isNonEmpty(data.contactEmail)) errors.contactEmail = "Email is required.";
  else if (!isValidEmail(data.contactEmail)) errors.contactEmail = "Enter a valid email address.";
  return { valid: Object.keys(errors).length === 0, errors };
}

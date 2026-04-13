package Final.Year.Project.bmv.controller;

import Final.Year.Project.bmv.dto.*;
import Final.Year.Project.bmv.service.ContactEmailService;
import Final.Year.Project.bmv.service.OtpService;
import jakarta.validation.Valid;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/otp")
public class OtpController {

    private static final Logger log = LoggerFactory.getLogger(OtpController.class);

    private final OtpService otpService;
    private final ContactEmailService contactEmailService;

    public OtpController(OtpService otpService, ContactEmailService contactEmailService) {
        this.otpService = otpService;
        this.contactEmailService = contactEmailService;
    }

    /**
     * Contact form: delivers to configured inbox from {@code contact.from.email},
     * with {@code Reply-To} set to the submitter's email.
     */
    @PostMapping("/email/contact")
    public ResponseEntity<?> contactEmail(@Valid @RequestBody ContactFormRequest request) {
        try {
            contactEmailService.sendContactForm(request);
            return ResponseEntity.ok(Map.of("message", "Contact message sent"));
        } catch (IllegalStateException e) {
            return ResponseEntity.status(503).body(Map.of("error", e.getMessage()));
        } catch (Exception e) {
            log.error("contact-email-failed", e);
            return ResponseEntity.status(503).body(Map.of("error", "Failed to send contact email"));
        }
    }

    @PostMapping("/email/send")
    public ResponseEntity<?> sendEmailOtp(@Valid @RequestBody OtpEmailSendRequest request) {
        try {
            int expiresInSeconds = otpService.sendEmailOtp(request.getEmail());
            return ResponseEntity.ok(Map.of(
                    "message", "OTP sent",
                    "expiresInSeconds", expiresInSeconds
            ));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        } catch (IllegalStateException e) {
            return ResponseEntity.status(503).body(Map.of("error", e.getMessage()));
        }
    }

    @PostMapping("/email/verify")
    public ResponseEntity<?> verifyEmailOtp(@Valid @RequestBody OtpEmailVerifyRequest request) {
        boolean ok = otpService.verifyEmailOtp(request.getEmail(), request.getCode());
        if (ok) {
            return ResponseEntity.ok(Map.of("verified", true));
        }
        return ResponseEntity.status(400).body(Map.of(
                "verified", false,
                "error", "Invalid or expired code"
        ));
    }

    @PostMapping("/sms/send")
    public ResponseEntity<?> sendSmsOtp(@Valid @RequestBody OtpSmsSendRequest request) {
        try {
            int expiresInSeconds = otpService.sendSmsOtp(request.getPhone());
            return ResponseEntity.ok(Map.of(
                    "message", "OTP sent",
                    "expiresInSeconds", expiresInSeconds
            ));
        } catch (IllegalStateException e) {
            return ResponseEntity.status(503).body(Map.of("error", e.getMessage()));
        }
    }

    @PostMapping("/sms/verify")
    public ResponseEntity<?> verifySmsOtp(@Valid @RequestBody OtpSmsVerifyRequest request) {
        boolean ok = otpService.verifySmsOtp(request.getPhone(), request.getCode());
        if (ok) {
            return ResponseEntity.ok(Map.of("verified", true));
        }
        return ResponseEntity.status(400).body(Map.of(
                "verified", false,
                "error", "Invalid or expired code"
        ));
    }
}

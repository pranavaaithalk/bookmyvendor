package Final.Year.Project.bmv.controller;

import Final.Year.Project.bmv.dto.*;
import Final.Year.Project.bmv.service.OtpService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/otp")
public class OtpController {

    private final OtpService otpService;

    public OtpController(OtpService otpService) {
        this.otpService = otpService;
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

package Final.Year.Project.bmv.service;

import Final.Year.Project.bmv.entity.OtpChallenge;
import Final.Year.Project.bmv.entity.OtpChannel;
import Final.Year.Project.bmv.repository.OtpChallengeRepository;
import jakarta.mail.internet.MimeMessage;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;

import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.SecureRandom;
import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.HexFormat;
import java.util.Locale;
import java.util.Optional;
import java.util.regex.Pattern;

@Service
public class OtpService {

    private static final Logger log = LoggerFactory.getLogger(OtpService.class);

    private static final Pattern EMAIL_PATTERN = Pattern.compile("^[\\w.%+-]+@[\\w.-]+\\.[A-Za-z]{2,}$");

    private final OtpChallengeRepository otpRepository;
    private final JavaMailSender mailSender;
    private final TwillioService twillioService;

    private final SecureRandom secureRandom = new SecureRandom();

    @Value("${otp.code-length:6}")
    private int codeLength;

    @Value("${otp.ttl-minutes:10}")
    private int ttlMinutes;

    @Value("${otp.max-verify-attempts:5}")
    private int maxVerifyAttempts;

    @Value("${otp.pepper}")
    private String pepper;

    @Value("${otp.email.from:}")
    private String otpEmailFrom;

    @Value("${spring.mail.username:}")
    private String mailUsername;

    public OtpService(OtpChallengeRepository otpRepository, JavaMailSender mailSender, TwillioService twillioService) {
        this.otpRepository = otpRepository;
        this.mailSender = mailSender;
        this.twillioService = twillioService;
    }

    @Transactional
    public int sendEmailOtp(String rawEmail) {
        String email = normalizeEmail(rawEmail);
        if (!EMAIL_PATTERN.matcher(email).matches()) {
            throw new IllegalArgumentException("Invalid email address");
        }
        if (!StringUtils.hasText(mailUsername)) {
            throw new IllegalStateException("Email is not configured (set MAIL_USERNAME / MAIL_PASSWORD)");
        }

        String code = generateNumericCode();
        String hash = hashOtp(code);
        Instant expiresAt = Instant.now().plus(ttlMinutes, ChronoUnit.MINUTES);

        otpRepository.deleteByDestinationAndChannel(email, OtpChannel.EMAIL);
        OtpChallenge challenge = OtpChallenge.builder()
                .destination(email)
                .channel(OtpChannel.EMAIL)
                .codeHash(hash)
                .expiresAt(expiresAt)
                .attempts(0)
                .createdAt(Instant.now())
                .build();
        otpRepository.save(challenge);

        try {
            sendEmailMessage(email, code);
        } catch (Exception e) {
            log.error("send-email-otp-failed: {}", e.getMessage());
            otpRepository.deleteByDestinationAndChannel(email, OtpChannel.EMAIL);
            throw new IllegalStateException("Failed to send email: " + e.getMessage());
        }

        return ttlMinutes * 60;
    }

    @Transactional
    public int sendSmsOtp(String rawPhone) {
        String phone = rawPhone.trim();
        String code = generateNumericCode();
        String hash = hashOtp(code);
        Instant expiresAt = Instant.now().plus(ttlMinutes, ChronoUnit.MINUTES);

        otpRepository.deleteByDestinationAndChannel(phone, OtpChannel.SMS);
        OtpChallenge challenge = OtpChallenge.builder()
                .destination(phone)
                .channel(OtpChannel.SMS)
                .codeHash(hash)
                .expiresAt(expiresAt)
                .attempts(0)
                .createdAt(Instant.now())
                .build();
        otpRepository.save(challenge);

        try {
            twillioService.sendOtpSms(phone, code, ttlMinutes);
        } catch (Exception e) {
            log.error("send-sms-otp-failed: {}", e.getMessage());
            otpRepository.deleteByDestinationAndChannel(phone, OtpChannel.SMS);
            throw new IllegalStateException("Failed to send SMS: " + e.getMessage());
        }

        return ttlMinutes * 60;
    }

    @Transactional
    public boolean verifyEmailOtp(String rawEmail, String code) {
        String email = normalizeEmail(rawEmail);
        return verify(email, OtpChannel.EMAIL, code);
    }

    @Transactional
    public boolean verifySmsOtp(String rawPhone, String code) {
        String phone = rawPhone.trim();
        return verify(phone, OtpChannel.SMS, code);
    }

    private boolean verify(String destination, OtpChannel channel, String code) {
        if (code == null || code.length() != codeLength) {
            return false;
        }
        Optional<OtpChallenge> opt = otpRepository.findByDestinationAndChannel(destination, channel);
        if (opt.isEmpty()) {
            return false;
        }
        OtpChallenge row = opt.get();
        if (Instant.now().isAfter(row.getExpiresAt())) {
            otpRepository.delete(row);
            return false;
        }
        if (row.getAttempts() >= maxVerifyAttempts) {
            otpRepository.delete(row);
            return false;
        }

        if (!constantTimeEquals(hashOtp(code), row.getCodeHash())) {
            row.setAttempts(row.getAttempts() + 1);
            otpRepository.save(row);
            return false;
        }

        otpRepository.delete(row);
        return true;
    }

    private void sendEmailMessage(String to, String code) throws Exception {
        String from = StringUtils.hasText(otpEmailFrom) ? otpEmailFrom : mailUsername;
        MimeMessage message = mailSender.createMimeMessage();
        MimeMessageHelper helper = new MimeMessageHelper(message, true, StandardCharsets.UTF_8.name());
        helper.setFrom(from);
        helper.setTo(to);
        helper.setSubject("Your BookMyVendor verification code");
        helper.setText(
                "Your verification code is: " + code + "\n\n"
                        + "This code expires in " + ttlMinutes + " minutes.\n"
                        + "If you did not request this, you can ignore this email.",
                false
        );
        mailSender.send(message);
    }

    private String generateNumericCode() {
        int len = Math.max(4, Math.min(12, codeLength));
        int bound = (int) Math.pow(10, len);
        int n = secureRandom.nextInt(bound);
        return String.format(Locale.ROOT, "%0" + len + "d", n);
    }

    private String hashOtp(String code) {
        try {
            MessageDigest md = MessageDigest.getInstance("SHA-256");
            String payload = pepper + "|" + code;
            byte[] digest = md.digest(payload.getBytes(StandardCharsets.UTF_8));
            return HexFormat.of().formatHex(digest);
        } catch (Exception e) {
            throw new IllegalStateException("Unable to hash OTP", e);
        }
    }

    private static boolean constantTimeEquals(String a, String b) {
        byte[] x = a.getBytes(StandardCharsets.UTF_8);
        byte[] y = b.getBytes(StandardCharsets.UTF_8);
        return MessageDigest.isEqual(x, y);
    }

    private static String normalizeEmail(String raw) {
        return raw == null ? "" : raw.trim().toLowerCase(Locale.ROOT);
    }
}

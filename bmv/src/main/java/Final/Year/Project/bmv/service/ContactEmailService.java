package Final.Year.Project.bmv.service;

import Final.Year.Project.bmv.dto.ContactFormRequest;
import jakarta.mail.internet.MimeMessage;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

import java.nio.charset.StandardCharsets;

@Service
public class ContactEmailService {

    private static final Logger log = LoggerFactory.getLogger(ContactEmailService.class);

    private static final int MESSAGE_MAX_STORED = 10000;

    private final JavaMailSender mailSender;

    @Value("${contact.inbox.email:pranavaaithal1128@gmail.com}")
    private String inboxEmail;

    @Value("${contact.from.email:services@bmvindia.online}")
    private String fromEmail;

    @Value("${spring.mail.username:}")
    private String mailUsername;

    public ContactEmailService(JavaMailSender mailSender) {
        this.mailSender = mailSender;
    }

    public void sendContactForm(ContactFormRequest request) throws Exception {
        if (!StringUtils.hasText(mailUsername)) {
            throw new IllegalStateException("Email is not configured (set spring.mail.username / password)");
        }

        String senderEmail = request.getEmail().trim();
        String bodyMessage = truncateMessage(request.getMessage());
        String phoneLine = StringUtils.hasText(request.getPhone()) ? request.getPhone().trim() : "(not provided)";

        String text = """
                New contact form submission (BookMyVendor)

                From name: %s
                From email: %s
                Phone: %s

                Category key: %s
                Category label: %s

                Message:
                %s
                """.formatted(
                request.getName().trim(),
                senderEmail,
                phoneLine,
                request.getSubject().trim(),
                request.getSubjectLabel().trim(),
                bodyMessage
        );

        String subjectLine = "[BMV Contact] " + request.getSubjectLabel().trim()
                + " (" + request.getSubject().trim() + ") — " + request.getName().trim();

        MimeMessage message = mailSender.createMimeMessage();
        MimeMessageHelper helper = new MimeMessageHelper(message, true, StandardCharsets.UTF_8.name());
        helper.setFrom(fromEmail);
        helper.setTo(inboxEmail);
        helper.setReplyTo(senderEmail);
        helper.setSubject(subjectLine);
        helper.setText(text, false);

        mailSender.send(message);
        log.info("contact-form-sent inbox={} replyTo={} subjectKey={}", inboxEmail, senderEmail, request.getSubject());
    }

    private static String truncateMessage(String raw) {
        if (raw == null) {
            return "";
        }
        if (raw.length() <= MESSAGE_MAX_STORED) {
            return raw;
        }
        return raw.substring(0, MESSAGE_MAX_STORED) + "\n\n[Message truncated at " + MESSAGE_MAX_STORED + " characters]";
    }
}

package Final.Year.Project.bmv.service;

import com.twilio.Twilio;
import com.twilio.rest.api.v2010.account.Message;
import com.twilio.type.PhoneNumber;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@Service
public class TwillioService {

    private static final Logger log = LoggerFactory.getLogger(TwillioService.class);

    @Value("${TWILIO_ACCOUNT_SID:}")
    private String accountSid;

    @Value("${TWILIO_AUTH_TOKEN:}")
    private String authToken;

    @Value("${TWILIO_PHONE_NUMBER:}")
    private String fromNumber;

    @Value("${DEFAULT_TO_PHONE:}")
    private String defaultToPhone;

    private void sendSms(String toPhone, String messageBody) {

        String finalTo = (toPhone != null && !toPhone.isBlank())
                ? toPhone
                : defaultToPhone;

        if (finalTo == null || finalTo.isBlank()) {
            throw new IllegalStateException("No recipient phone number provided");
        }

        if (accountSid == null || accountSid.isBlank() ||
                authToken == null || authToken.isBlank() ||
                fromNumber == null || fromNumber.isBlank()) {
            throw new IllegalStateException("Twilio credentials not configured");
        }

        try {
            Twilio.init(accountSid, authToken);

            Message message = Message.creator(
                    new PhoneNumber(finalTo),
                    new PhoneNumber(fromNumber),
                    messageBody
            ).create();

            log.info("Twilio Message Sent. SID: {}", message.getSid());

        } catch (Exception ex) {
            log.error("error-sending-sms: {}", ex.getMessage());
            throw ex;
        }
    }

// ------------------ UPDATED METHODS ------------------

    public void sendVendorInvite(
            String phone,
            String vendorName,
            String event,
            String service,
            String date,
            String inviteSignupUrl
    ) {
        StringBuilder msg = new StringBuilder();
        msg.append(String.format(
                "Hello %s,\nYou have a new request for %s.\nService: %s\nDate: %s",
                safe(vendorName), safe(event), safe(service), safe(date)
        ));
        if (inviteSignupUrl != null && !inviteSignupUrl.isBlank()) {
            msg.append("\n\nComplete vendor signup:\n")
                    .append(inviteSignupUrl);
        } else {
            msg.append("\n\nVisit https://bmvindia.online to view this booking.");
        }
        sendSms(phone, msg.toString());
    }

    /** SMS without magic signup link (e.g. tests). */
    public void sendVendorInvite(String phone, String vendorName, String event, String service, String date) {
        sendVendorInvite(phone, vendorName, event, service, date, null);
    }

    /** Client notification when Google-vendor invite was not completed within the deadline. */
    public void sendVendorInviteExpired(
            String phone,
            String customerName,
            String serviceName,
            String eventDate
    ) {
        String msg = String.format(
                "Hi %s,\nThe vendor you selected did not complete signup within 48 hours for %s (date: %s).\nPlease open BookMyVendor and choose another vendor.\n\nhttps://bmvindia.online",
                safe(customerName), safe(serviceName), safe(eventDate)
        );
        sendSms(phone, msg);
    }

    public void sendEventCompleted(
            String phone,
            String customerName,
            String eventDate
    ) {
        String msg = String.format(
                "Hi %s,\nYour event on %s has been successfully completed 🎉\n\nVisit https://bmvindia.online to view your event details.",
                safe(customerName), safe(eventDate)
        );

        sendSms(phone, msg);
    }

    public void sendVendorRejected(
            String phone,
            String customerName,
            String serviceName,
            String eventDate
    ) {
        String msg = String.format(
                "Hi %s,\nYour request for %s on %s was rejected.\n\nVisit https://bmvindia.online to check other options.",
                safe(customerName), safe(serviceName), safe(eventDate)
        );

        sendSms(phone, msg);
    }

    public void sendVendorConfirmed(
            String phone,
            String customerName,
            String bookingName,
            String eventDate
    ) {
        String msg = String.format(
                "Hi %s,\nYour %s booking for %s is confirmed ✅\n\nVisit https://bmvindia.online to view your booking.",
                safe(customerName), safe(bookingName), safe(eventDate)
        );

        sendSms(phone, msg);
    }


    private String safe(String value) {
        return value == null ? "" : value;
    }
}
package Final.Year.Project.bmv.dto;

import lombok.Builder;
import lombok.Value;

import java.time.LocalDateTime;

@Value
@Builder
public class VendorInvitePublicResponse {
    boolean valid;
    boolean expired;
    boolean consumed;
    LocalDateTime expiresAt;
    String signupUrl;

    String vendorDisplayName;
    String contactPhone;
    String googlePlaceId;

    Long serviceRequestId;
    Long serviceId;
    String serviceName;

    Long eventId;
    String eventTitle;
    String eventDate;
    String venueAddress;

    String budgetMax;
    Integer guestCount;

    String suggestedBusinessName;
    String suggestedCity;
    String suggestedBusinessPhone;
    String suggestedBusinessAddress;
}

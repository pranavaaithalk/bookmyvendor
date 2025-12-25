package Final.Year.Project.bmv.dto;

import Final.Year.Project.bmv.entity.Bookings;
import lombok.Getter;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalTime;

@Getter
public class VendorBookingDto {

    private Long bookingId;
    private String eventName;
    private String clientName;
    private LocalDate eventDate;
    private LocalTime eventTime;
    private Integer guestCount;
    private BigDecimal amount;
    private String status;
    private String phone;
    private String email;
    private String location;
    private String notes;

    public static VendorBookingDto from(Bookings b) {
        VendorBookingDto dto = new VendorBookingDto();
        dto.bookingId = b.getBookingId();
        dto.eventName = b.getEvent().getTitle();
        dto.clientName = b.getEvent().getClient().getFirstName();
        dto.eventDate = b.getEvent().getEventDate();
        dto.eventTime = b.getEvent().getStartTime();
        dto.guestCount = b.getEvent().getGuestCount();
        dto.amount = b.getAmount();
        dto.status = b.getBookingStatus().name().toLowerCase();
        dto.phone = b.getEvent().getClient().getPhone();
        dto.email = b.getEvent().getClient().getEmail();
        dto.location = b.getEvent().getVenueAddress();
        dto.notes = b.getNotes();
        return dto;
    }

}


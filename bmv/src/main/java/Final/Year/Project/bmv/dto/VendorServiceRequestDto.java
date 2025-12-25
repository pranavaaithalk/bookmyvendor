package Final.Year.Project.bmv.dto;

import Final.Year.Project.bmv.entity.VendorServiceRequest;
import lombok.Getter;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalTime;

@Getter
public class VendorServiceRequestDto {

    private Long vendorRequestId;
    private String eventName;
    private LocalDate eventDate;
    private LocalTime eventTime;
    private Integer guestCount;
    private BigDecimal proposedAmount;
    private String message;
    private String status;
    private String clientName;

    public static VendorServiceRequestDto from(VendorServiceRequest vsr) {
        VendorServiceRequestDto dto = new VendorServiceRequestDto();
        dto.vendorRequestId = vsr.getVendorRequestId();
        dto.eventName = vsr.getServiceRequest().getEvent().getTitle();
        dto.eventDate = vsr.getServiceRequest().getEvent().getEventDate();
        dto.eventTime = vsr.getServiceRequest().getEvent().getStartTime();
        dto.guestCount = vsr.getServiceRequest().getEvent().getGuestCount();
        dto.proposedAmount = vsr.getProposedAmount();
        dto.message = vsr.getMessage();
        dto.status = vsr.getStatus().name();
        dto.clientName = vsr.getServiceRequest().getEvent().getClient().getFirstName();
        return dto;
    }

}

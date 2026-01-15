package Final.Year.Project.bmv.dto;

import Final.Year.Project.bmv.entity.ServiceRequest;
import Final.Year.Project.bmv.entity.VendorServiceRequest;
import lombok.*;

import java.math.BigDecimal;
import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class ServiceRequestWithVendorDto {

    private Long requestId;
    private String serviceName;
    private Integer guestCount;
    private BigDecimal budgetMin;
    private BigDecimal budgetMax;
    private VendorRequestDto vendorRequest;

    public static ServiceRequestWithVendorDto from(
            ServiceRequest sr,
            List<VendorServiceRequest> vsr
    ) {
        return ServiceRequestWithVendorDto.builder()
                .requestId(sr.getRequestId())
                .serviceName(sr.getService().getName())
                .guestCount(sr.getGuestCount())
                .budgetMin(sr.getBudgetMin())
                .budgetMax(sr.getBudgetMax())
                .vendorRequest(VendorRequestDto.from(vsr.getFirst()))
                .build();
    }
}

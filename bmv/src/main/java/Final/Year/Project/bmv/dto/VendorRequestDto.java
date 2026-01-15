package Final.Year.Project.bmv.dto;

import Final.Year.Project.bmv.entity.VendorServiceRequest;
import lombok.*;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class VendorRequestDto {

    private Long vendorRequestId;
    private Long vendorId;
    private String vendorName;
    private String status;

    public static VendorRequestDto from(VendorServiceRequest vsr) {
        if (vsr == null) return null;

        return VendorRequestDto.builder()
                .vendorRequestId(vsr.getVendorRequestId())
                .vendorId(vsr.getVendor().getVendorId())
                .vendorName(vsr.getVendor().getBusinessName())
                .status(vsr.getStatus().name().toLowerCase())
                .build();
    }
}

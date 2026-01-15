package Final.Year.Project.bmv.dto;

import lombok.Data;

@Data
public class ReviewInputDto {
    private TargetType targetType;
    private Long vendorId;
    private Long serviceRequestId;
    private Long vendorServiceRequestId;
    private Integer rating;
    private String comment;

    public enum TargetType {
        VENDOR,
        PLATFORM
    }
}

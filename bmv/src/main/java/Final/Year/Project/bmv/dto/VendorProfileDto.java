package Final.Year.Project.bmv.dto;

import java.math.BigDecimal;
import Final.Year.Project.bmv.entity.VendorProfile;

/**
 * Lightweight DTO for vendor profile information sent to clients.
 */
public class VendorProfileDto {
    private final Long vendorId;
    private final String businessName;
    private final String city;
    private final String state;
    private final String businessLogoUrl;
    private final BigDecimal rating;
    private final Integer totalReviews;
    private final Integer yearsOfExperience;

    public VendorProfileDto(Long vendorId,
                            String businessName,
                            String city,
                            String state,
                            String businessLogoUrl,
                            BigDecimal rating,
                            Integer totalReviews,
                            Integer yearsOfExperience) {
        this.vendorId = vendorId;
        this.businessName = businessName;
        this.city = city;
        this.state = state;
        this.businessLogoUrl = businessLogoUrl;
        this.rating = rating;
        this.totalReviews = totalReviews;
        this.yearsOfExperience = yearsOfExperience;
    }

    public Long getVendorId() { return vendorId; }
    public String getBusinessName() { return businessName; }
    public String getCity() { return city; }
    public String getState() { return state; }
    public String getBusinessLogoUrl() { return businessLogoUrl; }
    public BigDecimal getRating() { return rating; }
    public Integer getTotalReviews() { return totalReviews; }
    public Integer getYearsOfExperience() { return yearsOfExperience; }

    /**
     * Map from JPA entity to DTO.
     * Call this while still inside your service/transaction (so lazy fields are available).
     */
    public static VendorProfileDto from(VendorProfile vp) {
        if (vp == null) return null;
        return new VendorProfileDto(
                vp.getVendorId(),
                vp.getBusinessName(),
                vp.getCity(),
                vp.getState(),
                vp.getBusinessLogoUrl(),
                vp.getRating(),
                vp.getTotalReviews(),
                vp.getYearsOfExperience()
        );
    }
}


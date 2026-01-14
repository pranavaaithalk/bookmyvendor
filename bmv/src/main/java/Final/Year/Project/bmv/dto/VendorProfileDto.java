package Final.Year.Project.bmv.dto;

import java.math.BigDecimal;
import java.util.List;

public class VendorProfileDto {
    private Long vendorId;
    private String businessName;
    private String userName;
    private String businessDescription;
    private String businessAddress;
    private String city;
    private String state;
    private String country;
    private String pincode;
    private String businessPhone;
    private String businessEmail;
    private String businessLogoUrl;
    private BigDecimal rating;
    private Integer totalReviews;
    private Integer totalRevenue;
    private Integer yearsOfExperience;
    private List<VendorServiceDto> vendorServices; // added list

    public VendorProfileDto() {}

    public VendorProfileDto(Long vendorId,
                            String businessName,
                            String userName,
                            String businessDescription,
                            String businessAddress,
                            String city,
                            String state,
                            String country,
                            String pincode,
                            String businessPhone,
                            String businessEmail,
                            String businessLogoUrl,
                            BigDecimal rating,
                            Integer totalReviews,
                            Integer totalRevenue,
                            Integer yearsOfExperience,
                            List<VendorServiceDto> vendorServices) {
        this.vendorId = vendorId;
        this.businessName = businessName;
        this.userName = userName;
        this.businessDescription = businessDescription;
        this.businessAddress = businessAddress;
        this.city = city;
        this.state = state;
        this.country = country;
        this.pincode = pincode;
        this.businessPhone = businessPhone;
        this.businessEmail = businessEmail;
        this.businessLogoUrl = businessLogoUrl;
        this.rating = rating;
        this.totalReviews = totalReviews;
        this.totalRevenue = totalRevenue;
        this.yearsOfExperience = yearsOfExperience;
        this.vendorServices = vendorServices;
    }

    // getters
    public Long getVendorId() { return vendorId; }
    public String getBusinessName() { return businessName; }
    public String getUserName() { return userName; }
    public String getBusinessDescription() { return businessDescription; }
    public String getBusinessAddress() { return businessAddress; }
    public String getCity() { return city; }
    public String getState() { return state; }
    public String getCountry() { return country; }
    public String getPincode() { return pincode; }
    public String getBusinessPhone() { return businessPhone; }
    public String getBusinessEmail() { return businessEmail; }
    public String getBusinessLogoUrl() { return businessLogoUrl; }
    public BigDecimal getRating() { return rating; }
    public Integer getTotalReviews() { return totalReviews; }
    public Integer getYearsOfExperience() { return yearsOfExperience; }
    public List<VendorServiceDto> getVendorServices() { return vendorServices; }
    public Integer getTotalRevenue() { return totalRevenue; }

    // mapping helper: call in transactional context so lazy associations can be accessed
    public static VendorProfileDto from(Final.Year.Project.bmv.entity.VendorProfile vp, java.util.List<Final.Year.Project.bmv.entity.VendorService> vendorServicesList) {
        if (vp == null) return null;
        java.util.List<VendorServiceDto> vsDtos = java.util.Collections.emptyList();
        if (vendorServicesList != null && !vendorServicesList.isEmpty()) {
            vsDtos = vendorServicesList.stream().map(VendorServiceDto::from).toList();
        }
        return new VendorProfileDto(
                vp.getVendorId(),
                vp.getBusinessName(),
                vp.getUser().getFirstName(),
                vp.getBusinessDescription(),
                vp.getBusinessAddress(),
                vp.getCity(),
                vp.getState(),
                vp.getCountry(),
                vp.getPincode(),
                vp.getBusinessPhone(),
                vp.getBusinessEmail(),
                vp.getBusinessLogoUrl(),
                vp.getRating(),
                vp.getTotalReviews(),
                vp.getTotalRevenue(),
                vp.getYearsOfExperience(),
                vsDtos
        );
    }
}

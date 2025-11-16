package Final.Year.Project.bmv.dto;

import java.math.BigDecimal;
import Final.Year.Project.bmv.entity.VendorService;

/**
 * DTO representing a vendor service listing (lightweight).
 */
public class VendorServiceDto {
    private final Long vendorServiceId;
    private final Long serviceId;
    private final String title;
    private final String description;
    private final BigDecimal priceRangeStart;
    private final BigDecimal priceRangeEnd;
    private final Integer minGuests;
    private final Integer maxGuests;
    private final boolean isAvailable;
    private final String vendorName;
    public final BigDecimal vendorRating;
    public final String vendorCity;
    private final Long vendorId; // nested DTO

    public VendorServiceDto(Long vendorServiceId,
                            Long serviceId,
                            String title,
                            String description,
                            BigDecimal priceRangeStart,
                            BigDecimal priceRangeEnd,
                            Integer minGuests,
                            Integer maxGuests,
                            boolean isAvailable,
                            String vendorName,
                            BigDecimal vendorRating,
                            String vendorCity,
                            Long vendorId) {
        this.vendorServiceId = vendorServiceId;
        this.serviceId = serviceId;
        this.title = title;
        this.description = description;
        this.priceRangeStart = priceRangeStart;
        this.priceRangeEnd = priceRangeEnd;
        this.minGuests = minGuests;
        this.maxGuests = maxGuests;
        this.isAvailable = isAvailable;
        this.vendorName = vendorName;
        this.vendorRating = vendorRating;
        this.vendorCity = vendorCity;
        this.vendorId = vendorId;
    }

    public Long getVendorServiceId() { return vendorServiceId; }
    public Long getServiceId() { return serviceId; }
    public String getTitle() { return title; }
    public String getDescription() { return description; }
    public BigDecimal getPriceRangeStart() { return priceRangeStart; }
    public BigDecimal getPriceRangeEnd() { return priceRangeEnd; }
    public Integer getMinGuests() { return minGuests; }
    public Integer getMaxGuests() { return maxGuests; }
    public boolean isAvailable() { return isAvailable; }
    public String getVendorName() { return vendorName; }
    public BigDecimal getVendorRating() { return vendorRating; }
    public String getVendorCity() { return vendorCity; }
    public Long getVendorId() { return vendorId; }

    /**
     * Map from JPA entity to DTO. Call this from your service layer (within transaction).
     */
    public static VendorServiceDto from(VendorService vs) {
        if (vs == null) return null;
        Long serviceId = (vs.getService() != null) ? vs.getService().getServiceId() : null;
        return new VendorServiceDto(
                vs.getVendorServiceId(),
                serviceId,
                vs.getTitle(),
                vs.getDescription(),
                vs.getPriceRangeStart(),
                vs.getPriceRangeEnd(),
                vs.getMinGuests(),
                vs.getMaxGuests(),
                vs.isAvailable(),
                vs.getVendor().getBusinessName(),
                vs.getVendor().getRating(),
                vs.getVendor().getCity(),
                vs.getVendor().getVendorId()
        );
    }
}

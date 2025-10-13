package Final.Year.Project.bmv.entity;

import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Entity
@Table(name = "vendor_profiles")
public class VendorProfile {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long vendorId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private Users user;

    @Column(nullable = false)
    private String businessName;

    @Column(columnDefinition = "TEXT")
    private String businessDescription;

    @Column(columnDefinition = "TEXT")
    private String businessAddress;

    private String city;
    private String state;
    private String country;
    private String pincode;
    private String businessPhone;
    private String businessEmail;

    @Column(columnDefinition = "TEXT")
    private String businessLogoUrl;

    private Integer yearsOfExperience;

    private boolean isFeatured = false;
    private boolean isApproved = false;

    @Column(precision = 3, scale = 2)
    private BigDecimal rating = new BigDecimal(0);

    private Integer totalReviews = 0;

    @Column(updatable = false)
    private LocalDateTime createdAt = LocalDateTime.now();

    private LocalDateTime updatedAt = LocalDateTime.now();
}

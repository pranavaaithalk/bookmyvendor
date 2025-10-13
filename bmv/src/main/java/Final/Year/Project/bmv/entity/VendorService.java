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
@Table(name = "vendor_services")
public class VendorService {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long vendorServiceId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "vendor_id", nullable = false)
    private VendorProfile vendor;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "service_id", nullable = false)
    private Services service;

    @Column(nullable = false)
    private String title;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(precision = 10, scale = 2)
    private BigDecimal priceRangeStart;

    @Column(precision = 10, scale = 2)
    private BigDecimal priceRangeEnd;

    private Integer minGuests;
    private Integer maxGuests;

    private boolean isAvailable = true;

    @Column(updatable = false)
    private LocalDateTime createdAt = LocalDateTime.now();

    private LocalDateTime updatedAt = LocalDateTime.now();
}

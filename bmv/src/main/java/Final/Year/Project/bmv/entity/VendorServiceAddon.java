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
@Table(name = "vendor_service_addons")
public class VendorServiceAddon {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long addonId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "vendor_service_id", nullable = false)
    private VendorService vendorService;

    @Column(nullable = false)
    private String name;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(precision = 10, scale = 2, nullable = false)
    private BigDecimal price;

    private boolean isAvailable = true;

    @Column(updatable = false)
    private LocalDateTime createdAt = LocalDateTime.now();

    private LocalDateTime updatedAt = LocalDateTime.now();
}


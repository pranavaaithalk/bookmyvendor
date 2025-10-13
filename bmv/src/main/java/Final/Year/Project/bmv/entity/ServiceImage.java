package Final.Year.Project.bmv.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Entity
@Table(name = "service_images")
public class ServiceImage {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long imageId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "vendor_service_id", nullable = false)
    private VendorService vendorService;

    @Column(columnDefinition = "TEXT", nullable = false)
    private String imageUrl;

    private boolean isPrimary = false;
    private String caption;

    @Column(updatable = false)
    private LocalDateTime createdAt = LocalDateTime.now();
}


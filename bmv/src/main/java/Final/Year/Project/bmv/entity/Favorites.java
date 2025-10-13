package Final.Year.Project.bmv.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Entity
@Table(name = "favorites", uniqueConstraints = {
        @UniqueConstraint(columnNames = {"user_id", "vendor_service_id"})
})
public class Favorites {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long favoriteId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private Users user;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "vendor_service_id", nullable = false)
    private VendorService vendorService;

    @Column(updatable = false)
    private LocalDateTime createdAt = LocalDateTime.now();
}


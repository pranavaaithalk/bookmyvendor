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
@Table(name = "booking_addons")
public class BookingAddon {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long bookingAddonId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "booking_id", nullable = false)
    private Bookings booking;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "addon_id", nullable = false)
    private VendorServiceAddon addon;

    @Column(nullable = false)
    private Integer quantity = 1;

    @Column(precision = 10, scale = 2, nullable = false)
    private BigDecimal pricePerUnit;

    @Column(updatable = false)
    private LocalDateTime createdAt = LocalDateTime.now();
}


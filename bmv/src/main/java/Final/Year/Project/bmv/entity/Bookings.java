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
@Table(name = "bookings")
public class Bookings {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long bookingId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "event_id", nullable = false)
    private Events event;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "vendor_service_id", nullable = false)
    private VendorService vendorService;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "vendor_id", nullable = false)
    private VendorProfile vendor;

    @Column(nullable = false)
    private LocalDateTime bookingDate;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private BookingStatus bookingStatus = BookingStatus.PENDING;

    @Column(precision = 10, scale = 2, nullable = false)
    private BigDecimal amount;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private PaymentStatus paymentStatus = PaymentStatus.PENDING;

    @Column(columnDefinition = "TEXT")
    private String notes;

    @Column(updatable = false)
    private LocalDateTime createdAt = LocalDateTime.now();

    private LocalDateTime updatedAt = LocalDateTime.now();

    public enum BookingStatus {
        PENDING, CONFIRMED, COMPLETED, CANCELLED, REJECTED
    }

    public enum PaymentStatus {
        PENDING, PARTIAL, COMPLETED, REFUNDED, FAILED
    }
}


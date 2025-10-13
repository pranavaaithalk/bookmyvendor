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
@Table(name = "payments")
public class Payments {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long paymentId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "booking_id", nullable = false)
    private Bookings booking;

    @Column(precision = 10, scale = 2, nullable = false)
    private BigDecimal amount;

    @Column(nullable = false, length = 50)
    private String paymentMethod;

    private String transactionId;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private PaymentStatus paymentStatus;

    private LocalDateTime paymentDate;

    @Column(columnDefinition = "TEXT")
    private String notes;

    @Column(updatable = false)
    private LocalDateTime createdAt = LocalDateTime.now();

    private LocalDateTime updatedAt = LocalDateTime.now();

    public enum PaymentStatus {
        PENDING, COMPLETED, FAILED, REFUNDED
    }
}


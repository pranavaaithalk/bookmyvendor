package Final.Year.Project.bmv.entity;

import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Entity
@Table(name = "service_requests")
public class ServiceRequest {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long requestId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "event_id", nullable = false)
    private Events event;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "service_id", nullable = false)
    private Services service;

    @Column(precision = 10, scale = 2)
    private BigDecimal budgetMin;

    @Column(precision = 10, scale = 2)
    private BigDecimal budgetMax;

    private Integer guestCount;

    private LocalDate eventDate;

    @Column(columnDefinition = "TEXT")
    private String requirements;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Status status = Status.OPEN;

    @Column(updatable = false)
    private LocalDateTime createdAt = LocalDateTime.now();

    private LocalDateTime updatedAt = LocalDateTime.now();

    public enum Status {
        OPEN, IN_PROGRESS, COMPLETED, CANCELLED
    }
}


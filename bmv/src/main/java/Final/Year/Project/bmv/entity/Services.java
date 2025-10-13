package Final.Year.Project.bmv.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Entity
@Table(name = "services")
public class Services {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long serviceId;

    @Column(nullable = false, length = 100)
    private String name;

    @Column(columnDefinition = "TEXT")
    private String description;

    private String iconUrl;

    private boolean isActive = true;

    @Column(updatable = false)
    private LocalDateTime createdAt = LocalDateTime.now();
}

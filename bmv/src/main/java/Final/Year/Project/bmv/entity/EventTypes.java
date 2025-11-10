package Final.Year.Project.bmv.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
@Entity
@Table
public class EventTypes {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long eventTypeId;

    @Column(nullable = false, length = 100)
    private String name;

    @Column(columnDefinition = "TEXT")
    private String description;

    private String iconUrl;

    private boolean isActive = true;

    @Column(updatable = false)
    private LocalDateTime createdAt = LocalDateTime.now();
}

package Final.Year.Project.bmv.dto;

import Final.Year.Project.bmv.entity.Notifications;
import lombok.*;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class NotificationDto {

    private Long notificationId;
    private Long userId;

    private String title;
    private String message;
    private String notificationType;
    private Long referenceId;

    private boolean isRead;
    private LocalDateTime createdAt;

    public static NotificationDto from(Notifications n) {
        return NotificationDto.builder()
                .notificationId(n.getNotificationId())
                .userId(n.getUser() != null ? n.getUser().getUserId() : null)
                .title(n.getTitle())
                .message(n.getMessage())
                .notificationType(n.getNotificationType())
                .referenceId(n.getReferenceId())
                .isRead(n.isRead())
                .createdAt(n.getCreatedAt())
                .build();
    }
}

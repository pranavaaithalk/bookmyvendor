package Final.Year.Project.bmv.service;

import Final.Year.Project.bmv.entity.Notifications;
import Final.Year.Project.bmv.repository.NotificationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class NotificationsService {

    @Autowired
    private NotificationRepository notificationsRepository;

    public Notifications createNotification(Notifications notification) {
        return notificationsRepository.save(notification);
    }

    public List<Notifications> getAllNotifications() {
        return notificationsRepository.findAll();
    }

    public Notifications getNotificationById(Long id) {
        return notificationsRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Notification not found: " + id));
    }

    public Notifications updateNotification(Long id, Notifications notificationDetails) {
        Notifications existing = getNotificationById(id);
        existing.setUser(notificationDetails.getUser());
        existing.setTitle(notificationDetails.getTitle());
        existing.setMessage(notificationDetails.getMessage());
        existing.setNotificationType(notificationDetails.getNotificationType());
        existing.setReferenceId(notificationDetails.getReferenceId());
        existing.setRead(notificationDetails.isRead());
        return notificationsRepository.save(existing);
    }

    public void deleteNotification(Long id) {
        notificationsRepository.deleteById(id);
    }
}

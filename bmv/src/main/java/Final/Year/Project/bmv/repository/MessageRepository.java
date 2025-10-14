package Final.Year.Project.bmv.repository;

import Final.Year.Project.bmv.entity.Messages;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface MessageRepository extends JpaRepository<Messages, Long> {
    List<Messages> findBySender_UserIdAndReceiver_UserIdOrSender_UserIdAndReceiver_UserIdOrderByCreatedAtAsc(Long senderId, Long receiverId, Long receiverId1, Long senderId1);

    List<Messages> findBySender_UserIdOrderByCreatedAtDesc(Long senderId);

    List<Messages> findByReceiver_UserIdOrderByCreatedAtDesc(Long receiverId);
}

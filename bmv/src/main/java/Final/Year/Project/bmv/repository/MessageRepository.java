package Final.Year.Project.bmv.repository;

import Final.Year.Project.bmv.entity.Messages;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface MessageRepository extends JpaRepository<Messages, Long> {
}

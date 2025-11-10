package Final.Year.Project.bmv.repository;

import Final.Year.Project.bmv.entity.EventTypes;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface EventTypeRepo extends JpaRepository<EventTypes,Long> {
}

package Final.Year.Project.bmv.repository;

import Final.Year.Project.bmv.entity.Reviews;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ReviewRepository extends JpaRepository<Reviews, Long> {
}


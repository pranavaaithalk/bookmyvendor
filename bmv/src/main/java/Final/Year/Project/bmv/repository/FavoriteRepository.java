package Final.Year.Project.bmv.repository;

import Final.Year.Project.bmv.entity.Favorites;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface FavoriteRepository extends JpaRepository<Favorites, Long> {
}

package Final.Year.Project.bmv.repository;

import Final.Year.Project.bmv.entity.VendorProfile;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface VendorProfileRepository extends JpaRepository<VendorProfile, Long> {
}


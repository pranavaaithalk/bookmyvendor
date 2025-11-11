package Final.Year.Project.bmv.repository;

import Final.Year.Project.bmv.entity.VendorProfile;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface VendorProfileRepository extends JpaRepository<VendorProfile, Long> {
    VendorProfile findByUser_UserId(Long userId);
}


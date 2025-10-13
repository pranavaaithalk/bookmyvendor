package Final.Year.Project.bmv.repository;

import Final.Year.Project.bmv.entity.VendorServiceAddon;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface VendorServiceAddonRepository extends JpaRepository<VendorServiceAddon, Long> {
}


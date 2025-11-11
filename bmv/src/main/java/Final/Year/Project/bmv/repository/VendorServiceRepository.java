package Final.Year.Project.bmv.repository;

import Final.Year.Project.bmv.entity.VendorService;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface VendorServiceRepository extends JpaRepository<VendorService, Long> {
    List<VendorService> findByVendor_VendorId(Long vendorId);
}


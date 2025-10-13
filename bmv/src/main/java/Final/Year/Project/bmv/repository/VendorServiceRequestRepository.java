package Final.Year.Project.bmv.repository;

import Final.Year.Project.bmv.entity.VendorServiceRequest;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface VendorServiceRequestRepository extends JpaRepository<VendorServiceRequest, Long> {
    List<VendorServiceRequest> findByVendor_VendorIdAndStatus(Long vendorId, VendorServiceRequest.Status status);
}


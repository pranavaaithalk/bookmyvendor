package Final.Year.Project.bmv.repository;

import Final.Year.Project.bmv.entity.Reviews;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ReviewRepository extends JpaRepository<Reviews, Long> {
    boolean existsByBooking_VendorServiceRequest_VendorRequestId(Long vendorServiceRequestId);
    List<Reviews> findByVendor_UserId(Long userId);

}


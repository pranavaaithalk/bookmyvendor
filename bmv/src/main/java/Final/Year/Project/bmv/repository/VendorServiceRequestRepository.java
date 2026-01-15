package Final.Year.Project.bmv.repository;

import Final.Year.Project.bmv.entity.VendorServiceRequest;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface VendorServiceRequestRepository extends JpaRepository<VendorServiceRequest, Long> {
    List<VendorServiceRequest> findByVendor_VendorIdAndStatus(Long vendorId, VendorServiceRequest.Status status);
    List<VendorServiceRequest> findByVendor_VendorId(Long vendorId);
    @Query("""
        select vsr.vendor.vendorId
        from VendorServiceRequest vsr
        where vsr.serviceRequest.requestId = :requestId
          and vsr.status = 'REJECTED'
    """)
    List<Long> findRejectedVendorIds(@Param("requestId") Long requestId);

    List<VendorServiceRequest> findByServiceRequest_RequestIdAndStatusIn(Long requestId, List<VendorServiceRequest.Status> list);
    List<VendorServiceRequest> findByServiceRequest_Event_EventId(Long eventId);

}


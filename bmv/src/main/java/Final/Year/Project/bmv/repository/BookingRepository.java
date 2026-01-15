package Final.Year.Project.bmv.repository;

import Final.Year.Project.bmv.entity.Bookings;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface BookingRepository extends JpaRepository<Bookings, Long> {
    List<Bookings> findByVendor_VendorId(Long vendorId);
    Optional<Bookings> findByEvent_EventIdAndVendor_VendorIdAndVendorServiceRequest_VendorRequestId(
            Long eventId,
            Long vendorId,
            Long vendorServiceRequestId
    );
    List<Bookings> findByEvent_EventId(Long eventId);


}


package Final.Year.Project.bmv.repository;

import Final.Year.Project.bmv.entity.Bookings;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface BookingRepository extends JpaRepository<Bookings, Long> {
    List<Bookings> findByVendor_VendorId(Long vendorId);
}


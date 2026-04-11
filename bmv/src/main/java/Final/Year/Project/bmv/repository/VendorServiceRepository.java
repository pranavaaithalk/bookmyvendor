package Final.Year.Project.bmv.repository;

import Final.Year.Project.bmv.entity.VendorService;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

@Repository
public interface VendorServiceRepository extends JpaRepository<VendorService, Long> {
    List<VendorService> findByVendor_VendorId(Long vendorId);

    @Query("""
        select vs from VendorService vs
        where vs.service.serviceId = :serviceId
          and lower(vs.vendor.city) = lower(:city)
          and vs.isAvailable = true
          and (:guestCount is null or vs.minGuests is null or :guestCount >= vs.minGuests)
          and (:guestCount is null or vs.maxGuests is null or :guestCount <= vs.maxGuests)
    """)
    Page<VendorService> findTopVendorsForService(@Param("serviceId") Long serviceId,
                                                @Param("city") String city,
                                                @Param("guestCount") Integer guestCount,
                                                Pageable pageable);
}


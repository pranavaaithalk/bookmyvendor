package Final.Year.Project.bmv.service;

import Final.Year.Project.bmv.entity.VendorAvailability;
import Final.Year.Project.bmv.repository.VendorAvailabilityRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class VendorAvailabilityService {

    @Autowired
    private VendorAvailabilityRepository vendorAvailabilityRepository;

    public VendorAvailability createVendorAvailability(VendorAvailability vendorAvailability) {
        return vendorAvailabilityRepository.save(vendorAvailability);
    }

    public List<VendorAvailability> getAllVendorAvailabilities() {
        return vendorAvailabilityRepository.findAll();
    }

    public VendorAvailability getVendorAvailabilityById(Long id) {
        return vendorAvailabilityRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("VendorAvailability not found: " + id));
    }

    public VendorAvailability updateVendorAvailability(Long id, VendorAvailability vendorAvailabilityDetails) {
        VendorAvailability existing = getVendorAvailabilityById(id);
        existing.setVendor(vendorAvailabilityDetails.getVendor());
        existing.setDayOfWeek(vendorAvailabilityDetails.getDayOfWeek());
        existing.setStartTime(vendorAvailabilityDetails.getStartTime());
        existing.setEndTime(vendorAvailabilityDetails.getEndTime());
        existing.setAvailable(vendorAvailabilityDetails.isAvailable());
        existing.setUpdatedAt(vendorAvailabilityDetails.getUpdatedAt());
        return vendorAvailabilityRepository.save(existing);
    }

    public void deleteVendorAvailability(Long id) {
        vendorAvailabilityRepository.deleteById(id);
    }
}

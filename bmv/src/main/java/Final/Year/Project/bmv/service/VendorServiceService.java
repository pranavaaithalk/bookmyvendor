package Final.Year.Project.bmv.service;

import Final.Year.Project.bmv.entity.VendorService;
import Final.Year.Project.bmv.repository.VendorServiceRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class VendorServiceService {

    @Autowired
    private VendorServiceRepository vendorServiceRepository;

    public VendorService createVendorService(VendorService vendorService) {
        return vendorServiceRepository.save(vendorService);
    }

    public List<VendorService> getAllVendorServices() {
        return vendorServiceRepository.findAll();
    }

    public VendorService getVendorServiceById(Long id) {
        return vendorServiceRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("VendorService not found: " + id));
    }

    public VendorService updateVendorService(Long id, VendorService vendorServiceDetails) {
        VendorService existing = getVendorServiceById(id);
        existing.setVendor(vendorServiceDetails.getVendor());
        existing.setService(vendorServiceDetails.getService());
        existing.setTitle(vendorServiceDetails.getTitle());
        existing.setDescription(vendorServiceDetails.getDescription());
        existing.setPriceRangeStart(vendorServiceDetails.getPriceRangeStart());
        existing.setPriceRangeEnd(vendorServiceDetails.getPriceRangeEnd());
        existing.setMinGuests(vendorServiceDetails.getMinGuests());
        existing.setMaxGuests(vendorServiceDetails.getMaxGuests());
        existing.setAvailable(vendorServiceDetails.isAvailable());
        existing.setUpdatedAt(vendorServiceDetails.getUpdatedAt());
        return vendorServiceRepository.save(existing);
    }

    public void deleteVendorService(Long id) {
        vendorServiceRepository.deleteById(id);
    }
}

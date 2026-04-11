package Final.Year.Project.bmv.service;

import Final.Year.Project.bmv.entity.VendorService;
import Final.Year.Project.bmv.repository.VendorServiceRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;

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

    public List<VendorService> getAllVendorServicesByVendorId(Long id){
        return vendorServiceRepository.findByVendor_VendorId(id);
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

    /**
     * DB-backed query to fetch top vendors for a service in a city with guest count constraints.
     * Excludes any vendor ids passed in excludedVendorIds (filtering done after DB fetch).
     */
    public List<VendorService> findTopVendorsForService(Long serviceId, String city, Integer guestCount, List<Long> excludedVendorIds) {
        // fetch a slightly larger page from DB, then apply exclusion and limit to desired size
        PageRequest pr = PageRequest.of(0, 15, Sort.by(Sort.Direction.DESC, "vendor.rating"));
        var page = vendorServiceRepository.findTopVendorsForService(serviceId, city, guestCount, pr);
        List<VendorService> list = page.getContent();
        if (excludedVendorIds != null && !excludedVendorIds.isEmpty()) {
            list = list.stream()
                    .filter(vs -> vs.getVendor() == null || !excludedVendorIds.contains(vs.getVendor().getVendorId()))
                    .collect(Collectors.toList());
        }
        return list.stream().limit(5).collect(Collectors.toList());
    }

}

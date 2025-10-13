package Final.Year.Project.bmv.service;

import Final.Year.Project.bmv.entity.VendorServiceAddon;
import Final.Year.Project.bmv.repository.VendorServiceAddonRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class VendorServiceAddonService {

    @Autowired
    private VendorServiceAddonRepository vendorServiceAddonRepository;

    public VendorServiceAddon createVendorServiceAddon(VendorServiceAddon vendorServiceAddon) {
        return vendorServiceAddonRepository.save(vendorServiceAddon);
    }

    public List<VendorServiceAddon> getAllVendorServiceAddons() {
        return vendorServiceAddonRepository.findAll();
    }

    public VendorServiceAddon getVendorServiceAddonById(Long id) {
        return vendorServiceAddonRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("VendorServiceAddon not found: " + id));
    }

    public VendorServiceAddon updateVendorServiceAddon(Long id, VendorServiceAddon vendorServiceAddonDetails) {
        VendorServiceAddon existing = getVendorServiceAddonById(id);
        existing.setVendorService(vendorServiceAddonDetails.getVendorService());
        existing.setName(vendorServiceAddonDetails.getName());
        existing.setDescription(vendorServiceAddonDetails.getDescription());
        existing.setPrice(vendorServiceAddonDetails.getPrice());
        existing.setAvailable(vendorServiceAddonDetails.isAvailable());
        existing.setUpdatedAt(vendorServiceAddonDetails.getUpdatedAt());
        return vendorServiceAddonRepository.save(existing);
    }

    public void deleteVendorServiceAddon(Long id) {
        vendorServiceAddonRepository.deleteById(id);
    }
}

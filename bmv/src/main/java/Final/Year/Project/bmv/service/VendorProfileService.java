package Final.Year.Project.bmv.service;

import Final.Year.Project.bmv.entity.VendorAvailability;
import Final.Year.Project.bmv.entity.VendorProfile;
import Final.Year.Project.bmv.repository.VendorProfileRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class VendorProfileService {

    @Autowired
    private VendorProfileRepository vendorProfileRepository;

    public VendorProfile createVendorProfile(VendorProfile vendorProfile) {
        return vendorProfileRepository.save(vendorProfile);
    }

    public List<VendorProfile> getAllVendorProfiles() {
        return vendorProfileRepository.findAll();
    }

    public VendorProfile getVendorProfileById(Long id) {
        return vendorProfileRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("VendorProfile not found: " + id));
    }

    public VendorProfile updateVendorProfile(Long id, VendorProfile vendorProfileDetails) {
        VendorProfile existing = getVendorProfileById(id);
        existing.setUser(vendorProfileDetails.getUser());
        existing.setBusinessName(vendorProfileDetails.getBusinessName());
        existing.setBusinessDescription(vendorProfileDetails.getBusinessDescription());
        existing.setBusinessAddress(vendorProfileDetails.getBusinessAddress());
        existing.setCity(vendorProfileDetails.getCity());
        existing.setState(vendorProfileDetails.getState());
        existing.setCountry(vendorProfileDetails.getCountry());
        existing.setPincode(vendorProfileDetails.getPincode());
        existing.setBusinessPhone(vendorProfileDetails.getBusinessPhone());
        existing.setBusinessEmail(vendorProfileDetails.getBusinessEmail());
        existing.setBusinessLogoUrl(vendorProfileDetails.getBusinessLogoUrl());
        existing.setYearsOfExperience(vendorProfileDetails.getYearsOfExperience());
        existing.setFeatured(vendorProfileDetails.isFeatured());
        existing.setApproved(vendorProfileDetails.isApproved());
        existing.setRating(vendorProfileDetails.getRating());
        existing.setTotalReviews(vendorProfileDetails.getTotalReviews());
        existing.setUpdatedAt(vendorProfileDetails.getUpdatedAt());
        return vendorProfileRepository.save(existing);
    }

    public void deleteVendorProfile(Long id) {
        vendorProfileRepository.deleteById(id);
    }

//    public List<VendorProfile> getVendorsByCityAndService(String city){
//        return vendorProfileRepository.findByCityOrderByReviewsDesc(city);
//    }
}

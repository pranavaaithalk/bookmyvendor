package Final.Year.Project.bmv.controller;

import Final.Year.Project.bmv.entity.VendorProfile;
import Final.Year.Project.bmv.entity.VendorServiceRequest;
import Final.Year.Project.bmv.service.VendorProfileService;
import Final.Year.Project.bmv.service.VendorServiceRequestService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/vendors")
@CrossOrigin(origins = "http://localhost:3000")
public class VendorController {

    @Autowired
    private VendorProfileService vendorProfileService;

    @Autowired
    private VendorServiceRequestService vendorServiceRequestService;

    // 1. Get list of new service requests for vendor
    @GetMapping("/requests/new")
    public ResponseEntity<List<VendorServiceRequest>> showNewRequests(@RequestBody Long vendorId) {
        List<VendorServiceRequest> newRequests = vendorServiceRequestService.getNewRequestsForVendor(vendorId);
        return ResponseEntity.ok(newRequests);
    }

    // 2. Accept a service request
    @PostMapping("/requests/{requestId}/accept")
    public ResponseEntity<String> acceptRequest(@PathVariable Long requestId, @RequestBody Long vendorId) {
        boolean success = vendorServiceRequestService.acceptRequest(requestId, vendorId);
        if (success) {
            return ResponseEntity.ok("Service request accepted");
        } else {
            return ResponseEntity.badRequest().body("Could not accept request");
        }
    }

    // 3. Decline a service request
    @PostMapping("/requests/{requestId}/decline")
    public ResponseEntity<String> declineRequest(@PathVariable Long requestId, @RequestBody Long vendorId) {
        boolean success = vendorServiceRequestService.declineRequest(requestId, vendorId);
        if (success) {
            return ResponseEntity.ok("Service request declined");
        } else {
            return ResponseEntity.badRequest().body("Could not decline request");
        }
    }

    // Create Vendor Profile
    // Expects map with vendor profile fields such as:
    // "userId", "businessName", "businessDescription", "businessAddress", "city", "state", "country",
    // "pincode", "businessPhone", "businessEmail", "businessLogoUrl", "yearsOfExperience", "isFeatured", "isApproved", "rating", "totalReviews"
    @PostMapping("/profile")
    public ResponseEntity<VendorProfile> createVendorProfile(@RequestBody Map<String, String> map) {
        // Extract and build VendorProfile from map
        VendorProfile profile = VendorProfile.builder()
                // You need to fetch associated User entity by userId separately and set here
                // Example: userService.getUserById(Long.parseLong(map.get("userId")))
                .businessName(map.get("businessName"))
                .businessDescription(map.get("businessDescription"))
                .businessAddress(map.get("businessAddress"))
                .city(map.get("city"))
                .state(map.get("state"))
                .country(map.get("country"))
                .pincode(map.get("pincode"))
                .businessPhone(map.get("businessPhone"))
                .businessEmail(map.get("businessEmail"))
                .businessLogoUrl(map.get("businessLogoUrl"))
                .yearsOfExperience(map.containsKey("yearsOfExperience") ? Integer.parseInt(map.get("yearsOfExperience")) : null)
                .isFeatured(Boolean.parseBoolean(map.getOrDefault("isFeatured", "false")))
                .isApproved(Boolean.parseBoolean(map.getOrDefault("isApproved", "false")))
                .rating(map.containsKey("rating") ? new java.math.BigDecimal(map.get("rating")) : java.math.BigDecimal.ZERO)
                .totalReviews(map.containsKey("totalReviews") ? Integer.parseInt(map.get("totalReviews")) : 0)
                .build();

        VendorProfile createdProfile = vendorProfileService.createVendorProfile(profile);
        return ResponseEntity.ok(createdProfile);
    }

    // Update Vendor Profile
    // Expects vendorId path param and map with fields to update like create API
    @PutMapping("/profile/{vendorId}")
    public ResponseEntity<VendorProfile> updateVendorProfile(@PathVariable Long vendorId, @RequestBody Map<String, String> map) {
        VendorProfile existing = vendorProfileService.getVendorProfileById(vendorId);
        if (map.containsKey("businessName")) existing.setBusinessName(map.get("businessName"));
        if (map.containsKey("businessDescription")) existing.setBusinessDescription(map.get("businessDescription"));
        if (map.containsKey("businessAddress")) existing.setBusinessAddress(map.get("businessAddress"));
        if (map.containsKey("city")) existing.setCity(map.get("city"));
        if (map.containsKey("state")) existing.setState(map.get("state"));
        if (map.containsKey("country")) existing.setCountry(map.get("country"));
        if (map.containsKey("pincode")) existing.setPincode(map.get("pincode"));
        if (map.containsKey("businessPhone")) existing.setBusinessPhone(map.get("businessPhone"));
        if (map.containsKey("businessEmail")) existing.setBusinessEmail(map.get("businessEmail"));
        if (map.containsKey("businessLogoUrl")) existing.setBusinessLogoUrl(map.get("businessLogoUrl"));
        if (map.containsKey("yearsOfExperience")) existing.setYearsOfExperience(Integer.parseInt(map.get("yearsOfExperience")));
        if (map.containsKey("isFeatured")) existing.setFeatured(Boolean.parseBoolean(map.get("isFeatured")));
        if (map.containsKey("isApproved")) existing.setApproved(Boolean.parseBoolean(map.get("isApproved")));
        if (map.containsKey("rating")) existing.setRating(new java.math.BigDecimal(map.get("rating")));
        if (map.containsKey("totalReviews")) existing.setTotalReviews(Integer.parseInt(map.get("totalReviews")));
        existing.setUpdatedAt(java.time.LocalDateTime.now());

        VendorProfile updatedProfile = vendorProfileService.updateVendorProfile(vendorId, existing);
        return ResponseEntity.ok(updatedProfile);
    }

    // Get all vendor profiles
    @GetMapping("/profiles")
    public ResponseEntity<List<VendorProfile>> getAllVendorProfiles() {
        return ResponseEntity.ok(vendorProfileService.getAllVendorProfiles());
    }

    // Get vendor profile by id
    @GetMapping("/profile/{vendorId}")
    public ResponseEntity<VendorProfile> getVendorProfileById(@PathVariable Long vendorId) {
        return ResponseEntity.ok(vendorProfileService.getVendorProfileById(vendorId));
    }

    // Delete vendor profile by id
    @DeleteMapping("/profile/{vendorId}")
    public ResponseEntity<Void> deleteVendorProfile(@PathVariable Long vendorId) {
        vendorProfileService.deleteVendorProfile(vendorId);
        return ResponseEntity.noContent().build();
    }
}

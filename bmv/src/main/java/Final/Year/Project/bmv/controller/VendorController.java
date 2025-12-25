package Final.Year.Project.bmv.controller;

import Final.Year.Project.bmv.dto.VendorProfileDto;
import Final.Year.Project.bmv.entity.*;
import Final.Year.Project.bmv.service.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.Arrays;
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

    @Autowired
    private UsersService usersService;

    @Autowired
    ServicesService servicesService;

    @Autowired
    VendorServiceService vendorServiceService;

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
    public ResponseEntity<?> createVendorProfile(@RequestBody Map<String, String> map) {
        System.out.println(map.toString());
        try{
        // Extract and build VendorProfile from map
        Users user = usersService.getUserById(Long.parseLong(map.get("userId")));
        if(user == null){
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("User Not Found");
        }
        VendorProfile profile = VendorProfile.builder()
                .user(user)
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
                .totalRevenue(0)
                .yearsOfExperience(map.containsKey("yearsOfExperience") ? Integer.parseInt(map.get("yearsOfExperience")) : null)
                .isFeatured(Boolean.parseBoolean(map.getOrDefault("isFeatured", "false")))
                .isApproved(Boolean.parseBoolean(map.getOrDefault("isApproved", "false")))
                .rating(map.containsKey("rating") ? new java.math.BigDecimal(map.get("rating")) : java.math.BigDecimal.ZERO)
                .totalReviews(map.containsKey("totalReviews") ? Integer.parseInt(map.get("totalReviews")) : 0)
                .build();

        VendorProfile createdProfile = vendorProfileService.createVendorProfile(profile);

            if (map.containsKey("servicesProvided")) {
                String raw = map.get("servicesProvided");
                List<Long> serviceIds = new ArrayList<>();

                // Try JSON parsing first (from frontend JSON.stringify)
                try {
                    com.fasterxml.jackson.databind.ObjectMapper mapper = new com.fasterxml.jackson.databind.ObjectMapper();
                    serviceIds = Arrays.asList(mapper.readValue(raw, Long[].class));
                } catch (Exception e) {
                    // Fallback to comma-separated string
                    if (raw != null && !raw.isEmpty()) {
                        serviceIds = Arrays.stream(raw.split(","))
                                .map(String::trim)
                                .filter(s -> !s.isEmpty())
                                .map(Long::parseLong)
                                .collect(java.util.stream.Collectors.toList());
                    }
                }

                // If there are valid service IDs
                if (!serviceIds.isEmpty()) {
                    for (Long serviceId : serviceIds) {
                        Services serviceEntity = servicesService.getServiceById(serviceId);
                        if (serviceEntity == null) continue;

                        VendorService vendorService = VendorService.builder()
                                .vendor(createdProfile)
                                .service(serviceEntity)
                                .title(serviceEntity.getName())
                                .description(serviceEntity.getDescription())
                                .priceRangeStart(BigDecimal.ZERO)
                                .priceRangeEnd(BigDecimal.ZERO)
                                .minGuests(null)
                                .maxGuests(null)
                                .isAvailable(true)
                                .createdAt(java.time.LocalDateTime.now())
                                .updatedAt(java.time.LocalDateTime.now())
                                .build();

                        vendorServiceService.createVendorService(vendorService);
                    }
                }
            }
            return ResponseEntity.ok(Map.of("vendorId",createdProfile.getVendorId(),"userId",createdProfile.getUser().getUserId()));
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.internalServerError().body("Error creating vendor profile: " + e.getMessage());
        }
    }

    // Update Vendor Profile
    // Expects vendorId path param and map with fields to update like create API
    @PutMapping("/profile/{vendorId}")
    public ResponseEntity<?> updateVendorProfile(@PathVariable Long vendorId, @RequestBody Map<String, String> map) {
        try {
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
            if (map.containsKey("yearsOfExperience"))
                existing.setYearsOfExperience(Integer.parseInt(map.get("yearsOfExperience")));
            if (map.containsKey("isFeatured")) existing.setFeatured(Boolean.parseBoolean(map.get("isFeatured")));
            if (map.containsKey("isApproved")) existing.setApproved(Boolean.parseBoolean(map.get("isApproved")));
            if (map.containsKey("rating")) existing.setRating(BigDecimal.ZERO);
            if (map.containsKey("totalReviews")) existing.setTotalReviews(0);
            existing.setUpdatedAt(java.time.LocalDateTime.now());

            VendorProfile updatedProfile = vendorProfileService.updateVendorProfile(vendorId, existing);
            return ResponseEntity.ok(VendorProfileDto.from(updatedProfile,null));
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.internalServerError().body("Error updating vendor profile: " + e.getMessage());
        }
    }

    // Get all vendor profiles
    @GetMapping("/profiles")
    public ResponseEntity<List<VendorProfile>> getAllVendorProfiles() {
        return ResponseEntity.ok(vendorProfileService.getAllVendorProfiles());
    }

    // Get vendor profile by id
    @GetMapping("/profile/{vendorId}")
    @Transactional(readOnly = true)
    public ResponseEntity<VendorProfileDto> getVendorProfileById(@PathVariable Long vendorId) {
        VendorProfile vp = vendorProfileService.getVendorProfileById(vendorId);
        if (vp == null) {
            return ResponseEntity.notFound().build();
        }
        List<VendorService> vendorServices = vendorServiceService.getAllVendorServicesByVendorId(vendorId);
        VendorProfileDto dto = VendorProfileDto.from(vp, vendorServices);
        return ResponseEntity.ok(dto);
    }

    // Delete vendor profile by id
    @DeleteMapping("/profile/{vendorId}")
    public ResponseEntity<Void> deleteVendorProfile(@PathVariable Long vendorId) {
        vendorProfileService.deleteVendorProfile(vendorId);
        return ResponseEntity.noContent().build();
    }
}

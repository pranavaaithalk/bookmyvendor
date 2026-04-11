package Final.Year.Project.bmv.controller;

import Final.Year.Project.bmv.dto.VendorInvitePublicResponse;
import Final.Year.Project.bmv.service.VendorInviteService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 * Public (unauthenticated) read for vendor invite tokens used in SMS deep links.
 */
@RestController
@RequestMapping("/api/public/vendor-invite")
public class PublicVendorInviteController {

    private final VendorInviteService vendorInviteService;

    public PublicVendorInviteController(VendorInviteService vendorInviteService) {
        this.vendorInviteService = vendorInviteService;
    }

    @GetMapping("/{token}")
    public ResponseEntity<VendorInvitePublicResponse> getInvite(@PathVariable String token) {
        return ResponseEntity.ok(vendorInviteService.getPublicResponse(token));
    }
}

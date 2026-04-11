package Final.Year.Project.bmv.controller;

import Final.Year.Project.bmv.service.TwillioService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;


@RestController
@RequestMapping("/api/test")
public class TestController {

    private final TwillioService twillioService;

    @Autowired
    public TestController(TwillioService twillioService) {
        this.twillioService = twillioService;
    }

    // Simple DTO for the test endpoint
    public static class WhatsAppInviteRequest {
        public String phone;
        public String vendorName;
        public String event;
        public String service;
        public String date;
    }

    @PostMapping("/whatsapp-invite")
    public ResponseEntity<String> sendWhatsAppInvite(@RequestBody WhatsAppInviteRequest req) {
        System.out.println("Received WhatsApp invite request: " + req);
        if (req == null) return ResponseEntity.badRequest().body("request body is required");

        try {
            twillioService.sendVendorInvite(req.phone, req.vendorName == null ? "" : req.vendorName,
                    req.event == null ? "" : req.event,
                    req.service == null ? "" : req.service,
                    req.date == null ? "" : req.date);
            return ResponseEntity.ok("invitation-sent");
        } catch (Exception ex) {
            return ResponseEntity.status(500).body("error-sending-invite: " + ex.getMessage());
        }
    }
}


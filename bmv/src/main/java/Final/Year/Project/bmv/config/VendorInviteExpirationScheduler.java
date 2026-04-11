package Final.Year.Project.bmv.config;

import Final.Year.Project.bmv.service.VendorInviteService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

@Component
public class VendorInviteExpirationScheduler {

    private static final Logger log = LoggerFactory.getLogger(VendorInviteExpirationScheduler.class);

    private final VendorInviteService vendorInviteService;

    public VendorInviteExpirationScheduler(VendorInviteService vendorInviteService) {
        this.vendorInviteService = vendorInviteService;
    }

    @Scheduled(fixedDelayString = "${VENDOR_INVITE_EXPIRE_CHECK_MS:600000}", initialDelayString = "60000")
    public void expirePendingInvites() {
        try {
            int n = vendorInviteService.expireDueInvites();
            if (n > 0) {
                log.info("Expired {} pending vendor invite(s)", n);
            }
        } catch (Exception ex) {
            log.error("Vendor invite expiry job failed: {}", ex.getMessage());
        }
    }
}

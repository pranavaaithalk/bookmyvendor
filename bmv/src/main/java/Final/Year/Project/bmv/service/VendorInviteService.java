package Final.Year.Project.bmv.service;

import Final.Year.Project.bmv.dto.VendorInvitePublicResponse;
import Final.Year.Project.bmv.entity.*;
import Final.Year.Project.bmv.repository.ServiceRequestRepository;
import Final.Year.Project.bmv.repository.VendorInviteRepository;
import Final.Year.Project.bmv.repository.VendorServiceRequestRepository;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
public class VendorInviteService {

    private final VendorInviteRepository vendorInviteRepository;
    private final VendorServiceRequestRepository vendorServiceRequestRepository;
    private final ServiceRequestRepository serviceRequestRepository;
    private final NotificationsService notificationsService;
    private final TwillioService twillioService;

    @Value("${APP_PUBLIC_BASE_URL:https://bmvindia.online}")
    private String publicBaseUrl;

    @Value("${VENDOR_INVITE_EXPIRY_HOURS:48}")
    private int expiryHours;

    public VendorInviteService(
            VendorInviteRepository vendorInviteRepository,
            VendorServiceRequestRepository vendorServiceRequestRepository,
            ServiceRequestRepository serviceRequestRepository,
            NotificationsService notificationsService,
            TwillioService twillioService
    ) {
        this.vendorInviteRepository = vendorInviteRepository;
        this.vendorServiceRequestRepository = vendorServiceRequestRepository;
        this.serviceRequestRepository = serviceRequestRepository;
        this.notificationsService = notificationsService;
        this.twillioService = twillioService;
    }

    public String buildSignupUrl(String token) {
        String base = publicBaseUrl == null ? "" : publicBaseUrl.trim();
        if (base.endsWith("/")) {
            base = base.substring(0, base.length() - 1);
        }
        return base + "/auth?vendorInvite=" + token;
    }

    @Transactional
    public VendorInvite createForGoogleVendor(
            ServiceRequest serviceRequest,
            String contactPhone,
            String vendorDisplayName,
            String googlePlaceId
    ) {
        String token = UUID.randomUUID().toString().replace("-", "");
        LocalDateTime now = LocalDateTime.now();
        VendorInvite inv = VendorInvite.builder()
                .token(token)
                .serviceRequest(serviceRequest)
                .status(VendorInvite.Status.PENDING)
                .expiresAt(now.plusHours(expiryHours))
                .googlePlaceId(googlePlaceId)
                .vendorDisplayName(vendorDisplayName)
                .contactPhone(contactPhone)
                .createdAt(now)
                .updatedAt(now)
                .build();
        return vendorInviteRepository.save(inv);
    }

    @Transactional(readOnly = true)
    public VendorInvitePublicResponse getPublicResponse(String token) {
        LocalDateTime now = LocalDateTime.now();
        Optional<VendorInvite> opt = vendorInviteRepository.findByToken(token);
        if (opt.isEmpty()) {
            return VendorInvitePublicResponse.builder()
                    .valid(false)
                    .expired(false)
                    .consumed(false)
                    .build();
        }
        VendorInvite inv = opt.get();
        if (inv.getStatus() == VendorInvite.Status.CONSUMED) {
            return VendorInvitePublicResponse.builder()
                    .valid(false)
                    .expired(false)
                    .consumed(true)
                    .expiresAt(inv.getExpiresAt())
                    .build();
        }
        if (inv.getStatus() == VendorInvite.Status.EXPIRED || inv.getExpiresAt().isBefore(now)) {
            return VendorInvitePublicResponse.builder()
                    .valid(false)
                    .expired(true)
                    .consumed(false)
                    .expiresAt(inv.getExpiresAt())
                    .build();
        }

        ServiceRequest sr = inv.getServiceRequest();
        Events ev = sr.getEvent();
        Services svc = sr.getService();
        BigDecimal budgetMax = sr.getBudgetMax() != null ? sr.getBudgetMax() : BigDecimal.ZERO;

        String city = ev != null ? firstLineOrWord(ev.getVenueAddress()) : "";

        return VendorInvitePublicResponse.builder()
                .valid(true)
                .expired(false)
                .consumed(false)
                .expiresAt(inv.getExpiresAt())
                .signupUrl(buildSignupUrl(token))
                .vendorDisplayName(inv.getVendorDisplayName())
                .contactPhone(inv.getContactPhone())
                .googlePlaceId(inv.getGooglePlaceId())
                .serviceRequestId(sr.getRequestId())
                .serviceId(svc != null ? svc.getServiceId() : null)
                .serviceName(svc != null ? svc.getName() : null)
                .eventId(ev != null ? ev.getEventId() : null)
                .eventTitle(ev != null ? ev.getTitle() : null)
                .eventDate(sr.getEventDate() != null ? sr.getEventDate().toString() : (ev != null && ev.getEventDate() != null ? ev.getEventDate().toString() : null))
                .venueAddress(ev != null ? ev.getVenueAddress() : null)
                .budgetMax(budgetMax.toPlainString())
                .guestCount(sr.getGuestCount())
                .suggestedBusinessName(inv.getVendorDisplayName())
                .suggestedCity(city)
                .suggestedBusinessPhone(inv.getContactPhone())
                .suggestedBusinessAddress(ev != null ? ev.getVenueAddress() : null)
                .build();
    }

    @Transactional
    public VendorServiceRequest attachToVendorProfile(String token, VendorProfile vendorProfile) {
        VendorInvite inv = vendorInviteRepository.findByToken(token)
                .orElseThrow(() -> new IllegalArgumentException("Invalid invite token"));
        if (inv.getStatus() != VendorInvite.Status.PENDING) {
            throw new IllegalStateException("Invite is no longer valid");
        }
        if (inv.getExpiresAt().isBefore(LocalDateTime.now())) {
            throw new IllegalStateException("Invite has expired");
        }
        Users user = vendorProfile.getUser();
        if (user == null || user.getUserType() != Users.UserType.VENDOR) {
            throw new IllegalStateException("Only vendor accounts can complete this invite");
        }

        ServiceRequest sr = inv.getServiceRequest();
        if (sr.getStatus() == ServiceRequest.Status.CANCELLED) {
            throw new IllegalStateException("This service request is no longer active");
        }

        Optional<VendorServiceRequest> existing = vendorServiceRequestRepository
                .findByServiceRequest_RequestIdAndVendor_VendorId(sr.getRequestId(), vendorProfile.getVendorId());
        if (existing.isPresent()) {
            inv.setStatus(VendorInvite.Status.CONSUMED);
            inv.setConsumedVendor(vendorProfile);
            inv.setConsumedAt(LocalDateTime.now());
            inv.setUpdatedAt(LocalDateTime.now());
            vendorInviteRepository.save(inv);
            return existing.get();
        }

        VendorServiceRequest vsr = VendorServiceRequest.builder()
                .serviceRequest(sr)
                .vendor(vendorProfile)
                .proposedAmount(sr.getBudgetMax() != null ? sr.getBudgetMax() : BigDecimal.ZERO)
                .message("Service request from client (Google vendor invite)")
                .status(VendorServiceRequest.Status.PENDING)
                .createdAt(LocalDateTime.now())
                .updatedAt(LocalDateTime.now())
                .build();
        vsr = vendorServiceRequestRepository.save(vsr);

        inv.setStatus(VendorInvite.Status.CONSUMED);
        inv.setConsumedVendor(vendorProfile);
        inv.setConsumedAt(LocalDateTime.now());
        inv.setUpdatedAt(LocalDateTime.now());
        vendorInviteRepository.save(inv);

        if (sr.getStatus() == ServiceRequest.Status.OPEN) {
            sr.setStatus(ServiceRequest.Status.IN_PROGRESS);
            sr.setUpdatedAt(LocalDateTime.now());
            serviceRequestRepository.save(sr);
        }

        return vsr;
    }

    @Transactional
    public int expireDueInvites() {
        LocalDateTime now = LocalDateTime.now();
        List<VendorInvite> due = vendorInviteRepository.findAllByStatusAndExpiresAtBefore(VendorInvite.Status.PENDING, now);
        int count = 0;
        for (VendorInvite inv : due) {
            expireOne(inv, now);
            count++;
        }
        return count;
    }

    private void expireOne(VendorInvite inv, LocalDateTime now) {
        ServiceRequest sr = inv.getServiceRequest();
        Events event = sr.getEvent();
        Users client = event != null ? event.getClient() : null;
        Services svc = sr.getService();

        inv.setStatus(VendorInvite.Status.EXPIRED);
        inv.setUpdatedAt(now);
        vendorInviteRepository.save(inv);

        sr.setStatus(ServiceRequest.Status.CANCELLED);
        sr.setUpdatedAt(now);
        serviceRequestRepository.save(sr);

        if (client != null) {
            Notifications n = Notifications.builder()
                    .user(client)
                    .title("Vendor invite expired")
                    .message("The vendor you selected did not complete signup within 48 hours for "
                            + (svc != null ? svc.getName() : "a service")
                            + ". Please choose another vendor.")
                    .notificationType("VENDOR_DECLINE")
                    .referenceId(event != null ? event.getEventId() : null)
                    .isRead(false)
                    .createdAt(now)
                    .build();
            notificationsService.createNotification(n);

            String customerName = (client.getFirstName() + " " + client.getLastName()).trim();
            String serviceName = svc != null ? svc.getName() : "";
            String eventDate = sr.getEventDate() != null ? sr.getEventDate().toString()
                    : (event != null && event.getEventDate() != null ? event.getEventDate().toString() : "");
            try {
                twillioService.sendVendorInviteExpired(client.getPhone(), customerName, serviceName, eventDate);
            } catch (Exception ignored) {
                // SMS optional; in-app notification already created
            }
        }
    }

    private static String firstLineOrWord(String text) {
        if (text == null || text.isBlank()) {
            return "";
        }
        String t = text.trim();
        int comma = t.indexOf(',');
        if (comma > 0) {
            return t.substring(0, comma).trim();
        }
        String[] parts = t.split("\\s+");
        return parts.length > 0 ? parts[0] : t;
    }
}

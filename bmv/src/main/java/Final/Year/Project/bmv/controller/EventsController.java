package Final.Year.Project.bmv.controller;

import Final.Year.Project.bmv.dto.VendorServiceDto;
import Final.Year.Project.bmv.entity.*;
import Final.Year.Project.bmv.service.*;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.*;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/events")
@CrossOrigin(origins = "http://localhost:3000")
public class EventsController {

    @Autowired private EventsService eventsService;
    @Autowired private ServicesService servicesService;
    @Autowired private VendorServiceService vendorServiceService;
    @Autowired private VendorProfileService vendorProfileService;
    @Autowired private ServiceRequestService serviceRequestService;
    @Autowired private VendorServiceRequestService vendorServiceRequestService;
    @Autowired private NotificationsService notificationsService;
    @Autowired private BookingService bookingsService;
    @Autowired private EventTypeService eventTypeService;
    @Autowired private UsersService usersService;

    // List available services for event configuration
    @GetMapping("/getAllServices")
    public ResponseEntity<List<Services>> getAvailableServices() {
        return ResponseEntity.ok(servicesService.getAllServices());
    }

    // Get top vendors for a given service at event date/location [expect: serviceId, eventDate, city, guestCount]
    @GetMapping("/top-vendors")
    public ResponseEntity<List<VendorServiceDto>> getTopVendorsForService(@RequestParam Map<String, String> map) {
        Long serviceId = Long.parseLong(map.get("serviceId"));
        String city = map.get("city");
        LocalDate eventDate = LocalDate.parse(map.get("eventDate"));
        Integer guestCount = Integer.parseInt(map.get("guestCount"));

        // Filter VendorService by serviceId and vendor city and availability (simulate review/availability filtering)
        List<VendorService> filtered = vendorServiceService.getAllVendorServices().stream()
                .filter(vs -> vs.getService().getServiceId().equals(serviceId)
                        && vs.getVendor().getCity().equalsIgnoreCase(city)
                        && vs.isAvailable()
                        && (vs.getMinGuests() == null || guestCount >= vs.getMinGuests())
                        && (vs.getMaxGuests() == null || guestCount <= vs.getMaxGuests()))
                .sorted((a, b) -> b.getVendor().getRating().compareTo(a.getVendor().getRating()))
                .limit(5)
                .collect(Collectors.toList());
        List<VendorServiceDto> dtos = filtered.stream()
                .map(VendorServiceDto::from)
                .toList();
        return ResponseEntity.ok(dtos);
    }

    // Client chooses a vendor for a service; service request is sent [expect: eventId, serviceId, vendorServiceId, budgetMin, budgetMax, guestCount, requirements, eventDate]
    @PostMapping("/create-service-request")
    public ResponseEntity<?> createServiceRequest(@RequestBody BookingPayload payload) {
        List<Map<String, String>> servicesList = payload.getServices();
        Events event = eventsService.getEventsById(Long.parseLong(payload.getEventId()));
        servicesList.forEach(map -> {
        Services service = servicesService.getServiceById(Long.parseLong(map.get("serviceId")));
        VendorProfile vendor = vendorProfileService.getVendorProfileById(Long.parseLong(map.get("vendorId")));

        ServiceRequest sr = ServiceRequest.builder()
                .event(event)
                .service(service)
                .budgetMin(new java.math.BigDecimal(0))
                .budgetMax(new java.math.BigDecimal(map.getOrDefault("budget", "0")))
                .guestCount(event.getGuestCount())
                .eventDate(event.getEventDate())
                .status(ServiceRequest.Status.OPEN)
                .createdAt(LocalDateTime.now())
                .updatedAt(LocalDateTime.now())
                .build();
        sr = serviceRequestService.createServiceRequest(sr);

        VendorServiceRequest vsr = VendorServiceRequest.builder()
                .serviceRequest(sr)
                .vendor(vendor)
                .proposedAmount(sr.getBudgetMax())
                .message("Service request for " + service.getName())
                .status(VendorServiceRequest.Status.PENDING)
                .createdAt(LocalDateTime.now())
                .updatedAt(LocalDateTime.now())
                .build();
        vendorServiceRequestService.createVendorServiceRequest(vsr);
        });

        return ResponseEntity.ok("Event Created");
    }

    // Vendor responds to a service request [expect: vendorRequestId, response (ACCEPTED/REJECTED)]
    // Vendor responds to a service request [expect: vendorRequestId, response (ACCEPTED/REJECTED)]
    @PostMapping("/respond-service-request")
    public ResponseEntity<String> respondServiceRequest(@RequestBody Map<String, String> map) {
        VendorServiceRequest vsr = vendorServiceRequestService.getVendorServiceRequestById(
                Long.parseLong(map.get("vendorRequestId")));
        vsr.setStatus(VendorServiceRequest.Status.valueOf(map.get("response").toUpperCase()));
        vsr.setUpdatedAt(LocalDateTime.now());
        vendorServiceRequestService.updateVendorServiceRequest(vsr.getVendorRequestId(), vsr);

        // If declined, notify client
        if (vsr.getStatus() == VendorServiceRequest.Status.REJECTED) {
            Events event = vsr.getServiceRequest().getEvent();
            Notifications notification = Notifications.builder()
                    .user(event.getClient())
                    .title("Vendor declined for service")
                    .message("Choose another vendor for " + event.getTitle())
                    .notificationType("VENDOR_DECLINE")
                    .referenceId(event.getEventId())
                    .isRead(false)
                    .createdAt(LocalDateTime.now())
                    .build();
            notificationsService.createNotification(notification);
            return ResponseEntity.ok("Vendor response updated");
        }

        // If accepted, CREATE BOOKING record
        if (vsr.getStatus() == VendorServiceRequest.Status.ACCEPTED) {
            Events event = vsr.getServiceRequest().getEvent();
            VendorService vendorService = vendorServiceService.getVendorServiceById(vsr.getServiceRequest().getService().getServiceId()); // Vendor service matching requested service
            VendorProfile vendor = vsr.getVendor();
            Bookings booking = Bookings.builder()
                    .event(event)
                    .vendorService(vendorService)
                    .vendor(vendor)
                    .bookingDate(LocalDateTime.now())
                    .bookingStatus(Bookings.BookingStatus.CONFIRMED)
                    .amount(vsr.getProposedAmount() != null ? vsr.getProposedAmount() : BigDecimal.ZERO)
                    .paymentStatus(Bookings.PaymentStatus.PENDING)
                    .notes("Booking created after vendor confirmation")
                    .createdAt(LocalDateTime.now())
                    .updatedAt(LocalDateTime.now())
                    .build();
            bookingsService.createBookings(booking);

            return ResponseEntity.ok("Vendor accepted and booking confirmed.");
        }
        return ResponseEntity.ok("Vendor response updated");
    }

    // Confirm event after all required services confirmed [expect: eventId]
    @PostMapping("/confirm")
    public ResponseEntity<String> confirmEvent(@RequestBody Map<String, String> map) {
        Long eventId = Long.parseLong(map.get("eventId"));
        Events event = eventsService.getEventsById(eventId);

        List<ServiceRequest> requests = serviceRequestService.getAllServiceRequests().stream()
                .filter(req -> req.getEvent().getEventId().equals(eventId))
                .collect(Collectors.toList());

        boolean allConfirmed = true;
        for (ServiceRequest req : requests) {
            boolean accepted = vendorServiceRequestService.getAllVendorServiceRequests().stream()
                    .anyMatch(vreq -> vreq.getServiceRequest().getRequestId().equals(req.getRequestId())
                            && vreq.getStatus() == VendorServiceRequest.Status.ACCEPTED);
            if (!accepted) {
                allConfirmed = false;
                break;
            }
        }
        if (allConfirmed) {
            event.setStatus(Events.Status.CONFIRMED);
            event.setUpdatedAt(LocalDateTime.now());
            eventsService.updateEvents(eventId, event);
            return ResponseEntity.ok("Event confirmed");
        } else {
            return ResponseEntity.badRequest().body("Some services not yet confirmed by vendors");
        }
    }

    // Additional basic CRUD endpoints
    @GetMapping
    public ResponseEntity<List<Events>> getAllEvents() {
        return ResponseEntity.ok(eventsService.getAllEvents());
    }

    @GetMapping("/{eventId}")
    public ResponseEntity<Events> getEventById(@PathVariable Long eventId) {
        return ResponseEntity.ok(eventsService.getEventsById(eventId));
    }

    @PutMapping("/{eventId}")
    public ResponseEntity<Events> updateEvent(@PathVariable Long eventId, @RequestBody Map<String, String> map) {
        Events existing = eventsService.getEventsById(eventId);
        if (map.containsKey("eventTypeId")) existing.setEventType(eventTypeService.getEventTypeById(Long.parseLong(map.get("eventTypeId"))));
        if (map.containsKey("title")) existing.setTitle(map.get("title"));
        if (map.containsKey("description")) existing.setDescription(map.get("description"));
        if (map.containsKey("eventDate")) existing.setEventDate(LocalDate.parse(map.get("eventDate")));
        if (map.containsKey("startTime")) existing.setStartTime(LocalTime.parse(map.get("startTime")));
        if (map.containsKey("guestCount")) existing.setGuestCount(Integer.parseInt(map.get("guestCount")));
        if (map.containsKey("venueAddress")) existing.setVenueAddress(map.get("venueAddress"));
        if (map.containsKey("status")) existing.setStatus(Events.Status.valueOf(map.get("status").toUpperCase()));
        existing.setUpdatedAt(LocalDateTime.now());
        Events updatedEvent = eventsService.updateEvents(eventId, existing);
        return ResponseEntity.ok(updatedEvent);
    }

    @DeleteMapping("/{eventId}")
    public ResponseEntity<Void> deleteEvent(@PathVariable Long eventId) {
        eventsService.deleteEvents(eventId);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/getEventTypes")
    public ResponseEntity<?> getEventTypes(){
        return ResponseEntity.ok(eventTypeService.getAllEventTypes());
    }

    @PostMapping("/newEvent")
    @Transactional
    public ResponseEntity<?> createEventFromBooking(@RequestBody Map<String, String> bookingData) {
        try {
            if (bookingData == null) {
                return ResponseEntity.badRequest().body("bookingData is required");
            }
            System.out.println(bookingData);
            LocalDate eventDate = LocalDate.parse(bookingData.get("eventDate"));
            LocalTime startTime = LocalTime.parse(bookingData.get("eventTime"));
            Integer guestCount = Integer.parseInt(bookingData.get("guestCount"));
            String specialRequests = bookingData.getOrDefault("specialRequests", "");
            String venue = bookingData.getOrDefault("venue", bookingData.getOrDefault("venueAddress", null));
            EventTypes evtType = eventTypeService.getEventTypeById(Long.parseLong(bookingData.get("eventType")));
            Long UserId = Long.parseLong(bookingData.get("userId"));

            Users client = usersService.getUserById(UserId);
            if (client == null) {
                return ResponseEntity.badRequest().body("Invalid UserId.");
            }

            if (evtType == null) {
                return ResponseEntity.badRequest().body("Invalid Event Type.");
            }
            Events event = Events.builder()
                    .client(client)
                    .eventType(evtType)
                    .title("Event - " + (evtType != null ? evtType.getName() : "General"))
                    .description(specialRequests)
                    .eventDate(eventDate)
                    .startTime(startTime)
                    .guestCount(guestCount)
                    .venueAddress(venue)
                    .status(Events.Status.DRAFT)
                    .createdAt(LocalDateTime.now())
                    .updatedAt(LocalDateTime.now())
                    .build();

            Events created = eventsService.createEvents(event);

            return ResponseEntity.ok(String.valueOf(created.getEventId()));

        } catch (Exception ex) {
            ex.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Failed to create event: " + ex.getMessage());
        }
    }

}

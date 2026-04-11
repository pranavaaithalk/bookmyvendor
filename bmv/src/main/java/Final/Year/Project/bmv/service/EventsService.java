package Final.Year.Project.bmv.service;

import Final.Year.Project.bmv.dto.*;
import Final.Year.Project.bmv.entity.*;
import Final.Year.Project.bmv.repository.*;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.Comparator;
import java.util.List;

@Service
public class EventsService {

    @Autowired
    private EventRepository eventsRepository;
    @Autowired
    private ServiceRequestRepository serviceRequestRepository;
    @Autowired
    private VendorServiceRequestRepository vendorServiceRequestRepository;
    @Autowired
    private ReviewRepository reviewRepository;
    @Autowired
    private BookingRepository bookingRepository;
    @Autowired
    private VendorProfileRepository vendorProfileRepository;

    @Autowired
    private TwillioService twillioService;

    public Events createEvents(Events events) {
        return eventsRepository.save(events);
    }

    public List<Events> getAllEvents() {
        return eventsRepository.findAll();
    }

    public Events getEventsById(Long id) {
        return eventsRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Events not found: " + id));
    }

    public Events updateEvents(Long id, Events eventsDetails) {
        Events existing = getEventsById(id);
        existing.setClient(eventsDetails.getClient());
        existing.setEventType(eventsDetails.getEventType());
        existing.setTitle(eventsDetails.getTitle());
        existing.setDescription(eventsDetails.getDescription());
        existing.setEventDate(eventsDetails.getEventDate());
        existing.setStartTime(eventsDetails.getStartTime());
        existing.setGuestCount(eventsDetails.getGuestCount());
        existing.setVenueAddress(eventsDetails.getVenueAddress());
        existing.setStatus(eventsDetails.getStatus());
        existing.setUpdatedAt(eventsDetails.getUpdatedAt());
        return eventsRepository.save(existing);
    }

    public void deleteEvents(Long id) {
        eventsRepository.deleteById(id);
    }

    public List<Events> getClientEvents(Long id){
        return eventsRepository.findByClient_UserId(id);
    }

    public EventDetailsResponseDto getEventDetails(Long eventId) {

        Events event = eventsRepository.findById(eventId)
                .orElseThrow(() -> new RuntimeException("Event not found"));

        List<ServiceRequest> serviceRequests =
                serviceRequestRepository.findByEvent_EventId(eventId);

        List<ServiceRequestWithVendorDto> srDtos =
                serviceRequests.stream()
                        .map(sr -> {
                            List<VendorServiceRequest> vsr =
                                    vendorServiceRequestRepository
                                            .findByServiceRequest_RequestIdAndStatusIn(
                                                    sr.getRequestId(),
                                                    List.of(
                                                            VendorServiceRequest.Status.PENDING,
                                                            VendorServiceRequest.Status.ACCEPTED,
                                                            VendorServiceRequest.Status.REJECTED
                                                    )
                                            );
                            vsr.sort(Comparator.comparing(
                                    VendorServiceRequest::getUpdatedAt,
                                    Comparator.nullsLast(Comparator.reverseOrder())
                            ));

                            return ServiceRequestWithVendorDto.from(sr, vsr);
                        })
                        .toList();

        return EventDetailsResponseDto.builder()
                .event(EventDto.from(event))
                .serviceRequests(srDtos)
                .build();
    }

    @Transactional
    public void completeEvent(
            CompleteEventRequestDto dto,
            Users client
    ) {

        Events event = eventsRepository.findById(dto.getEventId())
                .orElseThrow(() -> new RuntimeException("Event not found"));

        for (ReviewInputDto r : dto.getReviews()) {

            if (r.getTargetType() == ReviewInputDto.TargetType.PLATFORM) {
                continue;
            }

            // VENDOR review
            Bookings booking = bookingRepository
                    .findByEvent_EventIdAndVendor_VendorIdAndVendorServiceRequest_VendorRequestId(
                            event.getEventId(),
                            r.getVendorId(),
                            r.getVendorServiceRequestId()
                    )
                    .orElseThrow(() ->
                            new RuntimeException("Booking not found for vendor review\n" +
                                    "Event ID: "+event.getEventId()+"\n" +
                                    "Vendor ID: "+r.getVendorId()+"\n" +
                                    "VendorServiceRequest: "+r.getVendorServiceRequestId()+"\n\n\n")
                    );

            if (reviewRepository.existsByBooking_VendorServiceRequest_VendorRequestId(
                    r.getVendorServiceRequestId())) {
                continue;
            }

            Reviews review = Reviews.builder()
                    .booking(booking)
                    .client(client)
                    .vendor(booking.getVendor().getUser())
                    .rating(r.getRating())
                    .comment(r.getComment())
                    .isApproved(true)
                    .createdAt(LocalDateTime.now())
                    .updatedAt(LocalDateTime.now())
                    .build();

            reviewRepository.saveAndFlush(review);
            VendorProfile vendor = vendorProfileRepository.findById(r.getVendorId()).orElse(null);
            vendor.setTotalRevenue(vendor.getTotalRevenue()+booking.getAmount().intValueExact());
            vendor.setTotalReviews(vendor.getTotalReviews()+1);
            double avg = vendor.getRating().floatValue();
            avg+=r.getRating();
            avg/=vendor.getTotalReviews();
            vendor.setRating(BigDecimal.valueOf(avg));
            vendorProfileRepository.saveAndFlush(vendor);
            ServiceRequest serviceRequest = serviceRequestRepository.findById(r.getServiceRequestId()).orElse(null);
            serviceRequest.setStatus(ServiceRequest.Status.COMPLETED);
            serviceRequestRepository.saveAndFlush(serviceRequest);
        }

        List<Bookings> bookings = bookingRepository.findByEvent_EventId(event.getEventId());
        for (Bookings b : bookings) {
            b.setBookingStatus(Bookings.BookingStatus.COMPLETED);
        }
        bookingRepository.saveAll(bookings);

        event.setStatus(Events.Status.COMPLETED);
        eventsRepository.save(event);

        try {
            String name = client != null ? (client.getFirstName() + " " + client.getLastName()).trim() : "";
            String date = event.getEventDate() != null ? event.getEventDate().toString() : "";
            twillioService.sendEventCompleted(client != null ? client.getPhone() : null, name, date);
        } catch (Exception ex) {
            // Keep event completion success even if WhatsApp fails
            ex.printStackTrace();
        }
    }

}

package Final.Year.Project.bmv.controller;

import Final.Year.Project.bmv.dto.VendorBookingDto;
import Final.Year.Project.bmv.dto.VendorServiceRequestDto;
import Final.Year.Project.bmv.entity.Bookings;
import Final.Year.Project.bmv.entity.VendorServiceRequest;
import Final.Year.Project.bmv.service.BookingService;
import Final.Year.Project.bmv.service.VendorServiceRequestService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/bookings")
public class BookingsController {

    @Autowired
    private BookingService bookingsService;

    @Autowired
    private VendorServiceRequestService vendorServiceRequestService;

    @GetMapping("/vendor/{vendorId}")
    public ResponseEntity<List<VendorBookingDto>> getVendorBookings(
            @PathVariable Long vendorId) {

        List<Bookings> bookings = bookingsService.getBookingsForVendor(vendorId);

        List<VendorBookingDto> dtos = bookings.stream()
                .map(VendorBookingDto::from)
                .toList();

        return ResponseEntity.ok(dtos);
    }

    @GetMapping("/serviceRequests/{vendorId}")
    public ResponseEntity<List<VendorServiceRequestDto>> getServiceRequestsForVendor(
            @PathVariable Long vendorId) {

        List<VendorServiceRequest> requests =
                vendorServiceRequestService.getRequestsForVendor(vendorId);

        List<VendorServiceRequestDto> dtos = requests.stream()
                .map(VendorServiceRequestDto::from)
                .toList();

        return ResponseEntity.ok(dtos);
    }
}

package Final.Year.Project.bmv.service;

import Final.Year.Project.bmv.entity.Bookings;
import Final.Year.Project.bmv.repository.BookingRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class BookingService {

    @Autowired
    private BookingRepository bookingsRepository;

    public Bookings createBookings(Bookings bookings) {
        return bookingsRepository.save(bookings);
    }

    public List<Bookings> getAllBookings() {
        return bookingsRepository.findAll();
    }

    public Bookings getBookingsById(Long id) {
        return bookingsRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Bookings not found: " + id));
    }

    public List<Bookings> getBookingsForVendor(Long vendorId) {
        return bookingsRepository.findByVendor_VendorId(vendorId);
    }

    public Bookings updateBookings(Long id, Bookings bookingsDetails) {
        Bookings existing = getBookingsById(id);
        existing.setEvent(bookingsDetails.getEvent());
        existing.setVendorServiceRequest(bookingsDetails.getVendorServiceRequest());
        existing.setVendor(bookingsDetails.getVendor());
        existing.setBookingDate(bookingsDetails.getBookingDate());
        existing.setBookingStatus(bookingsDetails.getBookingStatus());
        existing.setAmount(bookingsDetails.getAmount());
        existing.setPaymentStatus(bookingsDetails.getPaymentStatus());
        existing.setNotes(bookingsDetails.getNotes());
        existing.setUpdatedAt(bookingsDetails.getUpdatedAt());
        return bookingsRepository.save(existing);
    }

    public void deleteBookings(Long id) {
        bookingsRepository.deleteById(id);
    }
}

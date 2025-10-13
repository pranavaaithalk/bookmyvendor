package Final.Year.Project.bmv.service;

import Final.Year.Project.bmv.entity.BookingAddon;
import Final.Year.Project.bmv.repository.BookingAddonRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class BookingAddonService {

    @Autowired
    private BookingAddonRepository bookingAddonRepository;

    public BookingAddon createBookingAddon(BookingAddon bookingAddon) {
        return bookingAddonRepository.save(bookingAddon);
    }

    public List<BookingAddon> getAllBookingAddons() {
        return bookingAddonRepository.findAll();
    }

    public BookingAddon getBookingAddonById(Long id) {
        return bookingAddonRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("BookingAddon not found: " + id));
    }

    public BookingAddon updateBookingAddon(Long id, BookingAddon bookingAddonDetails) {
        BookingAddon existing = getBookingAddonById(id);
        existing.setBooking(bookingAddonDetails.getBooking());
        existing.setAddon(bookingAddonDetails.getAddon());
        existing.setQuantity(bookingAddonDetails.getQuantity());
        existing.setPricePerUnit(bookingAddonDetails.getPricePerUnit());
        return bookingAddonRepository.save(existing);
    }

    public void deleteBookingAddon(Long id) {
        bookingAddonRepository.deleteById(id);
    }
}

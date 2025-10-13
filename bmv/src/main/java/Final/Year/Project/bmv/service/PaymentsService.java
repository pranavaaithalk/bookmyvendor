package Final.Year.Project.bmv.service;

import Final.Year.Project.bmv.entity.Payments;
import Final.Year.Project.bmv.repository.PaymentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class PaymentsService {

    @Autowired
    private PaymentRepository paymentsRepository;

    public Payments createPayment(Payments payment) {
        return paymentsRepository.save(payment);
    }

    public List<Payments> getAllPayments() {
        return paymentsRepository.findAll();
    }

    public Payments getPaymentById(Long id) {
        return paymentsRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Payment not found: " + id));
    }

    public Payments updatePayment(Long id, Payments paymentDetails) {
        Payments existing = getPaymentById(id);
        existing.setBooking(paymentDetails.getBooking());
        existing.setAmount(paymentDetails.getAmount());
        existing.setPaymentMethod(paymentDetails.getPaymentMethod());
        existing.setTransactionId(paymentDetails.getTransactionId());
        existing.setPaymentStatus(paymentDetails.getPaymentStatus());
        existing.setPaymentDate(paymentDetails.getPaymentDate());
        existing.setNotes(paymentDetails.getNotes());
        existing.setUpdatedAt(paymentDetails.getUpdatedAt());
        return paymentsRepository.save(existing);
    }

    public void deletePayment(Long id) {
        paymentsRepository.deleteById(id);
    }
}

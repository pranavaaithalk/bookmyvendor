package Final.Year.Project.bmv.service;

import Final.Year.Project.bmv.entity.Messages;
import Final.Year.Project.bmv.entity.Users;
import Final.Year.Project.bmv.entity.Bookings;
import Final.Year.Project.bmv.repository.MessageRepository;
import Final.Year.Project.bmv.repository.UserRepository;
import Final.Year.Project.bmv.repository.BookingRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class MessagesService {

    @Autowired
    private MessageRepository messagesRepository;

    @Autowired
    private UserRepository usersRepository;

    @Autowired
    private BookingRepository bookingsRepository;

    public Messages createMessage(Messages message) {
        return messagesRepository.save(message);
    }

    public List<Messages> getAllMessages() {
        return messagesRepository.findAll();
    }

    public Messages getMessageById(Long id) {
        return messagesRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Message not found: " + id));
    }

    public Messages updateMessage(Long id, Messages messageDetails) {
        Messages existing = getMessageById(id);
        existing.setSender(messageDetails.getSender());
        existing.setReceiver(messageDetails.getReceiver());
        existing.setBooking(messageDetails.getBooking());
        existing.setMessageText(messageDetails.getMessageText());
        existing.setRead(messageDetails.isRead());
        return messagesRepository.save(existing);
    }

    public void deleteMessage(Long id) {
        messagesRepository.deleteById(id);
    }

    // Send a message between users, optionally linked to a booking
    public Messages sendMessage(Long senderId, Long receiverId, String messageText, Long bookingId) {
        Users sender = usersRepository.findById(senderId)
                .orElseThrow(() -> new RuntimeException("Sender not found: " + senderId));
        Users receiver = usersRepository.findById(receiverId)
                .orElseThrow(() -> new RuntimeException("Receiver not found: " + receiverId));

        Bookings booking = null;
        if (bookingId != null) {
            booking = bookingsRepository.findById(bookingId)
                    .orElseThrow(() -> new RuntimeException("Booking not found: " + bookingId));
        }

        Messages message = Messages.builder()
                .sender(sender)
                .receiver(receiver)
                .booking(booking)
                .messageText(messageText)
                .isRead(false)
                .createdAt(LocalDateTime.now())
                .build();

        return messagesRepository.save(message);
    }

    // Get all messages exchanged between two users
    public List<Messages> getConversation(Long senderId, Long receiverId) {
        return messagesRepository.findBySender_UserIdAndReceiver_UserIdOrSender_UserIdAndReceiver_UserIdOrderByCreatedAtAsc(
                senderId, receiverId, receiverId, senderId);
    }

    // Get all messages sent by a user
    public List<Messages> getSentMessages(Long senderId) {
        return messagesRepository.findBySender_UserIdOrderByCreatedAtDesc(senderId);
    }

    // Get all messages received by a user
    public List<Messages> getReceivedMessages(Long receiverId) {
        return messagesRepository.findByReceiver_UserIdOrderByCreatedAtDesc(receiverId);
    }
}

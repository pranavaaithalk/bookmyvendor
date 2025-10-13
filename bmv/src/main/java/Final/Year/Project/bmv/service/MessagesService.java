package Final.Year.Project.bmv.service;

import Final.Year.Project.bmv.entity.Messages;
import Final.Year.Project.bmv.repository.MessageRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class MessagesService {

    @Autowired
    private MessageRepository messagesRepository;

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
        // createdAt is updatable = false, so not updated here
        return messagesRepository.save(existing);
    }

    public void deleteMessage(Long id) {
        messagesRepository.deleteById(id);
    }
}

package Final.Year.Project.bmv.controller;

import Final.Year.Project.bmv.entity.Messages;
import Final.Year.Project.bmv.service.MessagesService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.*;

/*
 * Map keys for all endpoints:
 * - "senderId": Long (ID of sender, required for /send and filtering)
 * - "receiverId": Long (ID of receiver, required for /send and filtering)
 * - "messageText": String (message content, required for /send)
 * - "bookingId": Long (optional for /send, used to associate with booking)
 * - "clientId", "vendorId": Long (used for filtering conversation if required)
 */

@RestController
@RequestMapping("/api/messages")
public class MessageController {

    @Autowired
    private MessagesService messagesService;

    // Send a message. Map keys required: senderId, receiverId, messageText, [bookingId]
    @PostMapping("/send")
    public ResponseEntity<Map<String, Object>> sendMessage(@RequestBody Map<String, Object> body) {
        Long senderId = Long.valueOf(body.get("senderId").toString());
        Long receiverId = Long.valueOf(body.get("receiverId").toString());
        String messageText = body.get("messageText").toString();
        Long bookingId = body.get("bookingId") != null ? Long.valueOf(body.get("bookingId").toString()) : null;

        Messages savedMsg = messagesService.sendMessage(senderId, receiverId, messageText, bookingId);

        Map<String, Object> response = new HashMap<>();
        response.put("messageId", savedMsg.getMessageId());
        response.put("senderId", savedMsg.getSender().getUserId());
        response.put("receiverId", savedMsg.getReceiver().getUserId());
        response.put("messageText", savedMsg.getMessageText());
        response.put("isRead", savedMsg.isRead());
        response.put("createdAt", savedMsg.getCreatedAt());
        response.put("bookingId", (savedMsg.getBooking() != null) ? savedMsg.getBooking().getBookingId() : null);

        return ResponseEntity.ok(response);
    }

    // Get messages between two users (conversation). Map keys required: senderId, receiverId
    @PostMapping("/conversation")
    public ResponseEntity<List<Map<String, Object>>> getConversation(@RequestBody Map<String, Object> body) {
        Long senderId = Long.valueOf(body.get("senderId").toString());
        Long receiverId = Long.valueOf(body.get("receiverId").toString());

        List<Messages> msgs = messagesService.getConversation(senderId, receiverId);
        List<Map<String, Object>> result = new ArrayList<>();
        for (Messages m : msgs) {
            Map<String, Object> msgMap = new HashMap<>();
            msgMap.put("messageId", m.getMessageId());
            msgMap.put("senderId", m.getSender().getUserId());
            msgMap.put("receiverId", m.getReceiver().getUserId());
            msgMap.put("messageText", m.getMessageText());
            msgMap.put("isRead", m.isRead());
            msgMap.put("createdAt", m.getCreatedAt());
            msgMap.put("bookingId", (m.getBooking() != null) ? m.getBooking().getBookingId() : null);
            result.add(msgMap);
        }
        return ResponseEntity.ok(result);
    }

    // Get messages sent by a user. Map key required: senderId
    @PostMapping("/sent")
    public ResponseEntity<List<Map<String, Object>>> getSentMessages(@RequestBody Map<String, Object> body) {
        Long senderId = Long.valueOf(body.get("senderId").toString());
        List<Messages> msgs = messagesService.getSentMessages(senderId);
        List<Map<String, Object>> result = new ArrayList<>();
        for (Messages m : msgs) {
            Map<String, Object> msgMap = new HashMap<>();
            msgMap.put("messageId", m.getMessageId());
            msgMap.put("senderId", m.getSender().getUserId());
            msgMap.put("receiverId", m.getReceiver().getUserId());
            msgMap.put("messageText", m.getMessageText());
            msgMap.put("isRead", m.isRead());
            msgMap.put("createdAt", m.getCreatedAt());
            msgMap.put("bookingId", (m.getBooking() != null) ? m.getBooking().getBookingId() : null);
            result.add(msgMap);
        }
        return ResponseEntity.ok(result);
    }

    // Get messages received by a user. Map key required: receiverId
    @PostMapping("/received")
    public ResponseEntity<List<Map<String, Object>>> getReceivedMessages(@RequestBody Map<String, Object> body) {
        Long receiverId = Long.valueOf(body.get("receiverId").toString());
        List<Messages> msgs = messagesService.getReceivedMessages(receiverId);
        List<Map<String, Object>> result = new ArrayList<>();
        for (Messages m : msgs) {
            Map<String, Object> msgMap = new HashMap<>();
            msgMap.put("messageId", m.getMessageId());
            msgMap.put("senderId", m.getSender().getUserId());
            msgMap.put("receiverId", m.getReceiver().getUserId());
            msgMap.put("messageText", m.getMessageText());
            msgMap.put("isRead", m.isRead());
            msgMap.put("createdAt", m.getCreatedAt());
            msgMap.put("bookingId", (m.getBooking() != null) ? m.getBooking().getBookingId() : null);
            result.add(msgMap);
        }
        return ResponseEntity.ok(result);
    }
}

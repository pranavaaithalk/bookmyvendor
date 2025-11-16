package Final.Year.Project.bmv.service;

import Final.Year.Project.bmv.entity.Events;
import Final.Year.Project.bmv.repository.EventRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class EventsService {

    @Autowired
    private EventRepository eventsRepository;

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
}

package Final.Year.Project.bmv.service;

import Final.Year.Project.bmv.entity.EventTypes;
import Final.Year.Project.bmv.entity.Services;
import Final.Year.Project.bmv.repository.EventTypeRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class EventTypeService {
    @Autowired
    private EventTypeRepo eventTypeRepository;

    public EventTypes createEventType(EventTypes service) {
        return eventTypeRepository.save(service);
    }

    public List<EventTypes> getAllEventTypes() {
        return eventTypeRepository.findAll();
    }

    public EventTypes getEventTypeById(Long id) {
        return eventTypeRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Event not found: " + id));
    }

    public EventTypes updateEventType(Long id, Services serviceDetails) {
        EventTypes existing = getEventTypeById(id);
        existing.setName(serviceDetails.getName());
        existing.setDescription(serviceDetails.getDescription());
        existing.setIconUrl(serviceDetails.getIconUrl());
        existing.setActive(serviceDetails.isActive());
        return eventTypeRepository.save(existing);
    }

    public void deleteEventType(Long id) {
        eventTypeRepository.deleteById(id);
    }
}

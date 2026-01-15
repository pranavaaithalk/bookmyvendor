package Final.Year.Project.bmv.dto;

import Final.Year.Project.bmv.entity.Events;
import lombok.Builder;
import lombok.Getter;

import java.time.LocalDate;
import java.time.LocalTime;
import java.time.LocalDateTime;

@Getter
@Builder
public class EventDto {

    private Long eventId;

    private Long clientId;
    private String clientName;

    private Long eventTypeId;
    private String eventTypeName;

    private String title;
    private String description;

    private LocalDate eventDate;
    private LocalTime startTime;

    private Integer guestCount;
    private String venueAddress;

    private String status;

    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;


    public static EventDto from(Events event) {
        if (event == null) return null;

        return EventDto.builder()
                .eventId(event.getEventId())

                .clientId(event.getClient().getUserId())
                .clientName(event.getClient().getFirstName())

                .eventTypeId(event.getEventType().getEventTypeId())
                .eventTypeName(event.getEventType().getName())

                .title(event.getTitle())
                .description(event.getDescription())
                .eventDate(event.getEventDate())
                .startTime(event.getStartTime())
                .guestCount(event.getGuestCount())
                .venueAddress(event.getVenueAddress())

                .status(event.getStatus().name().toLowerCase())

                .createdAt(event.getCreatedAt())
                .updatedAt(event.getUpdatedAt())
                .build();
    }
}

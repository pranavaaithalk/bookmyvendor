package Final.Year.Project.bmv.dto;

import lombok.*;

import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class EventDetailsResponseDto {

    private EventDto event;
    private List<ServiceRequestWithVendorDto> serviceRequests;

}

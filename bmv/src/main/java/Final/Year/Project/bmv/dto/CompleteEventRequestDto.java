package Final.Year.Project.bmv.dto;

import Final.Year.Project.bmv.entity.Users;
import lombok.Data;
import java.util.List;

@Data
public class CompleteEventRequestDto {
    private Long eventId;
    private Long userId;
    private List<ReviewInputDto> reviews;
}

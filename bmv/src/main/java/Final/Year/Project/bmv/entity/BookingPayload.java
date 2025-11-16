package Final.Year.Project.bmv.entity;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;
import java.util.Map;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class BookingPayload {
    private List<Map<String,String>> services;
    private String eventId;
}

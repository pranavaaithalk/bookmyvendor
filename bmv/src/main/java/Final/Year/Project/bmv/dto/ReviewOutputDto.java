package Final.Year.Project.bmv.dto;

import Final.Year.Project.bmv.entity.Reviews;
import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@Builder
public class ReviewOutputDto {
    private Long reviewId;
    private String client;
    private Integer rating;
    private String comment;
    private String event;
    private LocalDateTime createdAt;

    public static ReviewOutputDto from(Reviews r){
        return ReviewOutputDto.builder()
                .reviewId(r.getReviewId())
                .client(r.getClient().getFirstName())
                .rating(r.getRating())
                .comment(r.getComment())
                .event(r.getBooking().getEvent().getTitle())
                .createdAt(r.getCreatedAt())
                .build();
    }
}

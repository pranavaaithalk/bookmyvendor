package Final.Year.Project.bmv.dto;

import Final.Year.Project.bmv.entity.Users;
import lombok.Builder;
import lombok.Getter;

import java.time.LocalDateTime;

@Getter
@Builder
public class UserDto {

    private Long userId;

    private String email;
    private String firstName;
    private String lastName;
    private String fullName;

    private String phone;
    private String profileImageUrl;

    private String userType;
    private boolean verified;

    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;


    public static UserDto from(Users user) {
        if (user == null) return null;

        return UserDto.builder()
                .userId(user.getUserId())
                .email(user.getEmail())

                .firstName(user.getFirstName())
                .lastName(user.getLastName())
                .fullName(user.getFirstName() + " " + user.getLastName())

                .phone(user.getPhone())
                .profileImageUrl(user.getProfileImageUrl())

                .userType(user.getUserType().name().toLowerCase())
                .verified(user.isVerified())

                .createdAt(user.getCreatedAt())
                .updatedAt(user.getUpdatedAt())
                .build();
    }
}

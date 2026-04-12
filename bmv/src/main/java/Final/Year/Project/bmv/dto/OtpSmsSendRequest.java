package Final.Year.Project.bmv.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import lombok.Data;

@Data
public class OtpSmsSendRequest {

    @NotBlank(message = "phone is required")
    @Pattern(
            regexp = "^\\+[1-9]\\d{1,14}$",
            message = "phone must be E.164 format, e.g. +919876543210"
    )
    private String phone;
}

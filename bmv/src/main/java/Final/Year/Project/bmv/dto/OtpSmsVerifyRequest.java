package Final.Year.Project.bmv.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import lombok.Data;

@Data
public class OtpSmsVerifyRequest {

    @NotBlank(message = "phone is required")
    @Pattern(
            regexp = "^\\+[1-9]\\d{1,14}$",
            message = "phone must be E.164 format, e.g. +919876543210"
    )
    private String phone;

    @NotBlank(message = "code is required")
    @Pattern(regexp = "^\\d{4,12}$", message = "code must be numeric (length matches server otp.code-length)")
    private String code;
}

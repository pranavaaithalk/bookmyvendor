package Final.Year.Project.bmv.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import lombok.Data;

@Data
public class OtpEmailVerifyRequest {

    @NotBlank(message = "email is required")
    @Email(message = "email must be valid")
    private String email;

    @NotBlank(message = "code is required")
    @Pattern(regexp = "^\\d{4,12}$", message = "code must be numeric (length matches server otp.code-length)")
    private String code;
}

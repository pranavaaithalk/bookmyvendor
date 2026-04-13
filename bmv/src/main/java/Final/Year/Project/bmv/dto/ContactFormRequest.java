package Final.Year.Project.bmv.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class ContactFormRequest {

    @NotBlank(message = "email is required")
    @Email(message = "email must be valid")
    @Size(max = 320)
    private String email;

    @NotBlank(message = "name is required")
    @Size(max = 200)
    private String name;

    /** Optional; omit or empty string if none. */
    @Size(max = 32)
    private String phone;

    @NotBlank(message = "subject is required")
    @Size(max = 64)
    private String subject;

    @NotBlank(message = "subjectLabel is required")
    @Size(max = 200)
    private String subjectLabel;

    @NotBlank(message = "message is required")
    @Size(min = 1, max = 10000)
    private String message;
}

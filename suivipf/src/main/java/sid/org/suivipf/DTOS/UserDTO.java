package sid.org.suivipf.DTOS;

import lombok.*;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UserDTO {
    private Long id;
    private String username;
    private String email;
    private String firstName;
    private String lastName;
    private String matricule;
    private String phoneNumber;
    private String role;
    private String status;
    private LocalDateTime createdAt;
    private LocalDateTime lastLogin;
    private Long serviceId;
    private String serviceName;
    
    // For registration/update (password not included in response)
    private String password;
}

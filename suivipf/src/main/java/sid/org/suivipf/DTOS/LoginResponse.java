package sid.org.suivipf.DTOS;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import lombok.Builder;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class LoginResponse {
    
    private String token;
    @Builder.Default
    private String type = "Bearer";
    private UserDTO user;
    private String message;
    
    public LoginResponse(String token, UserDTO user) {
        this.token = token;
        this.user = user;
        this.message = "Login successful";
    }
}

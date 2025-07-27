package sid.org.suivipf.Service;

import sid.org.suivipf.DTOS.LoginRequest;
import sid.org.suivipf.DTOS.LoginResponse;
import sid.org.suivipf.DTOS.UserDTO;

public interface IAuthService {
    
    LoginResponse login(LoginRequest loginRequest);
    
    UserDTO getCurrentUser(String token);
    
    boolean validateToken(String token);
    
    void logout(String token);
    
    UserDTO register(UserDTO userDTO);
}

package sid.org.suivipf.Service;

import sid.org.suivipf.DTOS.UserDTO;
import sid.org.suivipf.entity.User;

import java.util.List;
import java.util.Optional;

public interface IUserService {
    
    UserDTO createUser(UserDTO userDTO);
    
    UserDTO updateUser(Long id, UserDTO userDTO);
    
    void deleteUser(Long id);
    
    Optional<UserDTO> getUserById(Long id);
    
    Optional<UserDTO> getUserByUsername(String username);
    
    Optional<UserDTO> getUserByEmail(String email);
    
    List<UserDTO> getAllUsers();
    
    List<UserDTO> getUsersByRole(User.UserRole role);
    
    List<UserDTO> getUsersByService(Long serviceId);
    
    List<UserDTO> getActiveUsers();
    
    boolean existsByUsername(String username);
    
    boolean existsByEmail(String email);
    
    boolean existsByMatricule(String matricule);
    
    UserDTO activateUser(Long id);
    
    UserDTO deactivateUser(Long id);
    
    void updateLastLogin(String username);
}

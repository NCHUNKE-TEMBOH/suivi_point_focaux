package sid.org.suivipf.Service.Service;

import lombok.AllArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import sid.org.suivipf.DTOS.LoginRequest;
import sid.org.suivipf.DTOS.LoginResponse;
import sid.org.suivipf.DTOS.UserDTO;
import sid.org.suivipf.Service.IAuthService;
import sid.org.suivipf.Service.IUserService;
import sid.org.suivipf.entity.User;
import sid.org.suivipf.repository.UserRepository;
import sid.org.suivipf.util.JwtUtil;

import java.time.LocalDateTime;
import java.util.Optional;

@Service
@AllArgsConstructor
@Transactional
public class AuthServiceImpl implements IAuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;
    private final IUserService userService;

    @Override
    public LoginResponse login(LoginRequest loginRequest) {
        try {
            // Find user by username
            Optional<User> userOptional = userRepository.findByUsername(loginRequest.getUsername());
            
            if (userOptional.isEmpty()) {
                throw new BadCredentialsException("Invalid username or password");
            }
            
            User user = userOptional.get();
            
            // Check if user is active
            if (user.getStatus() != User.UserStatus.ACTIVE) {
                throw new BadCredentialsException("User account is not active");
            }
            
            // Verify password
            if (!passwordEncoder.matches(loginRequest.getPassword(), user.getPassword())) {
                throw new BadCredentialsException("Invalid username or password");
            }
            
            // Update last login
            user.setLastLogin(LocalDateTime.now());
            userRepository.save(user);
            
            // Generate JWT token
            String token = jwtUtil.generateToken(user.getUsername(), user.getRole().toString());
            
            // Convert to DTO
            UserDTO userDTO = convertToDTO(user);
            
            return new LoginResponse(token, userDTO);
            
        } catch (Exception e) {
            throw new BadCredentialsException("Authentication failed: " + e.getMessage());
        }
    }

    @Override
    public UserDTO getCurrentUser(String token) {
        try {
            String username = jwtUtil.extractUsername(token);
            Optional<UserDTO> userDTO = userService.getUserByUsername(username);
            
            if (userDTO.isEmpty()) {
                throw new RuntimeException("User not found");
            }
            
            return userDTO.get();
        } catch (Exception e) {
            throw new RuntimeException("Failed to get current user: " + e.getMessage());
        }
    }

    @Override
    public boolean validateToken(String token) {
        return jwtUtil.validateToken(token);
    }

    @Override
    public void logout(String token) {
        // For now, we'll just validate the token
        // In a production system, you might want to blacklist the token
        if (!validateToken(token)) {
            throw new RuntimeException("Invalid token");
        }
    }

    @Override
    public UserDTO register(UserDTO userDTO) {
        // Set default role if not specified
        if (userDTO.getRole() == null || userDTO.getRole().isEmpty()) {
            userDTO.setRole("USER");
        }
        
        return userService.createUser(userDTO);
    }

    private UserDTO convertToDTO(User user) {
        return UserDTO.builder()
                .id(user.getId())
                .username(user.getUsername())
                .email(user.getEmail())
                .firstName(user.getFirstName())
                .lastName(user.getLastName())
                .matricule(user.getMatricule())
                .phoneNumber(user.getPhoneNumber())
                .role(user.getRole().toString())
                .status(user.getStatus().toString())
                .createdAt(user.getCreatedAt())
                .lastLogin(user.getLastLogin())
                .serviceId(user.getService() != null ? user.getService().getId() : null)
                .serviceName(user.getService() != null ? user.getService().getServiceName() : null)
                .build();
    }
}

package sid.org.suivipf.Service.Service;

import lombok.AllArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import sid.org.suivipf.DTOS.UserDTO;
import sid.org.suivipf.Service.IUserService;
import sid.org.suivipf.entity.User;
import sid.org.suivipf.repository.UserRepository;
import sid.org.suivipf.repository.FocalServiceRepository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@AllArgsConstructor
@Transactional
public class UserServiceImpl implements IUserService {
    
    private final UserRepository userRepository;
    private final FocalServiceRepository focalServiceRepository;
    private final PasswordEncoder passwordEncoder;
    
    @Override
    public UserDTO createUser(UserDTO userDTO) {
        if (existsByUsername(userDTO.getUsername())) {
            throw new RuntimeException("Username already exists");
        }
        if (existsByEmail(userDTO.getEmail())) {
            throw new RuntimeException("Email already exists");
        }
        if (existsByMatricule(userDTO.getMatricule())) {
            throw new RuntimeException("Matricule already exists");
        }
        
        User user = User.builder()
                .username(userDTO.getUsername())
                .email(userDTO.getEmail())
                .password(passwordEncoder.encode(userDTO.getPassword()))
                .firstName(userDTO.getFirstName())
                .lastName(userDTO.getLastName())
                .matricule(userDTO.getMatricule())
                .phoneNumber(userDTO.getPhoneNumber())
                .role(User.UserRole.valueOf(userDTO.getRole()))
                .status(User.UserStatus.ACTIVE)
                .build();
        
        if (userDTO.getServiceId() != null) {
            focalServiceRepository.findById(userDTO.getServiceId())
                    .ifPresent(user::setService);
        }
        
        User savedUser = userRepository.save(user);
        return convertToDTO(savedUser);
    }
    
    @Override
    public UserDTO updateUser(Long id, UserDTO userDTO) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        user.setFirstName(userDTO.getFirstName());
        user.setLastName(userDTO.getLastName());
        user.setEmail(userDTO.getEmail());
        user.setPhoneNumber(userDTO.getPhoneNumber());
        
        if (userDTO.getPassword() != null && !userDTO.getPassword().isEmpty()) {
            user.setPassword(passwordEncoder.encode(userDTO.getPassword()));
        }
        
        if (userDTO.getRole() != null) {
            user.setRole(User.UserRole.valueOf(userDTO.getRole()));
        }
        
        if (userDTO.getServiceId() != null) {
            focalServiceRepository.findById(userDTO.getServiceId())
                    .ifPresent(user::setService);
        }
        
        User savedUser = userRepository.save(user);
        return convertToDTO(savedUser);
    }
    
    @Override
    public void deleteUser(Long id) {
        if (!userRepository.existsById(id)) {
            throw new RuntimeException("User not found");
        }
        userRepository.deleteById(id);
    }
    
    @Override
    @Transactional(readOnly = true)
    public Optional<UserDTO> getUserById(Long id) {
        return userRepository.findById(id).map(this::convertToDTO);
    }
    
    @Override
    @Transactional(readOnly = true)
    public Optional<UserDTO> getUserByUsername(String username) {
        return userRepository.findByUsername(username).map(this::convertToDTO);
    }
    
    @Override
    @Transactional(readOnly = true)
    public Optional<UserDTO> getUserByEmail(String email) {
        return userRepository.findByEmail(email).map(this::convertToDTO);
    }
    
    @Override
    @Transactional(readOnly = true)
    public List<UserDTO> getAllUsers() {
        return userRepository.findAll().stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }
    
    @Override
    @Transactional(readOnly = true)
    public List<UserDTO> getUsersByRole(User.UserRole role) {
        return userRepository.findByRole(role).stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }
    
    @Override
    @Transactional(readOnly = true)
    public List<UserDTO> getUsersByService(Long serviceId) {
        return userRepository.findByServiceId(serviceId).stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }
    
    @Override
    @Transactional(readOnly = true)
    public List<UserDTO> getActiveUsers() {
        return userRepository.findByStatus(User.UserStatus.ACTIVE).stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }
    
    @Override
    @Transactional(readOnly = true)
    public boolean existsByUsername(String username) {
        return userRepository.existsByUsername(username);
    }
    
    @Override
    @Transactional(readOnly = true)
    public boolean existsByEmail(String email) {
        return userRepository.existsByEmail(email);
    }
    
    @Override
    @Transactional(readOnly = true)
    public boolean existsByMatricule(String matricule) {
        return userRepository.existsByMatricule(matricule);
    }
    
    @Override
    public UserDTO activateUser(Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found"));
        user.setStatus(User.UserStatus.ACTIVE);
        User savedUser = userRepository.save(user);
        return convertToDTO(savedUser);
    }
    
    @Override
    public UserDTO deactivateUser(Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found"));
        user.setStatus(User.UserStatus.INACTIVE);
        User savedUser = userRepository.save(user);
        return convertToDTO(savedUser);
    }
    
    @Override
    public void updateLastLogin(String username) {
        userRepository.findByUsername(username).ifPresent(user -> {
            user.setLastLogin(LocalDateTime.now());
            userRepository.save(user);
        });
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
                .role(user.getRole().name())
                .status(user.getStatus().name())
                .createdAt(user.getCreatedAt())
                .lastLogin(user.getLastLogin())
                .serviceId(user.getService() != null ? user.getService().getId() : null)
                .serviceName(user.getService() != null ? user.getService().getServiceName() : null)
                .build();
    }
}

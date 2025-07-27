package sid.org.suivipf.WEB;

import lombok.AllArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import sid.org.suivipf.DTOS.UserDTO;
import sid.org.suivipf.Service.IUserService;
import sid.org.suivipf.entity.User;

import jakarta.validation.Valid;
import java.util.List;

@RestController
@RequestMapping("/api/users")
@AllArgsConstructor
@CrossOrigin(origins = "http://localhost:4200")
public class UserController {
    
    private final IUserService userService;
    
    @PostMapping
    public ResponseEntity<UserDTO> createUser(@Valid @RequestBody UserDTO userDTO) {
        try {
            UserDTO createdUser = userService.createUser(userDTO);
            return new ResponseEntity<>(createdUser, HttpStatus.CREATED);
        } catch (RuntimeException e) {
            return new ResponseEntity<>(null, HttpStatus.BAD_REQUEST);
        }
    }
    
    @GetMapping
    public ResponseEntity<List<UserDTO>> getAllUsers() {
        List<UserDTO> users = userService.getAllUsers();
        return new ResponseEntity<>(users, HttpStatus.OK);
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<UserDTO> getUserById(@PathVariable Long id) {
        return userService.getUserById(id)
                .map(user -> new ResponseEntity<>(user, HttpStatus.OK))
                .orElse(new ResponseEntity<>(HttpStatus.NOT_FOUND));
    }
    
    @GetMapping("/username/{username}")
    public ResponseEntity<UserDTO> getUserByUsername(@PathVariable String username) {
        return userService.getUserByUsername(username)
                .map(user -> new ResponseEntity<>(user, HttpStatus.OK))
                .orElse(new ResponseEntity<>(HttpStatus.NOT_FOUND));
    }
    
    @GetMapping("/role/{role}")
    public ResponseEntity<List<UserDTO>> getUsersByRole(@PathVariable String role) {
        try {
            User.UserRole userRole = User.UserRole.valueOf(role.toUpperCase());
            List<UserDTO> users = userService.getUsersByRole(userRole);
            return new ResponseEntity<>(users, HttpStatus.OK);
        } catch (IllegalArgumentException e) {
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }
    }
    
    @GetMapping("/service/{serviceId}")
    public ResponseEntity<List<UserDTO>> getUsersByService(@PathVariable Long serviceId) {
        List<UserDTO> users = userService.getUsersByService(serviceId);
        return new ResponseEntity<>(users, HttpStatus.OK);
    }
    
    @GetMapping("/active")
    public ResponseEntity<List<UserDTO>> getActiveUsers() {
        List<UserDTO> users = userService.getActiveUsers();
        return new ResponseEntity<>(users, HttpStatus.OK);
    }
    
    @PutMapping("/{id}")
    public ResponseEntity<UserDTO> updateUser(@PathVariable Long id, @Valid @RequestBody UserDTO userDTO) {
        try {
            UserDTO updatedUser = userService.updateUser(id, userDTO);
            return new ResponseEntity<>(updatedUser, HttpStatus.OK);
        } catch (RuntimeException e) {
            return new ResponseEntity<>(null, HttpStatus.NOT_FOUND);
        }
    }
    
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteUser(@PathVariable Long id) {
        try {
            userService.deleteUser(id);
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        } catch (RuntimeException e) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }
    
    @PutMapping("/{id}/activate")
    public ResponseEntity<UserDTO> activateUser(@PathVariable Long id) {
        try {
            UserDTO activatedUser = userService.activateUser(id);
            return new ResponseEntity<>(activatedUser, HttpStatus.OK);
        } catch (RuntimeException e) {
            return new ResponseEntity<>(null, HttpStatus.NOT_FOUND);
        }
    }
    
    @PutMapping("/{id}/deactivate")
    public ResponseEntity<UserDTO> deactivateUser(@PathVariable Long id) {
        try {
            UserDTO deactivatedUser = userService.deactivateUser(id);
            return new ResponseEntity<>(deactivatedUser, HttpStatus.OK);
        } catch (RuntimeException e) {
            return new ResponseEntity<>(null, HttpStatus.NOT_FOUND);
        }
    }
    
    @GetMapping("/check-username/{username}")
    public ResponseEntity<Boolean> checkUsernameExists(@PathVariable String username) {
        boolean exists = userService.existsByUsername(username);
        return new ResponseEntity<>(exists, HttpStatus.OK);
    }
    
    @GetMapping("/check-email/{email}")
    public ResponseEntity<Boolean> checkEmailExists(@PathVariable String email) {
        boolean exists = userService.existsByEmail(email);
        return new ResponseEntity<>(exists, HttpStatus.OK);
    }
}

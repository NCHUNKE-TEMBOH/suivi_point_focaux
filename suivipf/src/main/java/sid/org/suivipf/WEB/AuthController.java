package sid.org.suivipf.WEB;

import jakarta.validation.Valid;
import lombok.AllArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import sid.org.suivipf.DTOS.LoginRequest;
import sid.org.suivipf.DTOS.LoginResponse;
import sid.org.suivipf.DTOS.UserDTO;
import sid.org.suivipf.Service.IAuthService;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@AllArgsConstructor
@CrossOrigin(origins = "http://localhost:4200")
public class AuthController {

    private final IAuthService authService;

    @PostMapping("/login")
    public ResponseEntity<?> login(@Valid @RequestBody LoginRequest loginRequest) {
        try {
            LoginResponse response = authService.login(loginRequest);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("message", e.getMessage());
            error.put("status", "error");
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(error);
        }
    }

    @PostMapping("/register")
    public ResponseEntity<?> register(@Valid @RequestBody UserDTO userDTO) {
        try {
            UserDTO createdUser = authService.register(userDTO);
            Map<String, Object> response = new HashMap<>();
            response.put("message", "User registered successfully");
            response.put("user", createdUser);
            response.put("status", "success");
            return ResponseEntity.status(HttpStatus.CREATED).body(response);
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("message", e.getMessage());
            error.put("status", "error");
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(error);
        }
    }

    @GetMapping("/me")
    public ResponseEntity<?> getCurrentUser(@RequestHeader("Authorization") String authHeader) {
        try {
            String token = authHeader.substring(7); // Remove "Bearer " prefix
            UserDTO user = authService.getCurrentUser(token);
            return ResponseEntity.ok(user);
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("message", e.getMessage());
            error.put("status", "error");
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(error);
        }
    }

    @PostMapping("/logout")
    public ResponseEntity<?> logout(@RequestHeader("Authorization") String authHeader) {
        try {
            String token = authHeader.substring(7); // Remove "Bearer " prefix
            authService.logout(token);
            Map<String, String> response = new HashMap<>();
            response.put("message", "Logout successful");
            response.put("status", "success");
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("message", e.getMessage());
            error.put("status", "error");
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(error);
        }
    }

    @GetMapping("/validate")
    public ResponseEntity<?> validateToken(@RequestHeader("Authorization") String authHeader) {
        try {
            String token = authHeader.substring(7); // Remove "Bearer " prefix
            boolean isValid = authService.validateToken(token);
            Map<String, Object> response = new HashMap<>();
            response.put("valid", isValid);
            response.put("status", "success");
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, Object> error = new HashMap<>();
            error.put("valid", false);
            error.put("message", e.getMessage());
            error.put("status", "error");
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(error);
        }
    }

    @GetMapping("/user-info")
    public ResponseEntity<?> getUserInfo() {
        try {
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
            if (authentication != null && authentication.isAuthenticated()) {
                Map<String, Object> userInfo = new HashMap<>();
                userInfo.put("username", authentication.getName());
                userInfo.put("authorities", authentication.getAuthorities());
                userInfo.put("authenticated", true);
                return ResponseEntity.ok(userInfo);
            } else {
                Map<String, Object> error = new HashMap<>();
                error.put("authenticated", false);
                error.put("message", "User not authenticated");
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(error);
            }
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("message", e.getMessage());
            error.put("status", "error");
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(error);
        }
    }
}

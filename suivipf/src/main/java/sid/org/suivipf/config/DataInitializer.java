package sid.org.suivipf.config;

import lombok.AllArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import sid.org.suivipf.entity.User;
import sid.org.suivipf.repository.UserRepository;

@Component
@AllArgsConstructor
public class DataInitializer implements CommandLineRunner {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) throws Exception {
        createDefaultUsers();
    }

    private void createDefaultUsers() {
        // Create admin user if not exists
        if (!userRepository.existsByUsername("admin")) {
            User admin = User.builder()
                    .username("admin")
                    .email("admin@minfi.gov.cm")
                    .password(passwordEncoder.encode("admin123"))
                    .firstName("Administrateur")
                    .lastName("Système")
                    .matricule("ADMIN001")
                    .phoneNumber("+237 6XX XXX XXX")
                    .role(User.UserRole.ADMIN)
                    .status(User.UserStatus.ACTIVE)
                    .build();

            userRepository.save(admin);
            System.out.println("✅ Admin user created: username=admin, password=admin123");
        }

        // Create service user if not exists
        if (!userRepository.existsByUsername("service")) {
            User service = User.builder()
                    .username("service")
                    .email("service@minfi.gov.cm")
                    .password(passwordEncoder.encode("service123"))
                    .firstName("Gestionnaire")
                    .lastName("Service")
                    .matricule("SRV001")
                    .phoneNumber("+237 6XX XXX XXX")
                    .role(User.UserRole.SERVICE)
                    .status(User.UserStatus.ACTIVE)
                    .build();

            userRepository.save(service);
            System.out.println("✅ Service user created: username=service, password=service123");
        }

        // Create focal point if not exists
        if (!userRepository.existsByUsername("focal")) {
            User focal = User.builder()
                    .username("focal")
                    .email("focal@minfi.gov.cm")
                    .password(passwordEncoder.encode("focal123"))
                    .firstName("Point")
                    .lastName("Focal")
                    .matricule("FP001")
                    .phoneNumber("+237 6XX XXX XXX")
                    .role(User.UserRole.FOCAL_POINT)
                    .status(User.UserStatus.ACTIVE)
                    .build();

            userRepository.save(focal);
            System.out.println("✅ Focal Point user created: username=focal, password=focal123");
        }

        // Create IT professional if not exists
        if (!userRepository.existsByUsername("itpro")) {
            User itPro = User.builder()
                    .username("itpro")
                    .email("itpro@minfi.gov.cm")
                    .password(passwordEncoder.encode("itpro123"))
                    .firstName("Professionnel")
                    .lastName("IT")
                    .matricule("IT001")
                    .phoneNumber("+237 6XX XXX XXX")
                    .role(User.UserRole.IT_PROFESSIONAL)
                    .status(User.UserStatus.ACTIVE)
                    .build();

            userRepository.save(itPro);
            System.out.println("✅ IT Professional user created: username=itpro, password=itpro123");
        }

        // Create accounting post if not exists
        if (!userRepository.existsByUsername("accounting")) {
            User accounting = User.builder()
                    .username("accounting")
                    .email("accounting@minfi.gov.cm")
                    .password(passwordEncoder.encode("accounting123"))
                    .firstName("Poste")
                    .lastName("Comptable")
                    .matricule("ACC001")
                    .phoneNumber("+237 6XX XXX XXX")
                    .role(User.UserRole.ACCOUNTING_POST)
                    .status(User.UserStatus.ACTIVE)
                    .build();

            userRepository.save(accounting);
            System.out.println("✅ Accounting Post user created: username=accounting, password=accounting123");
        }

        // Create regular user if not exists
        if (!userRepository.existsByUsername("user")) {
            User user = User.builder()
                    .username("user")
                    .email("user@minfi.gov.cm")
                    .password(passwordEncoder.encode("user123"))
                    .firstName("Utilisateur")
                    .lastName("Standard")
                    .matricule("USR001")
                    .phoneNumber("+237 6XX XXX XXX")
                    .role(User.UserRole.USER)
                    .status(User.UserStatus.ACTIVE)
                    .build();

            userRepository.save(user);
            System.out.println("✅ Regular User created: username=user, password=user123");
        }
    }
}

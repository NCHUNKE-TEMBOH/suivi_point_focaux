package sid.org.suivipf.config;

import lombok.AllArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfigurationSource;

@Configuration
@EnableWebSecurity
@EnableMethodSecurity(prePostEnabled = true)
@AllArgsConstructor
public class SecurityConfig {

    private final JwtAuthenticationFilter jwtAuthenticationFilter;
    private final CorsConfigurationSource corsConfigurationSource;

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
            .cors(cors -> cors.configurationSource(corsConfigurationSource))
            .csrf(csrf -> csrf.disable())
            .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
            .authorizeHttpRequests(authz -> authz
                // Public endpoints
                .requestMatchers("/api/auth/**").permitAll()
                .requestMatchers("/api/public/**").permitAll()
                .requestMatchers("/h2-console/**").permitAll()

                // Admin - Full access to everything (Admin can access ALL endpoints)
                .requestMatchers("/api/admin/**").hasRole("ADMIN")
                .requestMatchers("/api/users/**").hasRole("ADMIN")
                .requestMatchers("/api/system/**").hasRole("ADMIN")

                // Service - Manages focal points and accounting posts
                .requestMatchers("/api/focal-points/manage/**").hasAnyRole("ADMIN", "SERVICE")
                .requestMatchers("/api/comptable-posts/manage/**").hasAnyRole("ADMIN", "SERVICE")
                .requestMatchers("/api/services/**").hasAnyRole("ADMIN", "SERVICE")

                // IT Professional - Manages interventions (create, track, validate)
                .requestMatchers("/api/interventions/validate/**").hasAnyRole("ADMIN", "IT_PROFESSIONAL")
                .requestMatchers("/api/interventions/manage/**").hasAnyRole("ADMIN", "IT_PROFESSIONAL")

                // Focal Point - Creates and tracks intervention sheets
                .requestMatchers("/api/intervention-sheets/**").hasAnyRole("ADMIN", "FOCAL_POINT", "IT_PROFESSIONAL")

                // Accounting Post - Creates and tracks interventions
                .requestMatchers("/api/interventions/create").hasAnyRole("ADMIN", "ACCOUNTING_POST", "IT_PROFESSIONAL", "FOCAL_POINT")
                .requestMatchers("/api/interventions/track/**").hasAnyRole("ADMIN", "ACCOUNTING_POST", "IT_PROFESSIONAL", "FOCAL_POINT")

                // General intervention access (Admin has access to everything)
                .requestMatchers("/api/interventions/**").hasAnyRole("ADMIN", "SERVICE", "FOCAL_POINT", "IT_PROFESSIONAL", "ACCOUNTING_POST")

                // Dashboard and reports - All authenticated users can view (Admin has full access)
                .requestMatchers("/api/dashboard/**").authenticated()
                .requestMatchers("/api/reports/**").authenticated()
                .requestMatchers("/AllCountablePost").authenticated()

                // General endpoints (Admin has access to everything)
                .requestMatchers("/api/comptable-posts/**").hasAnyRole("ADMIN", "SERVICE", "FOCAL_POINT", "IT_PROFESSIONAL", "ACCOUNTING_POST", "USER")
                .requestMatchers("/api/focal-points/**").hasAnyRole("ADMIN", "SERVICE", "FOCAL_POINT", "IT_PROFESSIONAL", "ACCOUNTING_POST", "USER")

                // All other requests require authentication (Admin has access to everything)
                .anyRequest().authenticated()
            )
            .addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class)
            .headers(headers -> headers.frameOptions(frameOptions -> frameOptions.disable())); // For H2 console

        return http.build();
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }
}

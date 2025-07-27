package sid.org.suivipf.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "users")
@Getter @Setter @ToString @NoArgsConstructor
@AllArgsConstructor @Builder
public class User {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(unique = true, nullable = false)
    private String username;
    
    @Column(unique = true, nullable = false)
    private String email;
    
    @Column(nullable = false)
    private String password;
    
    private String firstName;
    private String lastName;
    private String matricule; // Employee ID for Cameroonian civil servants
    private String phoneNumber;
    
    @Enumerated(EnumType.STRING)
    @Column(length = 20)
    private UserRole role;
    
    @Enumerated(EnumType.STRING)
    private UserStatus status;
    
    private LocalDateTime createdAt;
    private LocalDateTime lastLogin;
    
    // Relationships
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "service_id")
    private FocalService service;
    
    @OneToMany(mappedBy = "itProfessional", cascade = CascadeType.ALL)
    private List<Intervention> interventions;
    
    @OneToMany(mappedBy = "focalPointUser", cascade = CascadeType.ALL)
    private List<Intervention> validatedInterventions;
    
    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
    }
    
    public enum UserRole {
        ACCOUNTING_POST,     // Creates interventions, tracks interventions
        IT_PROFESSIONAL,     // Manages interventions (create, track, validate)
        FOCAL_POINT,         // Creates and tracks intervention sheets
        USER,                // Views dashboards and reports
        SERVICE,             // Manages focal points and accounting posts
        ADMIN                // Views all dashboards and reports, full access
    }
    
    public enum UserStatus {
        ACTIVE,
        INACTIVE,
        SUSPENDED
    }
}

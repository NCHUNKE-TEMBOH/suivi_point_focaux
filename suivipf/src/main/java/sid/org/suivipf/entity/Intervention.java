package sid.org.suivipf.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;
import java.util.List;

@Entity
@AllArgsConstructor @NoArgsConstructor @Getter @Setter @Builder @ToString
public class Intervention {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String title; // Intervention title

    @Column(length = 2000)
    private String description; // Detailed description

    @Column(length = 1000)
    private String problemDescription; // Problem encountered

    @Column(length = 1000)
    private String solutionDescription; // Solution provided

    @Enumerated(EnumType.STRING)
    private InterventionType type;

    @Enumerated(EnumType.STRING)
    private InterventionPriority priority;

    @Enumerated(EnumType.STRING)
    private InterventionStatus status;

    private LocalDateTime interventionDate;
    private LocalDateTime startTime;
    private LocalDateTime endTime;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    private String equipmentAffected; // Equipment or system affected
    private Integer estimatedDuration; // Estimated duration in minutes
    private Integer actualDuration; // Actual duration in minutes

    // Validation fields
    private LocalDateTime validatedAt;
    private String validationComments;
    private Boolean isValidated;

    // Relationships
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "it_professional_id")
    private User itProfessional; // IT professional who performed intervention

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "focal_point_user_id")
    private User focalPointUser; // Focal point who validates

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "focal_point_id")
    private FocalPoint focalPoint; // Focal point entity

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "comptable_post_id")
    private ComptablePost comptablePost;

    @OneToMany(mappedBy = "intervention", cascade = CascadeType.ALL)
    private List<InterventionCourriel> emails;

    @OneToMany(mappedBy = "intervention", cascade = CascadeType.ALL)
    private List<InformationSheet> informationSheets;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
        if (status == null) {
            status = InterventionStatus.PENDING;
        }
        if (isValidated == null) {
            isValidated = false;
        }
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }

    public enum InterventionType {
        HARDWARE_REPAIR,
        SOFTWARE_INSTALLATION,
        NETWORK_CONFIGURATION,
        SYSTEM_MAINTENANCE,
        USER_TRAINING,
        TECHNICAL_SUPPORT,
        SECURITY_UPDATE,
        DATA_BACKUP,
        OTHER
    }

    public enum InterventionPriority {
        LOW,
        MEDIUM,
        HIGH,
        CRITICAL
    }

    public enum InterventionStatus {
        PENDING,
        IN_PROGRESS,
        COMPLETED,
        VALIDATED,
        REJECTED,
        CANCELLED
    }
}

package sid.org.suivipf.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Table(name = "intervention_sheets")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class InterventionSheet {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(nullable = false)
    private String title;
    
    @Column(length = 2000)
    private String description;
    
    @Column(length = 5000)
    private String content;
    
    @Column(length = 500)
    private String summary;
    
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private SheetType sheetType;
    
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private SheetStatus status;
    
    @Column(length = 1000)
    private String notes;
    
    @Column(nullable = false)
    private LocalDateTime createdAt;
    
    private LocalDateTime updatedAt;
    
    private LocalDateTime approvedAt;
    
    // Relationships
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "intervention_id")
    private Intervention intervention;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "created_by_user_id", nullable = false)
    private User createdBy;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "approved_by_user_id")
    private User approvedBy;
    
    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
        if (status == null) {
            status = SheetStatus.DRAFT;
        }
    }
    
    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }
    
    public enum SheetType {
        INTERVENTION_REPORT,
        TECHNICAL_DOCUMENTATION,
        USER_MANUAL,
        INCIDENT_REPORT,
        MAINTENANCE_LOG,
        TRAINING_MATERIAL,
        INSTALLATION_GUIDE,
        TROUBLESHOOTING_GUIDE
    }
    
    public enum SheetStatus {
        DRAFT,
        PENDING_REVIEW,
        UNDER_REVIEW,
        APPROVED,
        REJECTED,
        ARCHIVED
    }
}

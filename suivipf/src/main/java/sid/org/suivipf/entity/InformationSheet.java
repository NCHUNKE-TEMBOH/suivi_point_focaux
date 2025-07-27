package sid.org.suivipf.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Getter @Setter @Builder @AllArgsConstructor
@NoArgsConstructor @ToString
public class InformationSheet {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String sheetTitle;

    @Column(length = 3000)
    private String content; // Detailed content of the information sheet

    @Column(length = 1000)
    private String summary; // Brief summary

    @Enumerated(EnumType.STRING)
    private SheetType sheetType;

    @Enumerated(EnumType.STRING)
    private SheetStatus status;

    private String createdBy; // User who created the sheet
    private String approvedBy; // User who approved the sheet

    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private LocalDateTime approvedAt;

    private String filePath; // Path to attached file if any
    private String fileName; // Original file name

    // Relationships
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "intervention_id")
    private Intervention intervention;

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
        TRAINING_MATERIAL
    }

    public enum SheetStatus {
        DRAFT,
        PENDING_APPROVAL,
        APPROVED,
        REJECTED,
        ARCHIVED
    }
}

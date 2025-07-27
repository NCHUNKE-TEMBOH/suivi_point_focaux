package sid.org.suivipf.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@AllArgsConstructor @NoArgsConstructor @Builder @Getter
@Setter @ToString
public class InterventionCourriel {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String subject; // Email subject (renamed from Object)

    @Column(length = 2000)
    private String content; // Email content/body

    @Column(nullable = false)
    private String recipientEmail;

    private String senderEmail;
    private String ccEmails; // Comma-separated CC emails

    @Enumerated(EnumType.STRING)
    private EmailType emailType;

    @Enumerated(EnumType.STRING)
    private EmailStatus status;

    private LocalDateTime emailDate; // Renamed from CourielDate
    private LocalDateTime sentAt;
    private LocalDateTime deliveredAt;

    // Relationships
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "intervention_id")
    private Intervention intervention;

    @PrePersist
    protected void onCreate() {
        emailDate = LocalDateTime.now();
        if (status == null) {
            status = EmailStatus.PENDING;
        }
    }

    public enum EmailType {
        INTERVENTION_CREATED,
        INTERVENTION_UPDATED,
        VALIDATION_REQUEST,
        VALIDATION_APPROVED,
        VALIDATION_REJECTED,
        REMINDER,
        COMPLETION_NOTICE
    }

    public enum EmailStatus {
        PENDING,
        SENT,
        DELIVERED,
        FAILED,
        BOUNCED
    }
}
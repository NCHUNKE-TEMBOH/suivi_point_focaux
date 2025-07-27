package sid.org.suivipf.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;
import java.util.List;

@Entity
@NoArgsConstructor
@AllArgsConstructor
@Getter @Setter @Builder @ToString
public class FocalPoint {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String firstName;

    @Column(nullable = false)
    private String lastName;

    @Column(unique = true, nullable = false)
    private String matricule; // Civil servant matricule number

    private String email;
    private String phoneNumber;
    private String position; // Job position/title

    @Enumerated(EnumType.STRING)
    private FocalPointStatus status;

    private LocalDateTime assignedAt;
    private LocalDateTime lastActiveAt;

    // Relationships
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "comptable_post_id")
    private ComptablePost comptablePost;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    private User user; // Link to User entity for authentication

    @OneToMany(mappedBy = "focalPoint", cascade = CascadeType.ALL)
    private List<Intervention> validatedInterventions;

    @PrePersist
    protected void onCreate() {
        assignedAt = LocalDateTime.now();
        lastActiveAt = LocalDateTime.now();
    }

    public enum FocalPointStatus {
        ACTIVE,
        INACTIVE,
        ON_LEAVE,
        TRANSFERRED
    }
}

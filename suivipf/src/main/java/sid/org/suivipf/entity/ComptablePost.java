package sid.org.suivipf.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;
import java.util.List;

@Entity
@Getter @Setter @ToString @NoArgsConstructor
@AllArgsConstructor @Builder
public class ComptablePost {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true, nullable = false)
    private String CodePc; // Post code (e.g., PGT001, DGB002)

    @Column(nullable = false)
    private String postname; // Post name in French

    private String description;
    private String location; // Physical location
    private String region; // Cameroonian region (Centre, Littoral, etc.)
    private String city;

    @Enumerated(EnumType.STRING)
    private PostStatus status;

    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    // Relationships
    @OneToMany(mappedBy = "comptablePost", cascade = CascadeType.ALL)
    private List<FocalPoint> focalPoints;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "service_id")
    private FocalService service;

    @OneToMany(mappedBy = "comptablePost", cascade = CascadeType.ALL)
    private List<Intervention> interventions;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }

    public enum PostStatus {
        ACTIVE,
        INACTIVE,
        MAINTENANCE
    }
}

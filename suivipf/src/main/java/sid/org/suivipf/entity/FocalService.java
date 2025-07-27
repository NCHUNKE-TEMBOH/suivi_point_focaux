package sid.org.suivipf.entity;

import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;
import lombok.*;

import java.util.List;

@Entity
@Getter @Setter @ToString @NoArgsConstructor
@AllArgsConstructor @Builder
public class FocalService {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String serviceName;

    private String serviceCode; // Service code for Cameroonian Ministry
    private String description;
    private String location; // Physical location within ministry
    private String managerName;
    private String managerEmail;

    // Relationships
    @OneToMany(mappedBy = "service", cascade = CascadeType.ALL)
    @JsonManagedReference
    private List<User> users;

    @OneToMany(mappedBy = "service", cascade = CascadeType.ALL)
    private List<ComptablePost> comptablePosts;
}

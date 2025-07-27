package sid.org.suivipf.DTOS;

import lombok.*;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class FocalPointDTO {
    private Long id;
    private String firstName;
    private String lastName;
    private String matricule;
    private String email;
    private String phoneNumber;
    private String position;
    private String status;
    private LocalDateTime assignedAt;
    private Long comptablePostId;
    private String comptablePostName;
    private Long userId;
    private String username;
}

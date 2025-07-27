package sid.org.suivipf.DTOS;

import lombok.*;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class InterventionDTO {
    private Long id;
    private String title;
    private String description;
    private String problemDescription;
    private String solutionDescription;
    private String type;
    private String priority;
    private String status;
    private LocalDateTime interventionDate;
    private LocalDateTime startTime;
    private LocalDateTime endTime;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private String equipmentAffected;
    private Integer estimatedDuration;
    private Integer actualDuration;
    
    // Validation fields
    private LocalDateTime validatedAt;
    private String validationComments;
    private Boolean isValidated;
    
    // Related entities
    private Long itProfessionalId;
    private String itProfessionalName;
    private Long focalPointUserId;
    private String focalPointUserName;
    private Long focalPointId;
    private String focalPointName;
    private Long comptablePostId;
    private String comptablePostName;
    private String comptablePostCode;
}

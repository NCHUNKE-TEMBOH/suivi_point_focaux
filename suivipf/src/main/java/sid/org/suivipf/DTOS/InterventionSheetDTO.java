package sid.org.suivipf.DTOS;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class InterventionSheetDTO {
    
    private Long id;
    private String title;
    private String description;
    private String content;
    private String summary;
    private String sheetType;
    private String status;
    private String notes;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private LocalDateTime approvedAt;
    
    // Related entities
    private Long interventionId;
    private String interventionTitle;
    private Long createdByUserId;
    private String createdByUserName;
    private Long approvedByUserId;
    private String approvedByUserName;
}

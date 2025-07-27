package sid.org.suivipf.DTOS;

import lombok.*;

import java.time.LocalDateTime;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AccountPostDTO {
    private Long id;
    private String codePc;
    private String postname;
    private String description;
    private String location;
    private String region;
    private String city;
    private String status;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private Long serviceId;
    private String serviceName;
    private List<FocalPointDTO> focalPoints;
    private Integer interventionCount;
}

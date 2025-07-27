package sid.org.suivipf.DTOS;

import lombok.*;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class FocalServiceDTO {
    private Long id;
    private String serviceName;
    private String serviceCode;
    private String description;
    private String location;
    private String managerName;
    private String managerEmail;
    private List<UserDTO> users;
    private List<AccountPostDTO> comptablePosts;
    private Integer userCount;
    private Integer postCount;
}

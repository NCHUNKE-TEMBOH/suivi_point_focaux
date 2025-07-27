package sid.org.suivipf.WEB;

import lombok.AllArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;
import sid.org.suivipf.Service.IserviceCountablePost;
import sid.org.suivipf.entity.ComptablePost;

import java.util.List;

@RestController @AllArgsConstructor
public class PostComptableRestController {
    private IserviceCountablePost serviceCountablePost;

    @GetMapping("/AllCountablePost")
    public List<ComptablePost> AllCountablePost() {
        return serviceCountablePost.getComptablePosts();
    }

}

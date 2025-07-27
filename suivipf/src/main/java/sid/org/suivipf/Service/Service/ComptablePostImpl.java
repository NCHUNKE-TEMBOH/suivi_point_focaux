package sid.org.suivipf.Service.Service;

import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;
import sid.org.suivipf.Service.IserviceCountablePost;
import sid.org.suivipf.entity.ComptablePost;
import sid.org.suivipf.repository.ComptablePostRepository;

import java.util.List;

@Service
@AllArgsConstructor
public class ComptablePostImpl implements IserviceCountablePost {
    private ComptablePostRepository comptablePostRepository;
    @Override
    public List<ComptablePost> getComptablePosts() {
        return comptablePostRepository.findAll();
    }
}

package sid.org.suivipf.DTOS;

import org.springframework.beans.BeanUtils;
import sid.org.suivipf.entity.ComptablePost;

public class Mapper {

    public  AccountPostDTO FromPostComtable(ComptablePost comptablePost){
        AccountPostDTO accountPostDTO = new AccountPostDTO();
        BeanUtils.copyProperties(comptablePost,accountPostDTO);
        return accountPostDTO;




    }
}

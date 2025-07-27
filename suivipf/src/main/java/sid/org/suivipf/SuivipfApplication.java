package sid.org.suivipf;

import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import sid.org.suivipf.repository.ComptablePostRepository;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import sid.org.suivipf.entity.ComptablePost;


@SpringBootApplication
public class SuivipfApplication {
//private ComptablePostRepository comptablePostRepository;
	public static void main(String[] args) {
		SpringApplication.run(SuivipfApplication.class, args)
		;
	}


	@Bean
	CommandLineRunner commandLineRunner(ComptablePostRepository comptablePostRepository) {
		return args -> {
			// Initialize sample Cameroonian Ministry of Finance accounting posts
			if (comptablePostRepository.count() == 0) {
				ComptablePost[] posts = {
					ComptablePost.builder()
						.postname("Paierie Générale du Trésor")
						.CodePc("PGT001")
						.build(),
					ComptablePost.builder()
						.postname("Direction Générale du Budget")
						.CodePc("DGB002")
						.build(),
					ComptablePost.builder()
						.postname("Direction Générale des Impôts")
						.CodePc("DGI003")
						.build(),
					ComptablePost.builder()
						.postname("Direction Générale des Douanes")
						.CodePc("DGD004")
						.build(),
					ComptablePost.builder()
						.postname("Contrôle Financier Central")
						.CodePc("CFC005")
						.build()
				};

				for (ComptablePost post : posts) {
					comptablePostRepository.save(post);
				}
			}
		};
	}




}

package sid.org.suivipf.repository;

import sid.org.suivipf.entity.FocalService;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface FocalServiceRepository extends JpaRepository<FocalService, Long> {
}
package sid.org.suivipf.repository;

import sid.org.suivipf.entity.InterventionCourriel;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface InterventionCourrielRepository extends JpaRepository<InterventionCourriel, Long> {
    // Custom query methods can be defined here if needed
}
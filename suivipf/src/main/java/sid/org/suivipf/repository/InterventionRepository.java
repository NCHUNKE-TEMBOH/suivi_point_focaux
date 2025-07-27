package sid.org.suivipf.repository;

import sid.org.suivipf.entity.Intervention;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface InterventionRepository extends JpaRepository<Intervention, Long> {
    // Custom query methods can be defined here if needed
}
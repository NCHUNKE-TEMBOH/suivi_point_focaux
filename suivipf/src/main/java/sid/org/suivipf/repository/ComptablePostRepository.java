package sid.org.suivipf.repository;

import sid.org.suivipf.entity.ComptablePost; // Import your entity
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ComptablePostRepository extends JpaRepository<ComptablePost, Long> {
    // Additional query methods can be defined here if needed
}
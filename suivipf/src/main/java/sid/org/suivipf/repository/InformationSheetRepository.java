package sid.org.suivipf.repository;

import sid.org.suivipf.entity.InformationSheet;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface InformationSheetRepository extends JpaRepository<InformationSheet, Long> {
    // You can define custom query methods here if needed
}
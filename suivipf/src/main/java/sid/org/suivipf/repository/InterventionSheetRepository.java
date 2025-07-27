package sid.org.suivipf.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import sid.org.suivipf.entity.InterventionSheet;

import java.util.List;

@Repository
public interface InterventionSheetRepository extends JpaRepository<InterventionSheet, Long> {
    
    List<InterventionSheet> findByCreatedByIdOrderByCreatedAtDesc(Long userId);
    
    List<InterventionSheet> findByStatusOrderByCreatedAtDesc(InterventionSheet.SheetStatus status);
    
    List<InterventionSheet> findBySheetTypeOrderByCreatedAtDesc(InterventionSheet.SheetType sheetType);
    
    List<InterventionSheet> findByInterventionIdOrderByCreatedAtDesc(Long interventionId);
    
    @Query("SELECT s FROM InterventionSheet s WHERE s.title LIKE %:keyword% OR s.description LIKE %:keyword% ORDER BY s.createdAt DESC")
    List<InterventionSheet> findByKeywordOrderByCreatedAtDesc(@Param("keyword") String keyword);
    
    @Query("SELECT COUNT(s) FROM InterventionSheet s WHERE s.status = :status")
    long countByStatus(@Param("status") InterventionSheet.SheetStatus status);
    
    @Query("SELECT COUNT(s) FROM InterventionSheet s WHERE s.createdBy.id = :userId")
    long countByCreatedById(@Param("userId") Long userId);
}

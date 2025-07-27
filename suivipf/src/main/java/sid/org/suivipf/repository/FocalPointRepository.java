package sid.org.suivipf.repository;

import sid.org.suivipf.entity.FocalPoint;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface FocalPointRepository extends JpaRepository<FocalPoint, Long> {
}
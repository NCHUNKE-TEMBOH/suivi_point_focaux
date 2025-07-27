package sid.org.suivipf.Service;

import sid.org.suivipf.DTOS.InterventionDTO;
import sid.org.suivipf.entity.Intervention;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

public interface IInterventionService {
    
    InterventionDTO createIntervention(InterventionDTO interventionDTO);
    
    InterventionDTO updateIntervention(Long id, InterventionDTO interventionDTO);
    
    void deleteIntervention(Long id);
    
    Optional<InterventionDTO> getInterventionById(Long id);
    
    List<InterventionDTO> getAllInterventions();
    
    List<InterventionDTO> getInterventionsByItProfessional(Long itProfessionalId);
    
    List<InterventionDTO> getInterventionsByComptablePost(Long comptablePostId);
    
    List<InterventionDTO> getInterventionsByStatus(Intervention.InterventionStatus status);
    
    List<InterventionDTO> getInterventionsByPriority(Intervention.InterventionPriority priority);
    
    List<InterventionDTO> getInterventionsByDateRange(LocalDateTime startDate, LocalDateTime endDate);
    
    List<InterventionDTO> getPendingValidationInterventions();
    
    InterventionDTO validateIntervention(Long id, Long focalPointUserId, String comments);
    
    InterventionDTO rejectIntervention(Long id, Long focalPointUserId, String comments);
    
    InterventionDTO markAsCompleted(Long id);
    
    List<InterventionDTO> getInterventionsForValidation(Long focalPointUserId);
}

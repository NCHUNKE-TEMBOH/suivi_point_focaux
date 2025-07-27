package sid.org.suivipf.Service;

import sid.org.suivipf.DTOS.InterventionSheetDTO;
import sid.org.suivipf.entity.InterventionSheet;

import java.util.List;
import java.util.Optional;

public interface IInterventionSheetService {
    
    List<InterventionSheetDTO> getAllSheets();
    
    Optional<InterventionSheetDTO> getSheetById(Long id);
    
    List<InterventionSheetDTO> getSheetsByCreatedBy(Long userId);
    
    List<InterventionSheetDTO> getSheetsByStatus(String status);
    
    List<InterventionSheetDTO> getSheetsByType(String sheetType);
    
    List<InterventionSheetDTO> getSheetsByIntervention(Long interventionId);
    
    List<InterventionSheetDTO> searchSheets(String keyword);
    
    InterventionSheetDTO createSheet(InterventionSheetDTO sheetDTO);
    
    InterventionSheetDTO updateSheet(Long id, InterventionSheetDTO sheetDTO);
    
    void deleteSheet(Long id);
    
    InterventionSheetDTO approveSheet(Long id, Long approvedByUserId);
    
    InterventionSheetDTO rejectSheet(Long id, Long rejectedByUserId, String reason);
    
    long getSheetCountByStatus(String status);
    
    long getSheetCountByUser(Long userId);
}

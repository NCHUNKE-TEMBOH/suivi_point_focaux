package sid.org.suivipf.Service.Service;

import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import sid.org.suivipf.DTOS.InterventionSheetDTO;
import sid.org.suivipf.Service.IInterventionSheetService;
import sid.org.suivipf.entity.InterventionSheet;
import sid.org.suivipf.entity.Intervention;
import sid.org.suivipf.entity.User;
import sid.org.suivipf.repository.InterventionSheetRepository;
import sid.org.suivipf.repository.InterventionRepository;
import sid.org.suivipf.repository.UserRepository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@AllArgsConstructor
@Transactional
public class InterventionSheetServiceImpl implements IInterventionSheetService {

    private final InterventionSheetRepository sheetRepository;
    private final InterventionRepository interventionRepository;
    private final UserRepository userRepository;

    @Override
    public List<InterventionSheetDTO> getAllSheets() {
        return sheetRepository.findAll().stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    @Override
    public Optional<InterventionSheetDTO> getSheetById(Long id) {
        return sheetRepository.findById(id)
                .map(this::convertToDTO);
    }

    @Override
    public List<InterventionSheetDTO> getSheetsByCreatedBy(Long userId) {
        return sheetRepository.findByCreatedByIdOrderByCreatedAtDesc(userId).stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    @Override
    public List<InterventionSheetDTO> getSheetsByStatus(String status) {
        InterventionSheet.SheetStatus sheetStatus = InterventionSheet.SheetStatus.valueOf(status);
        return sheetRepository.findByStatusOrderByCreatedAtDesc(sheetStatus).stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    @Override
    public List<InterventionSheetDTO> getSheetsByType(String sheetType) {
        InterventionSheet.SheetType type = InterventionSheet.SheetType.valueOf(sheetType);
        return sheetRepository.findBySheetTypeOrderByCreatedAtDesc(type).stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    @Override
    public List<InterventionSheetDTO> getSheetsByIntervention(Long interventionId) {
        return sheetRepository.findByInterventionIdOrderByCreatedAtDesc(interventionId).stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    @Override
    public List<InterventionSheetDTO> searchSheets(String keyword) {
        return sheetRepository.findByKeywordOrderByCreatedAtDesc(keyword).stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    @Override
    public InterventionSheetDTO createSheet(InterventionSheetDTO sheetDTO) {
        InterventionSheet sheet = convertToEntity(sheetDTO);
        
        // Set created by user
        User createdBy = userRepository.findById(sheetDTO.getCreatedByUserId())
                .orElseThrow(() -> new RuntimeException("User not found"));
        sheet.setCreatedBy(createdBy);
        
        // Set intervention if provided
        if (sheetDTO.getInterventionId() != null) {
            Intervention intervention = interventionRepository.findById(sheetDTO.getInterventionId())
                    .orElseThrow(() -> new RuntimeException("Intervention not found"));
            sheet.setIntervention(intervention);
        }
        
        InterventionSheet savedSheet = sheetRepository.save(sheet);
        return convertToDTO(savedSheet);
    }

    @Override
    public InterventionSheetDTO updateSheet(Long id, InterventionSheetDTO sheetDTO) {
        InterventionSheet existingSheet = sheetRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Intervention sheet not found"));
        
        // Update fields
        existingSheet.setTitle(sheetDTO.getTitle());
        existingSheet.setDescription(sheetDTO.getDescription());
        existingSheet.setContent(sheetDTO.getContent());
        existingSheet.setSummary(sheetDTO.getSummary());
        existingSheet.setNotes(sheetDTO.getNotes());
        
        if (sheetDTO.getSheetType() != null) {
            existingSheet.setSheetType(InterventionSheet.SheetType.valueOf(sheetDTO.getSheetType()));
        }
        
        if (sheetDTO.getStatus() != null) {
            existingSheet.setStatus(InterventionSheet.SheetStatus.valueOf(sheetDTO.getStatus()));
        }
        
        InterventionSheet savedSheet = sheetRepository.save(existingSheet);
        return convertToDTO(savedSheet);
    }

    @Override
    public void deleteSheet(Long id) {
        if (!sheetRepository.existsById(id)) {
            throw new RuntimeException("Intervention sheet not found");
        }
        sheetRepository.deleteById(id);
    }

    @Override
    public InterventionSheetDTO approveSheet(Long id, Long approvedByUserId) {
        InterventionSheet sheet = sheetRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Intervention sheet not found"));
        
        User approvedBy = userRepository.findById(approvedByUserId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        sheet.setStatus(InterventionSheet.SheetStatus.APPROVED);
        sheet.setApprovedBy(approvedBy);
        sheet.setApprovedAt(LocalDateTime.now());
        
        InterventionSheet savedSheet = sheetRepository.save(sheet);
        return convertToDTO(savedSheet);
    }

    @Override
    public InterventionSheetDTO rejectSheet(Long id, Long rejectedByUserId, String reason) {
        InterventionSheet sheet = sheetRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Intervention sheet not found"));
        
        User rejectedBy = userRepository.findById(rejectedByUserId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        sheet.setStatus(InterventionSheet.SheetStatus.REJECTED);
        sheet.setApprovedBy(rejectedBy);
        sheet.setNotes(sheet.getNotes() + "\n\nRejection reason: " + reason);
        
        InterventionSheet savedSheet = sheetRepository.save(sheet);
        return convertToDTO(savedSheet);
    }

    @Override
    public long getSheetCountByStatus(String status) {
        InterventionSheet.SheetStatus sheetStatus = InterventionSheet.SheetStatus.valueOf(status);
        return sheetRepository.countByStatus(sheetStatus);
    }

    @Override
    public long getSheetCountByUser(Long userId) {
        return sheetRepository.countByCreatedById(userId);
    }

    private InterventionSheetDTO convertToDTO(InterventionSheet sheet) {
        return InterventionSheetDTO.builder()
                .id(sheet.getId())
                .title(sheet.getTitle())
                .description(sheet.getDescription())
                .content(sheet.getContent())
                .summary(sheet.getSummary())
                .sheetType(sheet.getSheetType().toString())
                .status(sheet.getStatus().toString())
                .notes(sheet.getNotes())
                .createdAt(sheet.getCreatedAt())
                .updatedAt(sheet.getUpdatedAt())
                .approvedAt(sheet.getApprovedAt())
                .interventionId(sheet.getIntervention() != null ? sheet.getIntervention().getId() : null)
                .interventionTitle(sheet.getIntervention() != null ? sheet.getIntervention().getTitle() : null)
                .createdByUserId(sheet.getCreatedBy().getId())
                .createdByUserName(sheet.getCreatedBy().getFirstName() + " " + sheet.getCreatedBy().getLastName())
                .approvedByUserId(sheet.getApprovedBy() != null ? sheet.getApprovedBy().getId() : null)
                .approvedByUserName(sheet.getApprovedBy() != null ? 
                    sheet.getApprovedBy().getFirstName() + " " + sheet.getApprovedBy().getLastName() : null)
                .build();
    }

    private InterventionSheet convertToEntity(InterventionSheetDTO dto) {
        return InterventionSheet.builder()
                .title(dto.getTitle())
                .description(dto.getDescription())
                .content(dto.getContent())
                .summary(dto.getSummary())
                .sheetType(dto.getSheetType() != null ? InterventionSheet.SheetType.valueOf(dto.getSheetType()) : null)
                .status(dto.getStatus() != null ? InterventionSheet.SheetStatus.valueOf(dto.getStatus()) : InterventionSheet.SheetStatus.DRAFT)
                .notes(dto.getNotes())
                .build();
    }
}

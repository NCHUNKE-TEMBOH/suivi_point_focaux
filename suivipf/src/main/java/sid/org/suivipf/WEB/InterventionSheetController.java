package sid.org.suivipf.WEB;

import lombok.AllArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import sid.org.suivipf.DTOS.InterventionSheetDTO;
import sid.org.suivipf.Service.IInterventionSheetService;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/intervention-sheets")
@AllArgsConstructor
@CrossOrigin(origins = "http://localhost:4200")
public class InterventionSheetController {

    private final IInterventionSheetService sheetService;

    @GetMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'FOCAL_POINT', 'IT_PROFESSIONAL')")
    public ResponseEntity<List<InterventionSheetDTO>> getAllSheets() {
        List<InterventionSheetDTO> sheets = sheetService.getAllSheets();
        return ResponseEntity.ok(sheets);
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'FOCAL_POINT', 'IT_PROFESSIONAL')")
    public ResponseEntity<InterventionSheetDTO> getSheetById(@PathVariable Long id) {
        return sheetService.getSheetById(id)
                .map(sheet -> ResponseEntity.ok(sheet))
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/user/{userId}")
    @PreAuthorize("hasAnyRole('ADMIN', 'FOCAL_POINT', 'IT_PROFESSIONAL')")
    public ResponseEntity<List<InterventionSheetDTO>> getSheetsByUser(@PathVariable Long userId) {
        List<InterventionSheetDTO> sheets = sheetService.getSheetsByCreatedBy(userId);
        return ResponseEntity.ok(sheets);
    }

    @GetMapping("/status/{status}")
    @PreAuthorize("hasAnyRole('ADMIN', 'FOCAL_POINT', 'IT_PROFESSIONAL')")
    public ResponseEntity<List<InterventionSheetDTO>> getSheetsByStatus(@PathVariable String status) {
        List<InterventionSheetDTO> sheets = sheetService.getSheetsByStatus(status);
        return ResponseEntity.ok(sheets);
    }

    @GetMapping("/type/{type}")
    @PreAuthorize("hasAnyRole('ADMIN', 'FOCAL_POINT', 'IT_PROFESSIONAL')")
    public ResponseEntity<List<InterventionSheetDTO>> getSheetsByType(@PathVariable String type) {
        List<InterventionSheetDTO> sheets = sheetService.getSheetsByType(type);
        return ResponseEntity.ok(sheets);
    }

    @GetMapping("/intervention/{interventionId}")
    @PreAuthorize("hasAnyRole('ADMIN', 'FOCAL_POINT', 'IT_PROFESSIONAL')")
    public ResponseEntity<List<InterventionSheetDTO>> getSheetsByIntervention(@PathVariable Long interventionId) {
        List<InterventionSheetDTO> sheets = sheetService.getSheetsByIntervention(interventionId);
        return ResponseEntity.ok(sheets);
    }

    @GetMapping("/search")
    @PreAuthorize("hasAnyRole('ADMIN', 'FOCAL_POINT', 'IT_PROFESSIONAL')")
    public ResponseEntity<List<InterventionSheetDTO>> searchSheets(@RequestParam String keyword) {
        List<InterventionSheetDTO> sheets = sheetService.searchSheets(keyword);
        return ResponseEntity.ok(sheets);
    }

    @PostMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'FOCAL_POINT', 'IT_PROFESSIONAL')")
    public ResponseEntity<InterventionSheetDTO> createSheet(@RequestBody InterventionSheetDTO sheetDTO) {
        try {
            InterventionSheetDTO createdSheet = sheetService.createSheet(sheetDTO);
            return ResponseEntity.status(HttpStatus.CREATED).body(createdSheet);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'FOCAL_POINT', 'IT_PROFESSIONAL')")
    public ResponseEntity<InterventionSheetDTO> updateSheet(@PathVariable Long id, @RequestBody InterventionSheetDTO sheetDTO) {
        try {
            InterventionSheetDTO updatedSheet = sheetService.updateSheet(id, sheetDTO);
            return ResponseEntity.ok(updatedSheet);
        } catch (Exception e) {
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'FOCAL_POINT', 'IT_PROFESSIONAL')")
    public ResponseEntity<Map<String, String>> deleteSheet(@PathVariable Long id) {
        try {
            sheetService.deleteSheet(id);
            Map<String, String> response = new HashMap<>();
            response.put("message", "Intervention sheet deleted successfully");
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", e.getMessage());
            return ResponseEntity.badRequest().body(error);
        }
    }

    @PostMapping("/{id}/approve")
    @PreAuthorize("hasAnyRole('ADMIN', 'IT_PROFESSIONAL')")
    public ResponseEntity<InterventionSheetDTO> approveSheet(@PathVariable Long id, @RequestParam Long approvedByUserId) {
        try {
            InterventionSheetDTO approvedSheet = sheetService.approveSheet(id, approvedByUserId);
            return ResponseEntity.ok(approvedSheet);
        } catch (Exception e) {
            return ResponseEntity.notFound().build();
        }
    }

    @PostMapping("/{id}/reject")
    @PreAuthorize("hasAnyRole('ADMIN', 'IT_PROFESSIONAL')")
    public ResponseEntity<InterventionSheetDTO> rejectSheet(@PathVariable Long id, 
                                                           @RequestParam Long rejectedByUserId, 
                                                           @RequestParam String reason) {
        try {
            InterventionSheetDTO rejectedSheet = sheetService.rejectSheet(id, rejectedByUserId, reason);
            return ResponseEntity.ok(rejectedSheet);
        } catch (Exception e) {
            return ResponseEntity.notFound().build();
        }
    }

    @GetMapping("/stats/status/{status}")
    @PreAuthorize("hasAnyRole('ADMIN', 'FOCAL_POINT', 'IT_PROFESSIONAL')")
    public ResponseEntity<Map<String, Long>> getSheetCountByStatus(@PathVariable String status) {
        long count = sheetService.getSheetCountByStatus(status);
        Map<String, Long> response = new HashMap<>();
        response.put("count", count);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/stats/user/{userId}")
    @PreAuthorize("hasAnyRole('ADMIN', 'FOCAL_POINT', 'IT_PROFESSIONAL')")
    public ResponseEntity<Map<String, Long>> getSheetCountByUser(@PathVariable Long userId) {
        long count = sheetService.getSheetCountByUser(userId);
        Map<String, Long> response = new HashMap<>();
        response.put("count", count);
        return ResponseEntity.ok(response);
    }
}

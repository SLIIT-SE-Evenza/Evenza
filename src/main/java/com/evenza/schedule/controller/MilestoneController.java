package com.evenza.schedule.controller;

import com.evenza.schedule.dto.CreateMilestoneRequest;
import com.evenza.schedule.dto.MilestoneResponse;
import com.evenza.schedule.dto.UpdateMilestoneRequest;
import com.evenza.schedule.service.MilestoneService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * Handles milestone operations with role-based access control.
 */
@RestController
@RequestMapping("/api/milestones")
public class MilestoneController {

    private final MilestoneService milestoneService;

    public MilestoneController(
            MilestoneService milestoneService) {

        this.milestoneService = milestoneService;
    }

    /**
     * Only Event Managers and Administrators can create milestones.
     */
    @PostMapping
    @PreAuthorize("hasAnyRole('EVENT_MANAGER', 'ADMIN')")
    public ResponseEntity<MilestoneResponse> createMilestone(
            @Valid @RequestBody CreateMilestoneRequest request) {

        MilestoneResponse createdMilestone =
                milestoneService.createMilestone(request);

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(createdMilestone);
    }

    /**
     * Managers, Administrators and Inventory Staff can view a milestone.
     */
    @GetMapping("/{milestoneId}")
    @PreAuthorize("""
            hasAnyRole(
                'EVENT_MANAGER',
                'INVENTORY_STAFF',
                'ADMIN'
            )
            """)
    public ResponseEntity<MilestoneResponse> getMilestoneById(
            @PathVariable Long milestoneId) {

        return ResponseEntity.ok(
                milestoneService.getMilestoneById(milestoneId)
        );
    }

    /**
     * Managers, Administrators and Inventory Staff can view
     * milestones belonging to an event.
     */
    @GetMapping("/event/{eventId}")
    @PreAuthorize("""
            hasAnyRole(
                'EVENT_MANAGER',
                'INVENTORY_STAFF',
                'ADMIN'
            )
            """)
    public ResponseEntity<List<MilestoneResponse>>
    getMilestonesByEvent(@PathVariable Long eventId) {

        return ResponseEntity.ok(
                milestoneService.getMilestonesByEvent(eventId)
        );
    }

    /**
     * Only Event Managers and Administrators can edit milestones.
     */
    @PutMapping("/{milestoneId}")
    @PreAuthorize("hasAnyRole('EVENT_MANAGER', 'ADMIN')")
    public ResponseEntity<MilestoneResponse> updateMilestone(
            @PathVariable Long milestoneId,
            @Valid @RequestBody UpdateMilestoneRequest request) {

        return ResponseEntity.ok(
                milestoneService.updateMilestone(
                        milestoneId,
                        request
                )
        );
    }

    /**
     * Only Event Managers and Administrators can mark a milestone at risk.
     */
    @PatchMapping("/{milestoneId}/at-risk")
    @PreAuthorize("hasAnyRole('EVENT_MANAGER', 'ADMIN')")
    public ResponseEntity<MilestoneResponse> markAtRisk(
            @PathVariable Long milestoneId) {

        return ResponseEntity.ok(
                milestoneService.markAtRisk(milestoneId)
        );
    }

    /**
     * Only Event Managers and Administrators can mark a milestone on track.
     */
    @PatchMapping("/{milestoneId}/on-track")
    @PreAuthorize("hasAnyRole('EVENT_MANAGER', 'ADMIN')")
    public ResponseEntity<MilestoneResponse> markOnTrack(
            @PathVariable Long milestoneId) {

        return ResponseEntity.ok(
                milestoneService.markOnTrack(milestoneId)
        );
    }

    /**
     * Only Event Managers and Administrators can achieve milestones.
     */
    @PatchMapping("/{milestoneId}/achieve")
    @PreAuthorize("hasAnyRole('EVENT_MANAGER', 'ADMIN')")
    public ResponseEntity<MilestoneResponse> markAchieved(
            @PathVariable Long milestoneId) {

        return ResponseEntity.ok(
                milestoneService.markAchieved(milestoneId)
        );
    }

    /**
     * Only Event Managers and Administrators can delete milestones.
     */
    @DeleteMapping("/{milestoneId}")
    @PreAuthorize("hasAnyRole('EVENT_MANAGER', 'ADMIN')")
    public ResponseEntity<Void> deleteMilestone(
            @PathVariable Long milestoneId) {

        milestoneService.deleteMilestone(milestoneId);

        return ResponseEntity.noContent().build();
    }
}
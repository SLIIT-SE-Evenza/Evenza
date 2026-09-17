package com.evenza.schedule.controller;

import com.evenza.schedule.dto.CreateMilestoneRequest;
import com.evenza.schedule.dto.MilestoneResponse;
import com.evenza.schedule.dto.UpdateMilestoneRequest;
import com.evenza.schedule.service.MilestoneService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/*
 * This controller handles HTTP requests related to milestones.
 * Every endpoint begins with /api/milestones.
 */
@RestController
@RequestMapping("/api/milestones")
public class MilestoneController {

    // Business logic is handled by the service, not the controller.
    private final MilestoneService milestoneService;

    // Spring automatically injects MilestoneService here.
    public MilestoneController(
            MilestoneService milestoneService) {

        this.milestoneService = milestoneService;
    }

    /*
     * POST /api/milestones
     *
     * Creates a new milestone and returns HTTP 201 CREATED.
     */
    @PostMapping
    public ResponseEntity<MilestoneResponse> createMilestone(
            @Valid @RequestBody CreateMilestoneRequest request) {

        MilestoneResponse createdMilestone =
                milestoneService.createMilestone(request);

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(createdMilestone);
    }

    /*
     * GET /api/milestones/{milestoneId}
     *
     * Finds one milestone using its ID.
     */
    @GetMapping("/{milestoneId}")
    public ResponseEntity<MilestoneResponse> getMilestoneById(
            @PathVariable Long milestoneId) {

        return ResponseEntity.ok(
                milestoneService.getMilestoneById(milestoneId)
        );
    }

    /*
     * GET /api/milestones/event/{eventId}
     *
     * Returns all milestones belonging to one event.
     */
    @GetMapping("/event/{eventId}")
    public ResponseEntity<List<MilestoneResponse>>
    getMilestonesByEvent(@PathVariable Long eventId) {

        return ResponseEntity.ok(
                milestoneService.getMilestonesByEvent(eventId)
        );
    }

    /*
     * PUT /api/milestones/{milestoneId}
     *
     * Updates the milestone name and target date.
     */
    @PutMapping("/{milestoneId}")
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

    /*
     * PATCH changes only the milestone status.
     * This endpoint changes it to AT_RISK.
     */
    @PatchMapping("/{milestoneId}/at-risk")
    public ResponseEntity<MilestoneResponse> markAtRisk(
            @PathVariable Long milestoneId) {

        return ResponseEntity.ok(
                milestoneService.markAtRisk(milestoneId)
        );
    }

    // Change the milestone status to ACHIEVED.
    @PatchMapping("/{milestoneId}/achieve")
    public ResponseEntity<MilestoneResponse> markAchieved(
            @PathVariable Long milestoneId) {

        return ResponseEntity.ok(
                milestoneService.markAchieved(milestoneId)
        );
    }

    /*
     * DELETE /api/milestones/{milestoneId}
     *
     * Returns HTTP 204 after successful deletion.
     */
    @DeleteMapping("/{milestoneId}")
    public ResponseEntity<Void> deleteMilestone(
            @PathVariable Long milestoneId) {

        milestoneService.deleteMilestone(milestoneId);

        return ResponseEntity.noContent().build();
    }
}
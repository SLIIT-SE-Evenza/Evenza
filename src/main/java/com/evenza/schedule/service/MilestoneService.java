package com.evenza.schedule.service;

import com.evenza.event.entity.Event;
import com.evenza.event.service.EventService;
import com.evenza.schedule.dto.CreateMilestoneRequest;
import com.evenza.schedule.dto.MilestoneResponse;
import com.evenza.schedule.dto.UpdateMilestoneRequest;
import com.evenza.schedule.entity.Milestone;
import com.evenza.schedule.repository.MilestoneRepository;
import com.evenza.schedule.repository.TaskRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

/*
 * @Service tells Spring that this class contains the
 * business logic related to milestones.
 */
@Service
public class MilestoneService {

    // Repository used to perform milestone database operations.
    private final MilestoneRepository milestoneRepository;

    // Existing EventService is reused to find events.
    private final EventService eventService;
    private final TaskRepository taskRepository;

    /*
     * Constructor injection allows Spring to provide the repository
     * and EventService objects automatically.
     */
    public MilestoneService(
            MilestoneRepository milestoneRepository,
            EventService eventService,
            TaskRepository taskRepository) {

        this.milestoneRepository = milestoneRepository;
        this.eventService = eventService;
        this.taskRepository = taskRepository;
    }

    /*
     * @Transactional keeps the database operation inside a transaction.
     * If an error occurs, the incomplete operation will be rolled back.
     */
    @Transactional
    public MilestoneResponse createMilestone(
            CreateMilestoneRequest request) {

        // Find the event connected to the provided event ID.
        Event event =
                eventService.getEventByIdOrThrow(request.eventId());

        String name = request.name().trim();
        if (milestoneRepository.existsByEventIdAndNameIgnoreCase(event.getId(), name)) {
            throw new IllegalArgumentException("A milestone with this name already exists for the event");
        }

        // Create the milestone entity using the request information.
        Milestone milestone = new Milestone(
                event,
                name,
                request.targetDate()
        );

        // Insert the new milestone into the database.
        Milestone savedMilestone =
                milestoneRepository.save(milestone);

        return convertToResponse(savedMilestone);
    }

    /*
     * readOnly = true indicates that this method only reads data.
     * It will not insert, update or delete database records.
     */
    @Transactional(readOnly = true)
    public MilestoneResponse getMilestoneById(Long milestoneId) {

        Milestone milestone =
                getMilestoneByIdOrThrow(milestoneId);

        return convertToResponse(milestone);
    }

    // Return every milestone belonging to the selected event.
    @Transactional(readOnly = true)
    public List<MilestoneResponse> getMilestonesByEvent(
            Long eventId) {

        /*
         * stream() processes the list.
         * map() converts every Milestone entity into a response DTO.
         * toList() collects the converted responses into a new list.
         */
        eventService.getEventByIdOrThrow(eventId);
        return milestoneRepository.findByEventIdOrderByTargetDateAsc(eventId)
                .stream()
                .map(this::convertToResponse)
                .toList();
    }

    // Update the editable information of an existing milestone.
    @Transactional
    public MilestoneResponse updateMilestone(
            Long milestoneId,
            UpdateMilestoneRequest request) {

        Milestone milestone =
                getMilestoneByIdOrThrow(milestoneId);

        String name = request.name().trim();
        Long eventId = milestone.getEvent().getId();
        if (milestoneRepository.existsByEventIdAndNameIgnoreCaseAndIdNot(
                eventId, name, milestoneId)) {
            throw new IllegalArgumentException("A milestone with this name already exists for the event");
        }

        milestone.setName(name);
        milestone.setTargetDate(request.targetDate());

        Milestone updatedMilestone =
                milestoneRepository.save(milestone);

        return convertToResponse(updatedMilestone);
    }

    // Change the milestone status to AT_RISK.
    @Transactional
    public MilestoneResponse markAtRisk(Long milestoneId) {

        Milestone milestone =
                getMilestoneByIdOrThrow(milestoneId);

        milestone.markAtRisk();

        return convertToResponse(
                milestoneRepository.save(milestone)
        );
    }

    // Change the milestone status to ON_TRACK.
    @Transactional
    public MilestoneResponse markOnTrack(Long milestoneId) {
        Milestone milestone = getMilestoneByIdOrThrow(milestoneId);
        milestone.markOnTrack();
        return convertToResponse(milestoneRepository.save(milestone));
    }

    // Change the milestone status to ACHIEVED.
    @Transactional
    public MilestoneResponse markAchieved(Long milestoneId) {

        Milestone milestone =
                getMilestoneByIdOrThrow(milestoneId);

        milestone.markAchieved();

        return convertToResponse(
                milestoneRepository.save(milestone)
        );
    }

    // Delete a milestone after confirming that it exists.
    @Transactional
    public void deleteMilestone(Long milestoneId) {

        Milestone milestone =
                getMilestoneByIdOrThrow(milestoneId);

        if (taskRepository.existsByMilestoneId(milestoneId)) {
            throw new IllegalArgumentException(
                    "This milestone has assigned tasks. Reassign those tasks before deleting it"
            );
        }

        milestoneRepository.delete(milestone);
    }

    /*
     * Helper method used by other service methods.
     * orElseThrow() produces an understandable error when the ID is invalid.
     */
    private Milestone getMilestoneByIdOrThrow(
            Long milestoneId) {

        return milestoneRepository.findById(milestoneId)
                .orElseThrow(() -> new IllegalArgumentException(
                        "Milestone not found: " + milestoneId
                ));
    }

    /*
     * Converts the database entity into a safe response DTO.
     * We return eventId instead of returning the complete Event entity.
     */
    private MilestoneResponse convertToResponse(
            Milestone milestone) {

        return new MilestoneResponse(
                milestone.getId(),
                milestone.getEvent().getId(),
                milestone.getName(),
                milestone.getTargetDate(),
                milestone.getStatus()
        );
    }
}

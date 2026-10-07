package com.evenza.event.service;

import com.evenza.common.user.User;
import com.evenza.common.user.UserRepository;
import com.evenza.common.user.UserRole;
import com.evenza.event.dto.EventRequest;
import com.evenza.event.dto.EventResponse;
import com.evenza.event.entity.Event;
import com.evenza.event.entity.EventStatus;
import com.evenza.event.repository.EventRepository;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class EventService {

    private final EventRepository eventRepository;
    private final UserRepository userRepository;

    public EventService(
            EventRepository eventRepository,
            UserRepository userRepository) {

        this.eventRepository = eventRepository;
        this.userRepository = userRepository;
    }

    public Event getEventByIdOrThrow(Long eventId) {
        return eventRepository.findById(eventId)
                .orElseThrow(() ->
                        new IllegalArgumentException(
                                "Event not found: " + eventId
                        )
                );
    }

    // Creates and saves a new event.
    @Transactional
    public EventResponse create(EventRequest request) {
        User organiser = getCustomerOrThrow(request.organiserId());
        String name = cleanName(request.name());

        validateDuplicate(
                null,
                organiser.getId(),
                name,
                request.eventDate()
        );

        Event event = new Event(
                organiser,
                name,
                request.eventDate(),
                request.guestCount()
        );

        event.setRequirements(
                cleanRequirements(request.requirements())
        );

        Event savedEvent = eventRepository.save(event);

        return toResponse(savedEvent);
    }

    // Checks for events with the same organiser, name and event minute.
    private void validateDuplicate(
            Long currentEventId,
            Long organiserId,
            String name,
            LocalDateTime eventDate) {

        if (eventDate == null) {
            throw new IllegalArgumentException(
                    "Event date and time are required"
            );
        }

        // Compare the complete minute to avoid SQL Server precision differences.
        LocalDateTime minuteStart = eventDate
                .withSecond(0)
                .withNano(0);

        LocalDateTime minuteEnd = minuteStart.plusMinutes(1);

        long duplicateCount;

        if (currentEventId == null) {
            duplicateCount = eventRepository.countDuplicates(
                    organiserId,
                    name,
                    minuteStart,
                    minuteEnd
            );
        } else {
            duplicateCount = eventRepository.countDuplicatesExcludingId(
                    organiserId,
                    name,
                    minuteStart,
                    minuteEnd,
                    currentEventId
            );
        }

        if (duplicateCount > 0) {
            throw new IllegalArgumentException(
                    "This customer already has an event with the same name and date"
            );
        }
    }

    @Transactional(readOnly = true)
    public List<EventResponse> findAll() {
        return eventRepository.findAll()
                .stream()
                .map(this::toResponse)
                .toList();
    }

    @Transactional(readOnly = true)
    public EventResponse findOne(Long id) {
        return toResponse(getEventByIdOrThrow(id));
    }

    @Transactional
    public EventResponse update(Long id, EventRequest request) {
        Event event = getEventByIdOrThrow(id);

        if (event.getStatus() != EventStatus.DRAFT) {
            throw new IllegalArgumentException(
                    "Only draft events can be edited"
            );
        }

        User organiser = getCustomerOrThrow(request.organiserId());
        String name = cleanName(request.name());

        validateDuplicate(
                id,
                organiser.getId(),
                name,
                request.eventDate()
        );

        event.updateDetails(
                organiser,
                name,
                request.eventDate(),
                request.guestCount(),
                cleanRequirements(request.requirements())
        );

        // JPA dirty checking saves these changes when the transaction ends.
        return toResponse(event);
    }

    @Transactional
    public EventResponse changeStatus(Long id, String action) {
        Event event = getEventByIdOrThrow(id);

        if (action == null || action.isBlank()) {
            throw new IllegalArgumentException(
                    "Event action is required"
            );
        }

        switch (action.trim().toLowerCase()) {
            case "submit" -> event.submitForApproval();
            case "approve" -> event.approve();
            case "complete" -> event.markCompleted();
            case "cancel" -> event.cancel();

            default -> throw new IllegalArgumentException(
                    "Unknown event action: " + action
            );
        }

        return toResponse(event);
    }

    @Transactional
    public void delete(Long id) {
        Event event = getEventByIdOrThrow(id);

        if (event.getStatus() != EventStatus.DRAFT
                && event.getStatus() != EventStatus.CANCELLED) {

            throw new IllegalArgumentException(
                    "Only draft or cancelled events can be deleted"
            );
        }

        try {
            eventRepository.delete(event);

            // Execute SQL now so foreign-key problems can be handled here.
            eventRepository.flush();

        } catch (DataIntegrityViolationException exception) {
            throw new IllegalArgumentException(
                    "This event has related bookings, tasks or other records and cannot be deleted"
            );
        }
    }

    private User getCustomerOrThrow(Long userId) {
        if (userId == null) {
            throw new IllegalArgumentException(
                    "Organiser is required"
            );
        }

        User organiser = userRepository.findById(userId)
                .orElseThrow(() ->
                        new IllegalArgumentException(
                                "Organiser not found: " + userId
                        )
                );

        if (organiser.getRole() != UserRole.CUSTOMER) {
            throw new IllegalArgumentException(
                    "The event organiser must be a customer"
            );
        }

        return organiser;
    }

    private String cleanName(String value) {
        return value == null ? "" : value.trim();
    }

    private String cleanRequirements(String value) {
        if (value == null || value.isBlank()) {
            return null;
        }

        return value.trim();
    }

    private EventResponse toResponse(Event event) {
        return new EventResponse(
                event.getId(),
                event.getOrganiser().getId(),
                event.getOrganiser().getName(),
                event.getName(),
                event.getEventDate(),
                event.getGuestCount(),
                event.getRequirements(),
                event.getStatus(),
                event.getCreatedAt()
        );
    }
}
package com.evenza.event.service;

import com.evenza.event.entity.Event;
import com.evenza.event.dto.EventRequest;
import com.evenza.event.dto.EventResponse;
import com.evenza.event.repository.EventRepository;
import com.evenza.common.user.User;
import com.evenza.common.user.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;


@Service
public class EventService {

    private final EventRepository eventRepository;
    private final UserRepository userRepository;

    public EventService(EventRepository eventRepository, UserRepository userRepository) {
        this.eventRepository = eventRepository;
        this.userRepository = userRepository;
    }


    public Event getEventByIdOrThrow(Long eventId) {
        return eventRepository.findById(eventId)
                .orElseThrow(() -> new IllegalArgumentException("Event not found: " + eventId));
    }

    @Transactional
    public EventResponse create(EventRequest request) {
        User organiser = userRepository.findById(request.organiserId())
                .orElseThrow(() -> new IllegalArgumentException("Organiser not found: " + request.organiserId()));
        Event event = new Event(organiser, request.name().trim(), request.eventDate(), request.guestCount());
        event.setRequirements(request.requirements());
        return toResponse(eventRepository.save(event));
    }

    @Transactional(readOnly = true)
    public List<EventResponse> findAll() {
        return eventRepository.findAll().stream().map(this::toResponse).toList();
    }

    @Transactional(readOnly = true)
    public EventResponse findOne(Long id) {
        return toResponse(getEventByIdOrThrow(id));
    }

    @Transactional
    public EventResponse update(Long id, EventRequest request) {
        Event event = getEventByIdOrThrow(id);
        event.setName(request.name().trim());
        event.setEventDate(request.eventDate());
        event.setGuestCount(request.guestCount());
        event.setRequirements(request.requirements());
        // JPA dirty checking writes these setter changes when the transaction ends.
        return toResponse(event);
    }

    @Transactional
    public EventResponse changeStatus(Long id, String action) {
        Event event = getEventByIdOrThrow(id);
        switch (action.toLowerCase()) {
            case "submit" -> event.submitForApproval();
            case "approve" -> event.approve();
            case "complete" -> event.markCompleted();
            case "cancel" -> event.cancel();
            default -> throw new IllegalArgumentException("Unknown event action: " + action);
        }
        return toResponse(event);
    }

    @Transactional
    public void delete(Long id) {
        eventRepository.delete(getEventByIdOrThrow(id));
    }

    private EventResponse toResponse(Event event) {
        return new EventResponse(event.getId(), event.getOrganiser().getId(),
                event.getOrganiser().getName(), event.getName(), event.getEventDate(),
                event.getGuestCount(), event.getRequirements(), event.getStatus(), event.getCreatedAt());
    }
}

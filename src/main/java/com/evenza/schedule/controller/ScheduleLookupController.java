package com.evenza.schedule.controller;

import com.evenza.common.user.User;
import com.evenza.common.user.UserRepository;
import com.evenza.common.user.UserRole;
import com.evenza.event.entity.Event;
import com.evenza.event.entity.EventStatus;
import com.evenza.event.repository.EventRepository;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDateTime;
import java.util.EnumSet;
import java.util.List;
import java.util.UUID;

/**
 * Supplies small lookup lists used by the Schedule UI.
 *
 * Returning DTO records instead of complete JPA entities prevents lazy-loading
 * and circular JSON problems in the browser.
 */
@RestController
@RequestMapping("/api/schedule")
public class ScheduleLookupController {

    private final EventRepository eventRepository;
    private final UserRepository userRepository;

    public ScheduleLookupController(
            EventRepository eventRepository,
            UserRepository userRepository) {

        this.eventRepository = eventRepository;
        this.userRepository = userRepository;
    }

    /**
     * GET /api/schedule/events
     * Returns the event details needed by the event selector.
     */
    @GetMapping("/events")
    @Transactional(readOnly = true)
    public List<EventOption> getEvents() {
        return eventRepository.findAll()
                .stream()
                .map(event -> new EventOption(
                        event.getId(),
                        event.getName(),
                        event.getEventDate(),
                        event.getStatus()
                ))
                .toList();
    }

    /**
     * GET /api/schedule/staff
     * Only operationally relevant roles appear in the assignment selector.
     */
    @GetMapping("/staff")
    @Transactional(readOnly = true)
    public List<StaffOption> getStaff() {
        EnumSet<UserRole> assignableRoles = EnumSet.of(
                UserRole.ADMIN,
                UserRole.EVENT_MANAGER,
                UserRole.INVENTORY_STAFF
        );

        return userRepository.findAll()
                .stream()
                .filter(user -> assignableRoles.contains(user.getRole()))
                .map(user -> new StaffOption(
                        user.getId(),
                        user.getName(),
                        user.getEmail(),
                        user.getRole()
                ))
                .toList();
    }

    /** Shared lightweight user list for Event, Booking and Inquiry forms. */
    @GetMapping("/users")
    @Transactional(readOnly = true)
    public List<StaffOption> getUsers() {
        return userRepository.findAll().stream()
                .map(user -> new StaffOption(user.getId(), user.getName(), user.getEmail(), user.getRole()))
                .toList();
    }

    /**
     * POST /api/schedule/demo-data
     *
     * Creates a minimal event and staff set only when the evaluation database
     * does not already contain them. The button is explicit, so normal startup
     * never changes the database unexpectedly.
     */
    @PostMapping("/demo-data")
    @Transactional
    public ResponseEntity<DemoDataResponse> createDemoData() {
        User organiser = findOrCreateUser(
                "Demo Customer",
                "demo.customer@evenza.local",
                UserRole.CUSTOMER
        );

        findOrCreateUser(
                "Nimal Perera",
                "demo.manager@evenza.local",
                UserRole.EVENT_MANAGER
        );

        findOrCreateUser(
                "Kavindi Silva",
                "demo.operations@evenza.local",
                UserRole.INVENTORY_STAFF
        );

        Event event = eventRepository.findAll()
                .stream()
                .findFirst()
                .orElseGet(() -> {
                    Event newEvent = new Event(
                            organiser,
                            "Evenza Tech Conference 2026",
                            LocalDateTime.now().plusDays(7),
                            150
                    );
                    newEvent.approve();
                    return eventRepository.save(newEvent);
                });

        DemoDataResponse response = new DemoDataResponse(
                "Demo event and staff are ready.",
                event.getId()
        );

        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    /**
     * Reuses an existing demo user on repeated clicks and prevents duplicate
     * email constraint errors.
     */
    private User findOrCreateUser(
            String name,
            String email,
            UserRole role) {

        return userRepository.findByEmail(email)
                .orElseGet(() -> {
                    User user = new User();
                    user.setName(name);
                    user.setEmail(email);

                    // Random value because demo accounts are not used to log in.
                    user.setPassword(UUID.randomUUID().toString());
                    user.setRole(role);
                    return userRepository.save(user);
                });
    }

    public record EventOption(
            Long id,
            String name,
            LocalDateTime eventDate,
            EventStatus status) {
    }

    public record StaffOption(
            Long id,
            String name,
            String email,
            UserRole role) {
    }

    public record DemoDataResponse(
            String message,
            Long eventId) {
    }
}

package com.evenza.schedule.controller;

import com.evenza.common.auth.AuthService;
import com.evenza.common.user.User;
import com.evenza.common.user.UserRepository;
import com.evenza.common.user.UserRole;
import com.evenza.event.entity.Event;
import com.evenza.event.entity.EventStatus;
import com.evenza.event.repository.EventRepository;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.EnumSet;
import java.util.List;
import java.util.UUID;

/**
 * Supplies protected lookup information for the Schedule UI.
 */
@RestController
@RequestMapping("/api/schedule")
public class ScheduleLookupController {

    private final EventRepository eventRepository;
    private final UserRepository userRepository;
    private final AuthService authService;

    public ScheduleLookupController(
            EventRepository eventRepository,
            UserRepository userRepository,
            AuthService authService) {

        this.eventRepository = eventRepository;
        this.userRepository = userRepository;
        this.authService = authService;
    }

    /**
     * Customers receive only their own events.
     * Managers, staff and administrators can receive the operational event list.
     */
    @GetMapping("/events")
    @Transactional(readOnly = true)
    @PreAuthorize("""
            hasAnyRole(
                'CUSTOMER',
                'EVENT_MANAGER',
                'INVENTORY_STAFF',
                'ADMIN'
            )
            """)
    public List<EventOption> getEvents(
            Authentication authentication) {

        User currentUser = getCurrentUser(authentication);

        List<Event> events;

        if (currentUser.getRole() == UserRole.CUSTOMER) {
            events = eventRepository.findByOrganiserId(
                    currentUser.getId()
            );
        } else {
            events = eventRepository.findAll();
        }

        return events.stream()
                .map(event -> new EventOption(
                        event.getId(),
                        event.getOrganiser().getId(),
                        event.getName(),
                        event.getEventDate(),
                        event.getStatus()
                ))
                .toList();
    }

    /**
     * Only Managers and Administrators may retrieve the staff assignment list.
     */
    @GetMapping("/staff")
    @Transactional(readOnly = true)
    @PreAuthorize("hasAnyRole('EVENT_MANAGER', 'ADMIN')")
    public List<StaffOption> getStaff() {

        EnumSet<UserRole> assignableRoles = EnumSet.of(
                UserRole.ADMIN,
                UserRole.EVENT_MANAGER,
                UserRole.INVENTORY_STAFF
        );

        return userRepository.findAll()
                .stream()
                .filter(user ->
                        assignableRoles.contains(user.getRole())
                )
                .map(this::toStaffOption)
                .toList();
    }

    /**
     * Managers and Administrators can retrieve the complete user list.
     * Other authenticated users receive only their own account information.
     */
    @GetMapping("/users")
    @Transactional(readOnly = true)
    @PreAuthorize("isAuthenticated()")
    public List<StaffOption> getUsers(
            Authentication authentication) {

        User currentUser = getCurrentUser(authentication);

        boolean canViewAllUsers =
                currentUser.getRole() == UserRole.EVENT_MANAGER
                        || currentUser.getRole() == UserRole.ADMIN;

        if (canViewAllUsers) {
            return userRepository.findAll()
                    .stream()
                    .map(this::toStaffOption)
                    .toList();
        }

        return List.of(toStaffOption(currentUser));
    }

    /**
     * Demo data creation is restricted to Administrators.
     */
    @PostMapping("/demo-data")
    @Transactional
    @PreAuthorize("hasRole('ADMIN')")
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

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(response);
    }

    /**
     * Gets the database user represented by the current login session.
     */
    private User getCurrentUser(
            Authentication authentication) {

        return authService.findByEmailOrThrow(
                authentication.getName()
        );
    }

    /**
     * Converts a User entity into a safe response object.
     * The password is never returned.
     */
    private StaffOption toStaffOption(User user) {
        return new StaffOption(
                user.getId(),
                user.getName(),
                user.getEmail(),
                user.getRole()
        );
    }

    /**
     * Reuses existing demo users and prevents duplicate email records.
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
                    user.setPassword(
                            UUID.randomUUID().toString()
                    );
                    user.setRole(role);

                    return userRepository.save(user);
                });
    }

    public record EventOption(
            Long id,
            Long organiserId,
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
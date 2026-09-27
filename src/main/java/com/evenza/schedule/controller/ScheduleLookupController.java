package com.evenza.schedule.controller;

import com.evenza.entity.Event;
import com.evenza.entity.User;
import com.evenza.repository.UserRepository;
import com.evenza.schedule.repository.ScheduleEventRepository;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDate;
import java.util.List;
import java.util.Set;
import java.util.UUID;

/** Supplies the small lookup lists required by the Schedule UI. */
@RestController
@RequestMapping("/api/schedule")
public class ScheduleLookupController {

    private static final Set<String> ASSIGNABLE_ROLES = Set.of(
            "ADMIN", "EVENT_MANAGER", "INVENTORY_STAFF", "OPERATIONAL_STAFF"
    );

    private final ScheduleEventRepository eventRepository;
    private final UserRepository userRepository;

    public ScheduleLookupController(
            ScheduleEventRepository eventRepository,
            UserRepository userRepository) {
        this.eventRepository = eventRepository;
        this.userRepository = userRepository;
    }

    @GetMapping("/events")
    @Transactional(readOnly = true)
    public List<EventOption> getEvents() {
        return eventRepository.findAll().stream()
                .map(event -> new EventOption(
                        event.getId(), event.getTitle(),
                        event.getEventDate(), event.getStatus()
                ))
                .toList();
    }

    @GetMapping("/staff")
    @Transactional(readOnly = true)
    public List<StaffOption> getStaff() {
        return userRepository.findAll().stream()
                .filter(user -> user.getRole() != null
                        && ASSIGNABLE_ROLES.contains(user.getRole().toUpperCase()))
                .map(this::toStaffOption)
                .toList();
    }

    @GetMapping("/users")
    @Transactional(readOnly = true)
    public List<StaffOption> getUsers() {
        return userRepository.findAll().stream()
                .map(this::toStaffOption)
                .toList();
    }

    /** Creates safe demo records only when the evaluation database is empty. */
    @PostMapping("/demo-data")
    @Transactional
    public ResponseEntity<DemoDataResponse> createDemoData() {
        findOrCreateUser("Nimal Perera", "demo.manager@evenza.local", "EVENT_MANAGER");
        findOrCreateUser("Kavindi Silva", "demo.operations@evenza.local", "OPERATIONAL_STAFF");

        Event event = eventRepository.findAll().stream()
                .findFirst()
                .orElseGet(() -> {
                    Event newEvent = new Event();
                    newEvent.setTitle("Evenza Tech Conference 2026");
                    newEvent.setDescription("Demonstration event for Schedule Management");
                    newEvent.setEventType("Conference");
                    newEvent.setEventDate(LocalDate.now().plusDays(7));
                    newEvent.setVenue("Colombo");
                    newEvent.setExpectedGuests(150);
                    newEvent.setStatus("Approved");
                    return eventRepository.save(newEvent);
                });

        return ResponseEntity.status(HttpStatus.CREATED)
                .body(new DemoDataResponse("Demo event and staff are ready.", event.getId()));
    }

    private User findOrCreateUser(String fullName, String email, String role) {
        return userRepository.findByEmailIgnoreCase(email)
                .orElseGet(() -> {
                    User user = new User();
                    user.setFullName(fullName);
                    user.setEmail(email);
                    user.setPassword(UUID.randomUUID().toString());
                    user.setRole(role);
                    return userRepository.save(user);
                });
    }

    private StaffOption toStaffOption(User user) {
        return new StaffOption(
                user.getId(), user.getFullName(),
                user.getEmail(), user.getRole()
        );
    }

    public record EventOption(
            Long id, String name, LocalDate eventDate, String status) {
    }

    public record StaffOption(
            Long id, String name, String email, String role) {
    }

    public record DemoDataResponse(String message, Long eventId) {
    }
}

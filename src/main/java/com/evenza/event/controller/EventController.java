package com.evenza.event.controller;

import com.evenza.common.auth.AuthService;
import com.evenza.common.user.User;
import com.evenza.common.user.UserRole;
import com.evenza.event.dto.EventRequest;
import com.evenza.event.dto.EventResponse;
import com.evenza.event.service.EventService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Locale;

@RestController
@RequestMapping("/api/events")
public class EventController {

    private final EventService eventService;
    private final AuthService authService;

    public EventController(
            EventService eventService,
            AuthService authService) {

        this.eventService = eventService;
        this.authService = authService;
    }

    // Only customers can create events for themselves.
    @PostMapping
    @PreAuthorize("hasRole('CUSTOMER')")
    public ResponseEntity<EventResponse> create(
            @Valid @RequestBody EventRequest request,
            Authentication authentication) {

        User customer = currentUser(authentication);

        requireSameCustomer(
                customer,
                request.organiserId()
        );

        EventResponse response = eventService.create(request);

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(response);
    }

    // Customers see their events; managers and admins see every event.
    @GetMapping
    @PreAuthorize(
            "hasAnyRole('CUSTOMER', 'EVENT_MANAGER', 'ADMIN')"
    )
    public List<EventResponse> all(
            Authentication authentication) {

        User user = currentUser(authentication);
        List<EventResponse> events = eventService.findAll();

        if (user.getRole() == UserRole.CUSTOMER) {
            return events.stream()
                    .filter(event ->
                            user.getId().equals(
                                    event.organiserId()
                            )
                    )
                    .toList();
        }

        return events;
    }

    // Customers may view only their own events.
    @GetMapping("/{id}")
    @PreAuthorize(
            "hasAnyRole('CUSTOMER', 'EVENT_MANAGER', 'ADMIN')"
    )
    public EventResponse one(
            @PathVariable Long id,
            Authentication authentication) {

        User user = currentUser(authentication);
        EventResponse event = eventService.findOne(id);

        requireCanView(user, event);

        return event;
    }

    // Customers may update only their own draft events.
    @PutMapping("/{id}")
    @PreAuthorize("hasRole('CUSTOMER')")
    public EventResponse update(
            @PathVariable Long id,
            @Valid @RequestBody EventRequest request,
            Authentication authentication) {

        User customer = currentUser(authentication);

        requireOwner(customer, id);
        requireSameCustomer(
                customer,
                request.organiserId()
        );

        return eventService.update(id, request);
    }

    /*
     * Customer:
     *   submit or cancel their own event.
     *
     * Event Manager/Admin:
     *   approve, complete or cancel an event.
     */
    @PatchMapping("/{id}/{action}")
    @PreAuthorize(
            "hasAnyRole('CUSTOMER', 'EVENT_MANAGER', 'ADMIN')"
    )
    public EventResponse changeStatus(
            @PathVariable Long id,
            @PathVariable String action,
            Authentication authentication) {

        User user = currentUser(authentication);
        String normalizedAction =
                action.trim().toLowerCase(Locale.ROOT);

        switch (normalizedAction) {
            case "submit" -> {
                requireCustomer(user);
                requireOwner(user, id);
            }

            case "approve", "complete" ->
                    requireManagerOrAdmin(user);

            case "cancel" -> {
                if (user.getRole() == UserRole.CUSTOMER) {
                    requireOwner(user, id);
                } else {
                    requireManagerOrAdmin(user);
                }
            }

            default -> throw new IllegalArgumentException(
                    "Unknown event action: " + action
            );
        }

        return eventService.changeStatus(
                id,
                normalizedAction
        );
    }

    // Customers may delete only their own draft/cancelled events.
    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('CUSTOMER')")
    public ResponseEntity<Void> delete(
            @PathVariable Long id,
            Authentication authentication) {

        User customer = currentUser(authentication);

        requireOwner(customer, id);
        eventService.delete(id);

        return ResponseEntity.noContent().build();
    }

    private User currentUser(Authentication authentication) {
        if (authentication == null
                || !authentication.isAuthenticated()) {

            throw new AccessDeniedException(
                    "Login is required"
            );
        }

        return authService.findByEmailOrThrow(
                authentication.getName()
        );
    }

    private void requireCanView(
            User user,
            EventResponse event) {

        if (user.getRole() == UserRole.CUSTOMER
                && !user.getId().equals(
                event.organiserId()
        )) {

            throw new AccessDeniedException(
                    "You cannot view another customer's event"
            );
        }
    }

    private void requireOwner(User customer, Long eventId) {
        EventResponse event = eventService.findOne(eventId);

        if (!customer.getId().equals(
                event.organiserId()
        )) {

            throw new AccessDeniedException(
                    "You cannot modify another customer's event"
            );
        }
    }

    private void requireSameCustomer(
            User customer,
            Long organiserId) {

        if (!customer.getId().equals(organiserId)) {
            throw new AccessDeniedException(
                    "You can create or update only your own events"
            );
        }
    }

    private void requireCustomer(User user) {
        if (user.getRole() != UserRole.CUSTOMER) {
            throw new AccessDeniedException(
                    "Only customers can perform this action"
            );
        }
    }

    private void requireManagerOrAdmin(User user) {
        if (user.getRole() != UserRole.EVENT_MANAGER
                && user.getRole() != UserRole.ADMIN) {

            throw new AccessDeniedException(
                    "Only an event manager or administrator can perform this action"
            );
        }
    }
}
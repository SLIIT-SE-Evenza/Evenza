package com.evenza.booking.controller;

import com.evenza.booking.dto.BookingRequest;
import com.evenza.booking.dto.BookingResponse;
import com.evenza.booking.service.BookingService;
import com.evenza.common.auth.AuthService;
import com.evenza.common.user.User;
import com.evenza.common.user.UserRole;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/bookings")
public class BookingController {

    private final BookingService bookingService;
    private final AuthService authService;

    public BookingController(
            BookingService bookingService,
            AuthService authService) {

        this.bookingService = bookingService;
        this.authService = authService;
    }

    /*
     * Customers create bookings for themselves.
     * Managers and administrators may create bookings for customers.
     */
    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    @PreAuthorize("hasAnyRole('CUSTOMER', 'EVENT_MANAGER', 'ADMIN')")
    public BookingResponse createBooking(
            @Valid @RequestBody BookingRequest request,
            Authentication authentication) {

        User currentUser =
                authService.findByEmailOrThrow(
                        authentication.getName()
                );

        BookingRequest securedRequest =
                secureCustomerId(request, currentUser);

        return bookingService.createBooking(securedRequest);
    }

    /*
     * Customers can retrieve only their own booking list.
     * Managers and administrators can retrieve another customer's list.
     */
    @GetMapping("/customer/{customerId}")
    @PreAuthorize("hasAnyRole('CUSTOMER', 'EVENT_MANAGER', 'ADMIN')")
    public List<BookingResponse> getCustomerBookings(
            @PathVariable Long customerId,
            Authentication authentication) {

        User currentUser =
                authService.findByEmailOrThrow(
                        authentication.getName()
                );

        if (currentUser.getRole() == UserRole.CUSTOMER
                && !currentUser.getId().equals(customerId)) {

            throw new AccessDeniedException(
                    "You can view only your own bookings"
            );
        }

        return bookingService.getCustomerBookings(customerId);
    }

    // Only management can retrieve every customer's bookings.
    @GetMapping
    @PreAuthorize("hasAnyRole('EVENT_MANAGER', 'ADMIN')")
    public List<BookingResponse> getAll() {
        return bookingService.getAllBookings();
    }

    /*
     * Customers can retrieve only bookings belonging to their account.
     * Management users can retrieve any booking.
     */
    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('CUSTOMER', 'EVENT_MANAGER', 'ADMIN')")
    public BookingResponse getOne(
            @PathVariable Long id,
            Authentication authentication) {

        BookingResponse booking =
                bookingService.getBooking(id);

        User currentUser =
                authService.findByEmailOrThrow(
                        authentication.getName()
                );

        verifyOwnershipOrManagement(
                booking,
                currentUser
        );

        return booking;
    }

    /*
     * Customers can edit only their own pending bookings.
     * Managers and administrators may edit any pending booking.
     */
    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('CUSTOMER', 'EVENT_MANAGER', 'ADMIN')")
    public BookingResponse update(
            @PathVariable Long id,
            @Valid @RequestBody BookingRequest request,
            Authentication authentication) {

        BookingResponse existingBooking =
                bookingService.getBooking(id);

        User currentUser =
                authService.findByEmailOrThrow(
                        authentication.getName()
                );

        verifyOwnershipOrManagement(
                existingBooking,
                currentUser
        );

        BookingRequest securedRequest =
                secureCustomerId(request, currentUser);

        return bookingService.updateBooking(
                id,
                securedRequest
        );
    }

    /*
     * Customers can delete only their own eligible bookings.
     * Accepted bookings must first be cancelled.
     */
    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    @PreAuthorize("hasAnyRole('CUSTOMER', 'EVENT_MANAGER', 'ADMIN')")
    public void delete(
            @PathVariable Long id,
            Authentication authentication) {

        BookingResponse booking =
                bookingService.getBooking(id);

        User currentUser =
                authService.findByEmailOrThrow(
                        authentication.getName()
                );

        verifyOwnershipOrManagement(
                booking,
                currentUser
        );

        bookingService.deleteBooking(id);
    }

    // Accepting a booking is a management operation.
    @PatchMapping("/{id}/accept")
    @PreAuthorize("hasAnyRole('EVENT_MANAGER', 'ADMIN')")
    public BookingResponse accept(
            @PathVariable Long id) {

        return bookingService.acceptBooking(id);
    }

    // Rejecting a booking is a management operation.
    @PatchMapping("/{id}/reject")
    @PreAuthorize("hasAnyRole('EVENT_MANAGER', 'ADMIN')")
    public BookingResponse reject(
            @PathVariable Long id) {

        return bookingService.rejectBooking(id);
    }

    /*
     * Customers can cancel their own booking.
     * Managers and administrators can cancel any customer's booking.
     *
     * The customer ID is obtained from the saved booking instead of an
     * unsafe customerId URL parameter.
     */
    @PatchMapping("/{id}/cancel")
    @PreAuthorize("hasAnyRole('CUSTOMER', 'EVENT_MANAGER', 'ADMIN')")
    public BookingResponse cancel(
            @PathVariable Long id,
            Authentication authentication) {

        BookingResponse booking =
                bookingService.getBooking(id);

        User currentUser =
                authService.findByEmailOrThrow(
                        authentication.getName()
                );

        verifyOwnershipOrManagement(
                booking,
                currentUser
        );

        return bookingService.cancelBooking(
                id,
                booking.customerId()
        );
    }

    /**
     * Customers cannot submit another customer's ID.
     *
     * For a customer request, the authenticated user's ID replaces the
     * customerId received from JavaScript. Management users retain the
     * customer selected in the form.
     */
    private BookingRequest secureCustomerId(
            BookingRequest request,
            User currentUser) {

        Long customerId;

        if (currentUser.getRole() == UserRole.CUSTOMER) {
            customerId = currentUser.getId();
        } else {
            customerId = request.customerId();
        }

        return new BookingRequest(
                customerId,
                request.eventId(),
                request.vendorId(),
                request.venueId(),
                request.bookingDate(),
                request.startTime(),
                request.endTime()
        );
    }

    /**
     * Permits access when the authenticated user owns the booking or has
     * an event-management role.
     */
    private void verifyOwnershipOrManagement(
            BookingResponse booking,
            User currentUser) {

        boolean managementUser =
                currentUser.getRole() == UserRole.EVENT_MANAGER
                        || currentUser.getRole() == UserRole.ADMIN;

        boolean bookingOwner =
                booking.customerId().equals(
                        currentUser.getId()
                );

        if (!managementUser && !bookingOwner) {
            throw new AccessDeniedException(
                    "You cannot access another customer's booking"
            );
        }
    }
}
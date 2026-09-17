package com.evenza.booking.controller;

import com.evenza.booking.dto.BookingRequest;
import com.evenza.booking.dto.BookingResponse;
import com.evenza.booking.service.BookingService;

import jakarta.validation.Valid;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/bookings")
public class BookingController {

    private final BookingService bookingService;

    public BookingController(
            BookingService bookingService) {

        this.bookingService = bookingService;
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public BookingResponse createBooking(
            @Valid @RequestBody BookingRequest request) {

        return bookingService.createBooking(request);
    }

    @GetMapping("/customer/{customerId}")
    public List<BookingResponse> getCustomerBookings(
            @PathVariable Long customerId) {

        return bookingService
                .getCustomerBookings(customerId);
    }

    @GetMapping
    public List<BookingResponse> getAll() {
        return bookingService.getAllBookings();
    }

    @GetMapping("/{id}")
    public BookingResponse getOne(@PathVariable Long id) {
        return bookingService.getBooking(id);
    }

    @PutMapping("/{id}")
    public BookingResponse update(@PathVariable Long id,
                                  @Valid @RequestBody BookingRequest request) {
        return bookingService.updateBooking(id, request);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable Long id) {
        bookingService.deleteBooking(id);
    }

    @PatchMapping("/{id}/accept")
    public BookingResponse accept(
            @PathVariable Long id) {

        return bookingService.acceptBooking(id);
    }

    @PatchMapping("/{id}/reject")
    public BookingResponse reject(
            @PathVariable Long id) {

        return bookingService.rejectBooking(id);
    }

    @PatchMapping("/{id}/cancel")
    public BookingResponse cancel(
            @PathVariable Long id,
            @RequestParam Long customerId) {

        return bookingService
                .cancelBooking(id, customerId);
    }
}

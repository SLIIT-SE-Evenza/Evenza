package com.evenza.booking.service;

import com.evenza.booking.dto.BookingRequest;
import com.evenza.booking.dto.BookingResponse;
import com.evenza.booking.model.Booking;
import com.evenza.booking.model.BookingStatus;
import com.evenza.booking.repository.BookingRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.EnumSet;
import java.util.List;

@Service
public class BookingService {

    // A PENDING or ACCEPTED booking still "holds" the time slot.
    // Only REJECTED/CANCELLED bookings free it up for someone else.
    private static final EnumSet<BookingStatus> ACTIVE_STATUSES =
            EnumSet.of(BookingStatus.PENDING, BookingStatus.ACCEPTED);

    private final BookingRepository bookingRepository;

    public BookingService(BookingRepository bookingRepository) {
        this.bookingRepository = bookingRepository;
    }

    @Transactional
    public BookingResponse createBooking(BookingRequest request) {

        // A booking must reserve at least a vendor or a venue (or both).
        if (request.vendorId() == null && request.venueId() == null) {
            throw new IllegalArgumentException(
                    "A booking must specify a vendor, a venue, or both"
            );
        }

        if (!request.endTime().isAfter(request.startTime())) {
            throw new IllegalArgumentException(
                    "End time must be after start time"
            );
        }

        // FR3 from the proposal: "prevent double-booking through
        // real-time calendar locks." This checks the database for
        // any active booking on the same vendor/venue that overlaps
        // in time, before we're allowed to save a new one.
        boolean overlaps = bookingRepository.existsOverlappingBooking(
                request.vendorId(),
                request.venueId(),
                request.bookingDate(),
                request.startTime(),
                request.endTime(),
                ACTIVE_STATUSES
        );

        if (overlaps) {
            throw new IllegalArgumentException(
                    "This vendor or venue is already booked for the selected time"
            );
        }

        Booking booking = new Booking();
        booking.setCustomerId(request.customerId());
        booking.setEventId(request.eventId());
        booking.setVendorId(request.vendorId());
        booking.setVenueId(request.venueId());
        booking.setBookingDate(request.bookingDate());
        booking.setStartTime(request.startTime());
        booking.setEndTime(request.endTime());
        booking.setStatus(BookingStatus.PENDING);

        return toResponse(bookingRepository.save(booking));
    }

    @Transactional(readOnly = true)
    public List<BookingResponse> getCustomerBookings(Long customerId) {
        return bookingRepository
                .findByCustomerIdOrderByBookingDateDesc(customerId)
                .stream()
                .map(this::toResponse)
                .toList();
    }

    @Transactional(readOnly = true)
    public List<BookingResponse> getAllBookings() {
        return bookingRepository.findAll().stream().map(this::toResponse).toList();
    }

    @Transactional(readOnly = true)
    public BookingResponse getBooking(Long id) {
        return toResponse(getBookingOrThrow(id));
    }

    @Transactional
    public BookingResponse updateBooking(Long id, BookingRequest request) {
        Booking booking = getBookingOrThrow(id);
        if (request.vendorId() == null && request.venueId() == null) {
            throw new IllegalArgumentException("A booking must specify a vendor, a venue, or both");
        }
        if (!request.endTime().isAfter(request.startTime())) {
            throw new IllegalArgumentException("End time must be after start time");
        }
        booking.setCustomerId(request.customerId());
        booking.setEventId(request.eventId());
        booking.setVendorId(request.vendorId());
        booking.setVenueId(request.venueId());
        booking.setBookingDate(request.bookingDate());
        booking.setStartTime(request.startTime());
        booking.setEndTime(request.endTime());
        // The status is intentionally preserved when editing booking details.
        return toResponse(booking);
    }

    @Transactional
    public void deleteBooking(Long id) {
        bookingRepository.delete(getBookingOrThrow(id));
    }

    @Transactional
    public BookingResponse acceptBooking(Long id) {
        Booking booking = getBookingOrThrow(id);
        booking.setStatus(BookingStatus.ACCEPTED);
        return toResponse(booking);
        // No explicit save() needed here: inside @Transactional, JPA's
        // "dirty checking" auto-saves changes to a managed entity when
        // this method finishes.
    }

    @Transactional
    public BookingResponse rejectBooking(Long id) {
        Booking booking = getBookingOrThrow(id);
        booking.setStatus(BookingStatus.REJECTED);
        return toResponse(booking);
    }

    @Transactional
    public BookingResponse cancelBooking(Long id, Long customerId) {
        Booking booking = getBookingOrThrow(id);

        // Only the customer who made the booking can cancel it —
        // prevents one customer cancelling another's booking by guessing IDs.
        if (!booking.getCustomerId().equals(customerId)) {
            throw new IllegalArgumentException(
                    "Only the customer who made this booking can cancel it"
            );
        }

        booking.setStatus(BookingStatus.CANCELLED);
        return toResponse(booking);
    }

    private Booking getBookingOrThrow(Long id) {
        return bookingRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException(
                        "Booking not found: " + id
                ));
    }

    private BookingResponse toResponse(Booking booking) {
        return new BookingResponse(
                booking.getId(),
                booking.getCustomerId(),
                booking.getEventId(),
                booking.getVendorId(),
                booking.getVenueId(),
                booking.getBookingDate(),
                booking.getStartTime(),
                booking.getEndTime(),
                booking.getStatus()
        );
    }
}

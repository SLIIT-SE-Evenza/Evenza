package com.evenza.booking.service;

import com.evenza.booking.dto.BookingRequest;
import com.evenza.booking.dto.BookingResponse;
import com.evenza.booking.model.Booking;
import com.evenza.booking.model.BookingStatus;
import com.evenza.booking.repository.BookingRepository;
import com.evenza.booking.repository.VendorRepository;
import com.evenza.booking.repository.VenueRepository;
import com.evenza.common.user.User;
import com.evenza.common.user.UserRepository;
import com.evenza.common.user.UserRole;
import com.evenza.event.entity.Event;
import com.evenza.event.repository.EventRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.EnumSet;
import java.util.List;

@Service
public class BookingService {

    /*
     * Pending and accepted bookings reserve their selected time slots.
     * Rejected and cancelled bookings no longer block those slots.
     */
    private static final EnumSet<BookingStatus> ACTIVE_STATUSES =
            EnumSet.of(BookingStatus.PENDING, BookingStatus.ACCEPTED);

    private final BookingRepository bookingRepository;
    private final UserRepository userRepository;
    private final EventRepository eventRepository;
    private final VendorRepository vendorRepository;
    private final VenueRepository venueRepository;

    public BookingService(
            BookingRepository bookingRepository,
            UserRepository userRepository,
            EventRepository eventRepository,
            VendorRepository vendorRepository,
            VenueRepository venueRepository) {

        this.bookingRepository = bookingRepository;
        this.userRepository = userRepository;
        this.eventRepository = eventRepository;
        this.vendorRepository = vendorRepository;
        this.venueRepository = venueRepository;
    }

    @Transactional
    public BookingResponse createBooking(BookingRequest request) {

        // null means this is a new booking, so no existing ID is excluded.
        validateBookingRequest(request, null);

        Booking booking = new Booking();
        applyBookingDetails(booking, request);
        booking.setStatus(BookingStatus.PENDING);

        return toResponse(bookingRepository.save(booking));
    }

    @Transactional(readOnly = true)
    public List<BookingResponse> getCustomerBookings(Long customerId) {

        getCustomerOrThrow(customerId);

        return bookingRepository
                .findByCustomerIdOrderByBookingDateDesc(customerId)
                .stream()
                .map(this::toResponse)
                .toList();
    }

    @Transactional(readOnly = true)
    public List<BookingResponse> getAllBookings() {
        return bookingRepository.findAll()
                .stream()
                .map(this::toResponse)
                .toList();
    }

    @Transactional(readOnly = true)
    public BookingResponse getBooking(Long id) {
        return toResponse(getBookingOrThrow(id));
    }

    @Transactional
    public BookingResponse updateBooking(
            Long id,
            BookingRequest request) {

        Booking booking = getBookingOrThrow(id);

        // Only pending requests may have their reservation details changed.
        if (booking.getStatus() != BookingStatus.PENDING) {
            throw new IllegalArgumentException(
                    "Only pending bookings can be edited"
            );
        }

        // Exclude this booking ID from the overlap check.
        validateBookingRequest(request, id);
        applyBookingDetails(booking, request);

        // JPA dirty checking saves these changes when the transaction finishes.
        return toResponse(booking);
    }

    @Transactional
    public void deleteBooking(Long id) {

        Booking booking = getBookingOrThrow(id);

        /*
         * An accepted booking must first be cancelled.
         * This prevents confirmed reservations disappearing unexpectedly.
         */
        if (booking.getStatus() == BookingStatus.ACCEPTED) {
            throw new IllegalArgumentException(
                    "Accepted bookings must be cancelled before deletion"
            );
        }

        bookingRepository.delete(booking);
    }

    @Transactional
    public BookingResponse acceptBooking(Long id) {

        Booking booking = getBookingOrThrow(id);

        if (booking.getStatus() != BookingStatus.PENDING) {
            throw new IllegalArgumentException(
                    "Only pending bookings can be accepted"
            );
        }

        booking.setStatus(BookingStatus.ACCEPTED);
        return toResponse(booking);
    }

    @Transactional
    public BookingResponse rejectBooking(Long id) {

        Booking booking = getBookingOrThrow(id);

        if (booking.getStatus() != BookingStatus.PENDING) {
            throw new IllegalArgumentException(
                    "Only pending bookings can be rejected"
            );
        }

        booking.setStatus(BookingStatus.REJECTED);
        return toResponse(booking);
    }

    @Transactional
    public BookingResponse cancelBooking(
            Long id,
            Long customerId) {

        Booking booking = getBookingOrThrow(id);

        // A customer must never cancel another customer's booking.
        if (!booking.getCustomerId().equals(customerId)) {
            throw new IllegalArgumentException(
                    "Only the customer who made this booking can cancel it"
            );
        }

        if (booking.getStatus() != BookingStatus.PENDING
                && booking.getStatus() != BookingStatus.ACCEPTED) {

            throw new IllegalArgumentException(
                    "Only pending or accepted bookings can be cancelled"
            );
        }

        booking.setStatus(BookingStatus.CANCELLED);
        return toResponse(booking);
    }

    /**
     * Performs the main business validations shared by create and update.
     */
    private void validateBookingRequest(
            BookingRequest request,
            Long currentBookingId) {

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

        LocalDate today = LocalDate.now();
        LocalTime currentMinute = LocalTime.now()
                .withSecond(0)
                .withNano(0);

        if (request.bookingDate().isBefore(today)
                || (request.bookingDate().isEqual(today)
                && !request.startTime().isAfter(currentMinute))) {

            throw new IllegalArgumentException(
                    "Booking start date and time must be in the future"
            );
        }

        User customer = getCustomerOrThrow(request.customerId());

        Event event = eventRepository.findById(request.eventId())
                .orElseThrow(() -> new IllegalArgumentException(
                        "Event not found: " + request.eventId()
                ));

        /*
         * A customer can reserve resources only for an event that belongs
         * to their own account.
         */
        if (!event.getOrganiser().getId().equals(customer.getId())) {
            throw new IllegalArgumentException(
                    "The selected event does not belong to this customer"
            );
        }

        if (request.vendorId() != null
                && !vendorRepository.existsById(request.vendorId())) {

            throw new IllegalArgumentException(
                    "Selected vendor was not found"
            );
        }

        if (request.venueId() != null
                && !venueRepository.existsById(request.venueId())) {

            throw new IllegalArgumentException(
                    "Selected venue was not found"
            );
        }

        long overlapCount;

        if (currentBookingId == null) {
            overlapCount = bookingRepository.countOverlappingBookings(
                    request.vendorId(),
                    request.venueId(),
                    request.bookingDate(),
                    request.startTime(),
                    request.endTime(),
                    ACTIVE_STATUSES
            );
        } else {
            overlapCount =
                    bookingRepository.countOverlappingBookingsExcludingId(
                            currentBookingId,
                            request.vendorId(),
                            request.venueId(),
                            request.bookingDate(),
                            request.startTime(),
                            request.endTime(),
                            ACTIVE_STATUSES
                    );
        }

        if (overlapCount > 0) {
            throw new IllegalArgumentException(
                    "This vendor or venue is already booked for the selected time"
            );
        }
    }

    /**
     * Copies editable request values into the booking entity.
     */
    private void applyBookingDetails(
            Booking booking,
            BookingRequest request) {

        booking.setCustomerId(request.customerId());
        booking.setEventId(request.eventId());
        booking.setVendorId(request.vendorId());
        booking.setVenueId(request.venueId());
        booking.setBookingDate(request.bookingDate());
        booking.setStartTime(request.startTime());
        booking.setEndTime(request.endTime());
    }

    private User getCustomerOrThrow(Long customerId) {

        User customer = userRepository.findById(customerId)
                .orElseThrow(() -> new IllegalArgumentException(
                        "Customer not found: " + customerId
                ));

        if (customer.getRole() != UserRole.CUSTOMER) {
            throw new IllegalArgumentException(
                    "The booking owner must be a customer"
            );
        }

        return customer;
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
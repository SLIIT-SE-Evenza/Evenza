package com.evenza.booking.repository;

import com.evenza.booking.model.Booking;
import com.evenza.booking.model.BookingStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.Collection;
import java.util.List;

public interface BookingRepository extends JpaRepository<Booking, Long> {

    /*
     * Checks whether a new booking overlaps another active booking.
     *
     * Two periods overlap when:
     * existing start < requested end
     * AND existing end > requested start.
     */
    @Query("""
        SELECT COUNT(b)
        FROM Booking b
        WHERE b.bookingDate = :date
        AND b.status IN :statuses
        AND (
            (:vendorId IS NOT NULL AND b.vendorId = :vendorId)
            OR
            (:venueId IS NOT NULL AND b.venueId = :venueId)
        )
        AND b.startTime < :endTime
        AND b.endTime > :startTime
    """)
    long countOverlappingBookings(
            @Param("vendorId") Long vendorId,
            @Param("venueId") Long venueId,
            @Param("date") LocalDate date,
            @Param("startTime") LocalTime startTime,
            @Param("endTime") LocalTime endTime,
            @Param("statuses") Collection<BookingStatus> statuses
    );

    /*
     * Used while editing a booking.
     * The current booking ID is excluded so it does not conflict with itself.
     */
    @Query("""
        SELECT COUNT(b)
        FROM Booking b
        WHERE b.id <> :bookingId
        AND b.bookingDate = :date
        AND b.status IN :statuses
        AND (
            (:vendorId IS NOT NULL AND b.vendorId = :vendorId)
            OR
            (:venueId IS NOT NULL AND b.venueId = :venueId)
        )
        AND b.startTime < :endTime
        AND b.endTime > :startTime
    """)
    long countOverlappingBookingsExcludingId(
            @Param("bookingId") Long bookingId,
            @Param("vendorId") Long vendorId,
            @Param("venueId") Long venueId,
            @Param("date") LocalDate date,
            @Param("startTime") LocalTime startTime,
            @Param("endTime") LocalTime endTime,
            @Param("statuses") Collection<BookingStatus> statuses
    );

    // Returns only the selected customer's bookings.
    List<Booking> findByCustomerIdOrderByBookingDateDesc(Long customerId);
    // Checks whether a vendor is still referenced by a booking.
    boolean existsByVendorId(Long vendorId);

    // Checks whether a venue is still referenced by a booking.
    boolean existsByVenueId(Long venueId);
}
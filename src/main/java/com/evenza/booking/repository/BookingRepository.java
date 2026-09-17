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

public interface BookingRepository
        extends JpaRepository<Booking, Long> {

    @Query("""
        SELECT COUNT(b) > 0
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
    boolean existsOverlappingBooking(
            @Param("vendorId") Long vendorId,
            @Param("venueId") Long venueId,
            @Param("date") LocalDate date,
            @Param("startTime") LocalTime startTime,
            @Param("endTime") LocalTime endTime,
            @Param("statuses") Collection<BookingStatus> statuses
    );

    List<Booking> findByCustomerIdOrderByBookingDateDesc(
            Long customerId
    );
}
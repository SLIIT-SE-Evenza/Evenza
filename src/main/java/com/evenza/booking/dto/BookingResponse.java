package com.evenza.booking.dto;

import com.evenza.booking.model.BookingStatus;

import java.time.LocalDate;
import java.time.LocalTime;

public record BookingResponse(

        Long id,
        Long customerId,
        Long eventId,
        Long vendorId,
        Long venueId,
        LocalDate bookingDate,
        LocalTime startTime,
        LocalTime endTime,
        BookingStatus status

) {
}
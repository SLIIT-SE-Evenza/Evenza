package com.evenza.booking.dto;

import jakarta.validation.constraints.FutureOrPresent;
import jakarta.validation.constraints.NotNull;

import java.time.LocalDate;
import java.time.LocalTime;

public record BookingRequest(

        @NotNull
        Long customerId,

        @NotNull
        Long eventId,

        Long vendorId,

        Long venueId,

        @NotNull
        @FutureOrPresent
        LocalDate bookingDate,

        @NotNull
        LocalTime startTime,

        @NotNull
        LocalTime endTime
) {
}
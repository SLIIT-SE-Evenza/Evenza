package com.evenza.event.dto;

import jakarta.validation.constraints.Future;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

import java.time.LocalDateTime;

/** Data accepted when an event is created or edited. */
public record EventRequest(
        @NotNull Long organiserId,
        @NotBlank @Size(min = 3, max = 150) String name,
        @NotNull @Future LocalDateTime eventDate,
        @Min(1) @Max(100000) int guestCount,
        @Size(max = 1000) String requirements
) {
}

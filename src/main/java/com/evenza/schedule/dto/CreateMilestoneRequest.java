package com.evenza.schedule.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.FutureOrPresent;
import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.Size;
import jakarta.validation.constraints.NotNull;
import java.time.LocalDate;


public record CreateMilestoneRequest(

        @NotNull(message = "Event ID is required")
        @Positive(message = "Event ID must be positive")
        Long eventId,

        @NotBlank(message = "Milestone name is required")
        @Size(max =100, message = "Milestone name can not exceed 100 characters")
        String name,

        @NotNull(message = "Target date is required")
        @FutureOrPresent(message = "Target date cannot be in the past")
        LocalDate targetDate

) {
}

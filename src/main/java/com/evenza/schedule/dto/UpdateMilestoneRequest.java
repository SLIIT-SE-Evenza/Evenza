package com.evenza.schedule.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import java.time.LocalDate;

public record UpdateMilestoneRequest(

        @NotBlank(message = "Milestone name is required")
        @Size(max = 100, message = "Milestone name cannot exceed 100 characters")
        String name,

        @NotNull(message = "Target date is required")
        LocalDate targetDate
) {
}

package com.evenza.schedule.dto;

import com.evenza.schedule.entity.MilestoneStatus;

import java.time.LocalDate;

public record MilestoneResponse(

        Long id,
        Long eventId,
        String name,
        LocalDate targetDate,
        MilestoneStatus status

) {
}
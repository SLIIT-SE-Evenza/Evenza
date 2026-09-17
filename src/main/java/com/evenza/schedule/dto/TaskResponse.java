package com.evenza.schedule.dto;
import com.evenza.schedule.entity.TaskStatus;

import java.time.LocalDateTime;

public record TaskResponse(

        Long id,
        Long eventId,
        Long milestoneId,
        Long assignedStaffId,
        String title,
        String description,
        LocalDateTime startTime,
        LocalDateTime endTime,
        LocalDateTime deadline,
        TaskStatus status,
        LocalDateTime updatedAt

) {
}

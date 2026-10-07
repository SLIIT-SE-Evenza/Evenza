package com.evenza.event.dto;

import com.evenza.event.entity.EventStatus;
import java.time.LocalDateTime;

/** A DTO prevents the lazy organiser relationship from being serialized recursively. */
public record EventResponse(
        Long id,
        Long organiserId,
        String organiserName,
        String name,
        LocalDateTime eventDate,
        int guestCount,
        String requirements,
        EventStatus status,
        LocalDateTime createdAt
) {
}

package com.evenza.event.repository;

import com.evenza.event.entity.Event;
import com.evenza.event.entity.EventStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDateTime;
import java.util.List;

public interface EventRepository extends JpaRepository<Event, Long> {

    List<Event> findByOrganiserId(Long organiserId);

    List<Event> findByStatus(EventStatus status);

    // Counts matching events created within the same minute.
    @Query("""
        SELECT COUNT(e)
        FROM Event e
        WHERE e.organiser.id = :organiserId
          AND LOWER(e.name) = LOWER(:name)
          AND e.eventDate >= :minuteStart
          AND e.eventDate < :minuteEnd
    """)
    long countDuplicates(
            @Param("organiserId") Long organiserId,
            @Param("name") String name,
            @Param("minuteStart") LocalDateTime minuteStart,
            @Param("minuteEnd") LocalDateTime minuteEnd
    );

    // Excludes the current record when editing an event.
    @Query("""
        SELECT COUNT(e)
        FROM Event e
        WHERE e.organiser.id = :organiserId
          AND LOWER(e.name) = LOWER(:name)
          AND e.eventDate >= :minuteStart
          AND e.eventDate < :minuteEnd
          AND e.id <> :excludedId
    """)
    long countDuplicatesExcludingId(
            @Param("organiserId") Long organiserId,
            @Param("name") String name,
            @Param("minuteStart") LocalDateTime minuteStart,
            @Param("minuteEnd") LocalDateTime minuteEnd,
            @Param("excludedId") Long excludedId
    );
}
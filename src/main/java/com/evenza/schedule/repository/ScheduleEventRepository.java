package com.evenza.schedule.repository;

import com.evenza.entity.Event;
import org.springframework.data.jpa.repository.JpaRepository;

/**
 * Schedule-owned read/write access to the shared Event entity.
 * Keeping this repository inside FR4 avoids copying another member's module.
 */
public interface ScheduleEventRepository extends JpaRepository<Event, Long> {
}

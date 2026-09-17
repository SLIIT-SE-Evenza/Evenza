package com.evenza.event.repository;

import com.evenza.event.entity.Event;
import com.evenza.event.entity.EventStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface EventRepository extends JpaRepository<Event, Long> {

    List<Event> findByOrganiserId(Long organiserId);

    List<Event> findByStatus(EventStatus status);
}


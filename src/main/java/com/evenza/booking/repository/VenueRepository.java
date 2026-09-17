package com.evenza.booking.repository;

import com.evenza.booking.model.Venue;
import org.springframework.data.jpa.repository.JpaRepository;

public interface VenueRepository
        extends JpaRepository<Venue, Long> {
}

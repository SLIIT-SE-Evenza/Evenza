package com.evenza.booking.repository;

import com.evenza.booking.model.Venue;
import org.springframework.data.jpa.repository.JpaRepository;

public interface VenueRepository
        extends JpaRepository<Venue, Long> {
    // Prevents two venues from using the same name.
    boolean existsByNameIgnoreCase(String name);

    // Used while editing so the current venue does not match itself.
    boolean existsByNameIgnoreCaseAndIdNot(
            String name,
            Long id
    );
}

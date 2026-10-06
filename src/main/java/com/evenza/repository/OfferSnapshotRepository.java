package com.evenza.repository;

import com.evenza.promotion.entity.OfferSnapshot;
import org.springframework.data.jpa.repository.JpaRepository;

/**
 * Database access for captured booking offer terms.
 *
 * The primary key is the booking reference.
 */
public interface OfferSnapshotRepository
        extends JpaRepository<OfferSnapshot, String> {
}
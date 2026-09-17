package com.evenza.promotion.repository;

import com.evenza.promotion.entity.Promotion;

import jakarta.persistence.LockModeType;

import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Lock;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.Instant;
import java.util.List;
import java.util.Optional;

public interface PromotionRepository
        extends JpaRepository<Promotion, Long> {

    // Vendor's promotions, newest first.
    List<Promotion> findByOwnerUsernameOrderByIdDesc(
            String ownerUsername
    );
    // All currently active offers.
    @Query("""
            SELECT p
            FROM Promotion p
            WHERE p.published = true
              AND p.archived = false
              AND p.startsAt <= :now
              AND p.endsAt > :now
            ORDER BY p.id DESC
            """)
    List<Promotion> findVisible(
            @Param("now") Instant now
    );

    // Active offers for the featured section.
    // The service will limit the result to three offers.
    @Query("""
            SELECT p
            FROM Promotion p
            WHERE p.published = true
              AND p.archived = false
              AND p.startsAt <= :now
              AND p.endsAt > :now
            ORDER BY p.id DESC
            """)
    List<Promotion> findFeatured(
            @Param("now") Instant now,
            Pageable pageable
    );
    // Must be called inside a service transaction.
    @Lock(LockModeType.PESSIMISTIC_WRITE)
    @Query("""
            SELECT p
            FROM Promotion p
            WHERE p.id = :id
            """)
    Optional<Promotion> lockById(
            @Param("id") Long id
    );
}




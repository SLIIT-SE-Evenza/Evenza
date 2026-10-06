package com.evenza.promotion.service;

import com.evenza.promotion.entity.OfferSnapshot;
import com.evenza.promotion.entity.Promotion;
import com.evenza.promotion.repository.OfferSnapshotRepository;
import com.evenza.promotion.repository.PromotionRepository;

import jakarta.persistence.EntityManager;

import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.time.Clock;
import java.time.Instant;
import java.util.Optional;

/**
 * Captures promotion terms for bookings.
 *
 * Internal Booking-module integration only.
 * Do not expose this service directly through a public endpoint.
 */
@Service
public class OfferSnapshotService {

    private final PromotionRepository promotions;
    private final OfferSnapshotRepository snapshots;
    private final EntityManager entityManager;
    private final Clock clock;

    public OfferSnapshotService(
            PromotionRepository promotions,
            OfferSnapshotRepository snapshots,
            EntityManager entityManager,
            @Qualifier("promotionClock") Clock clock
    ) {
        this.promotions = promotions;
        this.snapshots = snapshots;
        this.entityManager = entityManager;
        this.clock = clock;}
    /**
     * Captures an available promotion's terms for a booking.
     *
     * Before calling, the Booking module must:
     * 1. Authenticate the customer.
     * 2. Validate the booking and selected special package.
     * 3. Supply a stable booking reference.
     *
     * Call within the booking-save transaction so that the booking
     * and snapshot succeed or roll back together.
     */
    @Transactional
    public OfferSnapshot captureForBooking(
            Long promotionId,
            String bookingReference
    ) {
        validatePromotionId(promotionId);

        String reference = validateBookingReference(
                bookingReference
        );

        // Coordinate snapshot creation with other operations
        // accessing this promotion.
        Promotion promotion = promotions.lockById(promotionId)
                .orElseThrow(
                        OfferSnapshotService::promotionNotFound
                );
        Optional<OfferSnapshot> existing =
                snapshots.findById(reference);

        if (existing.isPresent()) {
            OfferSnapshot savedSnapshot = existing.get();

            if (!savedSnapshot.getPromotionId().equals(promotionId)) {
                throw new ResponseStatusException(
                        HttpStatus.CONFLICT,
                        "This booking already has an offer "
                                + "from another promotion."
                );
            }

            // Preserve previously agreed terms even if the current
            // promotion has changed, expired or been deactivated.
            return savedSnapshot;
        }

        Instant now = clock.instant();

        if (!promotion.isVisibleAt(now)) {
            throw new IllegalArgumentException(
                    "This offer is not currently available "
                            + "for a new booking."
            );
        }

        OfferSnapshot snapshot = new OfferSnapshot(
                reference,
                promotion,
                now
        );
        /*
         * Insert only: never merge new values into an existing
         * booking snapshot.
         *
         * The booking-reference primary key also prevents two
         * snapshots from being inserted for the same booking.
         */
        entityManager.persist(snapshot);
        entityManager.flush();

        return snapshot;
    }

    // ---------- Internal validation ----------

    private void validatePromotionId(Long promotionId) {
        if (promotionId == null || promotionId <= 0) {
            throw new IllegalArgumentException(
                    "A valid promotion ID is required."
            );
        }
    }
    private String validateBookingReference(
            String bookingReference
    ) {
        if (
                bookingReference == null
                        || bookingReference.isBlank()
        ) {
            throw new IllegalArgumentException(
                    "A booking reference is required."
            );
        }

        String cleanedReference = bookingReference.trim();

        if (cleanedReference.length() > 100) {
            throw new IllegalArgumentException(
                    "Booking reference cannot exceed 100 characters."
            );
        }

        return cleanedReference;
    }

    private static ResponseStatusException promotionNotFound() {
        return new ResponseStatusException(
                HttpStatus.NOT_FOUND,
                "The requested promotion was not found."
        );
    }
}


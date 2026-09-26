package com.evenza.promotion.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.Objects;

/**
 * Stores the offer terms captured for a booking.
 *
 * Later changes to the Promotion do not change these values.
 * This entity intentionally provides no setters.
 */
@Entity
@Table(name = "promotion_offer_snapshots")
public class OfferSnapshot {

    // ---------- Booking reference ----------

    /**
     * Supplied by the Booking module.
     * Each booking reference can have one offer snapshot.
     */
    @Id
    @Column(
            nullable = false,
            updatable = false,
            length = 100
    )
    private String bookingReference;

    // ---------- Original promotion reference ----------

    @Column(nullable = false, updatable = false)
    private Long promotionId;

    @Column(nullable = false, updatable = false)
    private Long promotionVersion;

    // ---------- Captured package details ----------

    @Column(
            nullable = false,
            updatable = false,
            length = 150
    )
    private String packageName;

    @Column(
            nullable = false,
            updatable = false,
            precision = 12,
            scale = 2
    )
    private BigDecimal originalPrice;

    @Column(
            nullable = false,
            updatable = false,
            precision = 12,
            scale = 2
    )
    private BigDecimal finalPrice;

    // ---------- Captured discount ----------

    @Enumerated(EnumType.STRING)
    @Column(
            nullable = false,
            updatable = false,
            length = 20
    )
    private DiscountType discountType;

    @Column(
            nullable = false,
            updatable = false,
            precision = 12,
            scale = 2
    )
    private BigDecimal discountValue;

    // ---------- Captured terms ----------

    @Column(
            nullable = false,
            updatable = false,
            length = 3000
    )
    private String terms;

    @Column(nullable = false, updatable = false)
    private Instant acceptedAt;

// ---------- Constructors ----------
protected OfferSnapshot() {
}

    /**
     * Captures a currently available, saved promotion.
     *
     * The calling service must validate the booking and selected package.
     */
    public OfferSnapshot(
            String bookingReference,
            Promotion promotion,
            Instant now
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

        Objects.requireNonNull(
                promotion,
                "A promotion is required."
        );

        Objects.requireNonNull(
                now,
                "The offer acceptance time is required.");
        if (
                promotion.getId() == null
                        || promotion.getVersion() == null
        ) {
            throw new IllegalArgumentException(
                    "The promotion must be saved before capturing an offer."
            );
        }

        if (!promotion.isVisibleAt(now)) {
            throw new IllegalArgumentException(
                    "This promotion is not currently available."
            );
        }

        this.bookingReference = cleanedReference;

        this.promotionId = promotion.getId();
        this.promotionVersion = promotion.getVersion();

        this.packageName = promotion.getPackageName();

        this.originalPrice = promotion.getPackagePrice();
        this.finalPrice = promotion.getFinalPrice();

        this.discountType = promotion.getDiscountType();
        this.discountValue = promotion.getDiscountValue();

        this.terms = promotion.getTerms();
        this.acceptedAt = now;
    }

// ---------- Getters ----------
public String getBookingReference() {
    return bookingReference;
}

    public Long getPromotionId() {
        return promotionId;
    }

    public Long getPromotionVersion() {
        return promotionVersion;
    }

    public String getPackageName() {
        return packageName;
    }

    public BigDecimal getOriginalPrice() {
        return originalPrice;
    }

    public BigDecimal getFinalPrice() {
        return finalPrice;
    }

    public DiscountType getDiscountType() {
        return discountType;
    }

    public BigDecimal getDiscountValue() {
        return discountValue;
    }

    public String getTerms() {
        return terms;
    }

    public Instant getAcceptedAt() {
        return acceptedAt;
    }
}


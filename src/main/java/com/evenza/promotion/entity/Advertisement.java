package com.evenza.promotion.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Lob;
import jakarta.persistence.Table;

/**
 * Stores the optional banner image for a promotion.
 *
 * Offer title, price, discount and campaign dates remain
 * in the Promotion entity.
 */
@Entity
@Table(name = "promotion_advertisements")
public class Advertisement {

    /**
     * Uses the associated promotion's ID.
     * Each promotion can have at most one banner record.
     */
    @Id
    @Column(nullable = false, updatable = false)
    private Long promotionId;

    /**
     * Image bytes validated and normalized by the banner service.
     */
    @Lob
    @Column(nullable = false)
    private byte[] image;

    /**
     * Required by JPA.
     */
    protected Advertisement() {
    }

    /**
     * Creates a banner record for an existing promotion.
     */
    public Advertisement(Long promotionId, byte[] image) {
        if (promotionId == null || promotionId <= 0) {
            throw new IllegalArgumentException(
                    "A valid promotion ID is required."
            );
        }

        this.promotionId = promotionId;
        replaceImage(image);
    }

    /**
     * Replaces the banner with validated image bytes.
     */
    public void replaceImage(byte[] image) {
        if (image == null || image.length == 0) {
            throw new IllegalArgumentException(
                    "Banner image cannot be empty."
            );
        }
        // Keep an independent copy of the supplied bytes.
        this.image = image.clone();
    }

    public Long getPromotionId() {
        return promotionId;
    }

    public byte[] getImage() {
        // Prevent callers from modifying the stored array directly.
        return image.clone();
    }
}
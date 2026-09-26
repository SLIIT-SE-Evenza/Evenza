package com.evenza.promotion.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import jakarta.persistence.UniqueConstraint;

import java.time.Instant;
import java.util.Objects;

/**
 * Records a counted interaction with a promotion.
 */
@Entity
@Table(
        name = "promotion_engagements",
        uniqueConstraints = {
                @UniqueConstraint(
                        name = "uk_promotion_engagement_source",
                        columnNames = {
                                "promotion_id",
                                "kind",
                                "source_key"
                        }
                )
        }
)
public class Engagement {

    /**
     * Supported interaction types.
     */
    public enum Kind {

        // Advertisement card was viewed.
        IMPRESSION,

        // Customer clicked the advertisement's offer link.
        CLICK,

        // A real inquiry linked to this promotion was saved.
        INQUIRY
    }

    // ---------- Identity ----------

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // ---------- Interaction details ----------

    @Column(
            name = "promotion_id",
            nullable = false,
            updatable = false
    )
    private Long promotionId;

    @Enumerated(EnumType.STRING)
    @Column(
            name = "kind",
            nullable = false,
            updatable = false,
            length = 20
    )
    private Kind kind;

    /**
     * A server-generated key used to prevent duplicate counting.
     *
     * Views/clicks: a hashed browser-session and UTC-date key.
     * Inquiries: a reference to the successfully saved inquiry.
     */
    @Column(
            name = "source_key",
            nullable = false,
            updatable = false,
            length = 160
    )
    private String sourceKey;

    @Column(
            name = "occurred_at",
            nullable = false,
            updatable = false
    )
    private Instant occurredAt;

    // ---------- Constructors ----------

    /**
     * Required by JPA.
     */
    protected Engagement() {
    }
    /**
     * Creates a record after the service validates the interaction.
     */
    public Engagement(
            Long promotionId,
            Kind kind,
            String sourceKey,
            Instant now
    ) {
        if (promotionId == null || promotionId <= 0) {
            throw new IllegalArgumentException(
                    "A valid promotion ID is required."
            );
        }

        if (kind == null) {
            throw new IllegalArgumentException(
                    "An engagement type is required."
            );
        }

        if (sourceKey == null || sourceKey.isBlank()) {
            throw new IllegalArgumentException(
                    "An engagement source key is required."
            );
        }

        String cleanedSourceKey = sourceKey.trim();

        if (cleanedSourceKey.length() > 160) {
            throw new IllegalArgumentException(
                    "Engagement source key cannot exceed 160 characters."
            );
        }
        Objects.requireNonNull(
                now,
                "Engagement time is required."
        );

        this.promotionId = promotionId;
        this.kind = kind;
        this.sourceKey = cleanedSourceKey;
        this.occurredAt = now;
    }

    // ---------- Getters ----------

    public Long getId() {
        return id;
    }

    public Long getPromotionId() {
        return promotionId;
    }

    public Kind getKind() {
        return kind;
    }

    public String getSourceKey() {
        return sourceKey;
    }

    public Instant getOccurredAt() {
        return occurredAt;
    }
}



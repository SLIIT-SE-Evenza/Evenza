package com.evenza.promotion.entity;

import com.evenza.promotion.domain.OfferRules;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import jakarta.persistence.Version;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.Objects;

/**
 * A special-package promotion owned by a vendor or service provider.
 */
@Entity
@Table(name = "promotions")
public class Promotion {

    // ---------- Identity ----------

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    /**
     * Used to detect concurrent or stale edits.
     * Managed automatically by JPA.
     */
    @Version
    private Long version;
    /**
     * Supplied by the service from the authenticated account.
     * Customers do not enter this value in a form.
     */
    @Column(
            nullable = false,
            updatable = false,
            length = 150
    )
    private String ownerUsername;

    // ---------- Offer details ----------

    @Column(nullable = false, length = 150)
    private String title;

    @Column(nullable = false, length = 2000)
    private String description;

    @Column(nullable = false, length = 150)
    private String packageName;

    @Column(nullable = false, length = 80)
    private String serviceCategory;

    // ---------- Price and discount ----------

    @Column(nullable = false, precision = 12, scale = 2)
    private BigDecimal packagePrice;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private DiscountType discountType;

    @Column(nullable = false, precision = 12, scale = 2)
    private BigDecimal discountValue;

// ---------- Campaign schedule ----------
@Column(nullable = false)
private Instant startsAt;

    @Column(nullable = false)
    private Instant endsAt;

    @Column(nullable = false, length = 3000)
    private String terms;

    // ---------- Publication state ----------

    @Column(nullable = false)
    private boolean published;

    @Column(nullable = false)
    private boolean archived;

    /**
     * Distinguishes a draft from a previously published,
     * currently inactive promotion.
     */
    @Column(nullable = false)
    private boolean everPublished;

    // ---------- Audit dates ----------

    @Column(nullable = false, updatable = false)
    private Instant createdAt;

    @Column(nullable = false)
    private Instant updatedAt;

    // ---------- Constructors ----------

    /**
     * Required by JPA.
     */
    protected Promotion() {
    }

/**
 * Creates a new draft belonging to the authenticated vendor.
 * Call revise() to supply its details before saving.
 */
public Promotion(String ownerUsername, Instant now) {
    this.ownerUsername = requireText(
            ownerUsername,
            "Owner username",
            150
    );

    Objects.requireNonNull(now, "Current time is required.");

    this.createdAt = now;
    this.updatedAt = now;

    this.published = false;
    this.archived = false;
    this.everPublished = false;
}

    // ---------- Business operations ----------

    /**
     * Updates promotion details without changing ownership.
     */
    public void revise(
            String title,
            String description,
            String packageName,
            String serviceCategory,
            BigDecimal packagePrice,
            DiscountType discountType,
            BigDecimal discountValue,
            Instant startsAt,
            Instant endsAt,
            String terms,
            Instant now
    ) {
        ensureNotArchived();

        Objects.requireNonNull(now, "Current time is required.");

        OfferRules.validate(
                packagePrice,
                discountType,
                discountValue,
                startsAt,
                endsAt
        );

        // Validate all text before changing the entity.
        String validatedTitle = requireText(
                title,
                "Promotion title",
                150
        );

        String validatedDescription = requireText(
                description,
                "Description",
                2000
        );

        String validatedPackageName = requireText(
                packageName,
                "Special package name",
                150
        );

        String validatedCategory = requireText(
                serviceCategory,
                "Service category",
                80
        );

        String validatedTerms = requireText(
                terms,
                "Terms and conditions",
                3000
        );

        this.title = validatedTitle;
        this.description = validatedDescription;
        this.packageName = validatedPackageName;
        this.serviceCategory = validatedCategory;

        this.packagePrice = packagePrice;
        this.discountType = discountType;
        this.discountValue = discountValue;

        this.startsAt = startsAt;
        this.endsAt = endsAt;
        this.terms = validatedTerms;

        this.updatedAt = now;
    }

    /**
     * Publishes directly without admin approval.
     * Future campaigns become SCHEDULED until their start time.
     */
    public void publish(Instant now) {
        ensureNotArchived();

        Objects.requireNonNull(now, "Current time is required.");

        OfferRules.validate(
                packagePrice,
                discountType,
                discountValue,
                startsAt,
                endsAt
        );
        if (!endsAt.isAfter(now)) {
            throw new IllegalArgumentException(
                    "An expired promotion cannot be published. "
                            + "Update its campaign dates first."
            );
        }

        this.published = true;
        this.everPublished = true;
        this.updatedAt = now;
    }

    /**
     * Stops public display of a promotion.
     */
    public void deactivate(Instant now) {
        ensureNotArchived();

        Objects.requireNonNull(now, "Current time is required.");

        this.published = false;
        this.updatedAt = now;
    }

    /**
     * Retains the promotion for history and prevents further edits.
     */
    public void archive(Instant now) {
        Objects.requireNonNull(now, "Current time is required.");

        if (this.archived) {
            return;
        }

        this.published = false;
        this.archived = true;
        this.updatedAt = now;
    }
    /**
     * Checks whether customers may currently see this offer.
     */
    public boolean isVisibleAt(Instant now) {
        return OfferRules.visible(
                published,
                archived,
                startsAt,
                endsAt,
                now
        );
    }

    /**
     * Calculates the current status from stored flags and dates.
     * Expiry does not require a scheduled database update.
     */
    public PromotionStatus statusAt(Instant now) {
        Objects.requireNonNull(now, "Current time is required.");

        if (archived) {
            return PromotionStatus.ARCHIVED;
        }

        // A newly constructed draft may not have details yet.
        if (startsAt == null || endsAt == null) {
            return PromotionStatus.DRAFT;
        }

        if (!now.isBefore(endsAt)) {
            return PromotionStatus.EXPIRED;
        }
        if (!published) {
            return everPublished
                    ? PromotionStatus.INACTIVE
                    : PromotionStatus.DRAFT;
        }

        if (now.isBefore(startsAt)) {
            return PromotionStatus.SCHEDULED;
        }

        return PromotionStatus.ACTIVE;
    }

    /**
     * Calculates the current discounted package price.
     */
    public BigDecimal getFinalPrice() {
        return OfferRules.finalPrice(
                packagePrice,
                discountType,
                discountValue
        );
    }

    // ---------- Internal validation ----------

    private void ensureNotArchived() {
        if (archived) {
            throw new IllegalArgumentException(
                    "Archived promotions cannot be changed or republished."
            );
        }
    }
    private static String requireText(
            String value,
            String fieldName,
            int maximumLength
    ) {
        if (value == null || value.isBlank()) {
            throw new IllegalArgumentException(
                    fieldName + " is required."
            );
        }

        String cleanedValue = value.trim();

        if (cleanedValue.length() > maximumLength) {
            throw new IllegalArgumentException(
                    fieldName + " cannot exceed "
                            + maximumLength + " characters."
            );
        }

        return cleanedValue;
    }

    // ---------- Getters ----------
    public Long getId() {
        return id;
    }

    public Long getVersion() {
        return version;
    }

    public String getOwnerUsername() {
        return ownerUsername;
    }

    public String getTitle() {
        return title;
    }

    public String getDescription() {
        return description;
    }

    public String getPackageName() {
        return packageName;
    }

    public String getServiceCategory() {
        return serviceCategory;
    }
    public BigDecimal getPackagePrice() {
        return packagePrice;
    }

    public DiscountType getDiscountType() {
        return discountType;
    }

    public BigDecimal getDiscountValue() {
        return discountValue;
    }

    public Instant getStartsAt() {
        return startsAt;
    }

    public Instant getEndsAt() {
        return endsAt;
    }

    public String getTerms() {
        return terms;
    }

    public boolean isPublished() {
        return published;
    }

    public boolean isArchived() {
        return archived;
    }

    public boolean isEverPublished() {
        return everPublished;
    }

    public Instant getCreatedAt() {
        return createdAt;
    }

    public Instant getUpdatedAt() {
        return updatedAt;
    }
}



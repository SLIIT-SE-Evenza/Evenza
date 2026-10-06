package com.evenza.promotion.service;

import com.evenza.promotion.entity.Engagement;
import com.evenza.promotion.entity.Engagement.Kind;
import com.evenza.promotion.entity.Promotion;
import com.evenza.promotion.repository.EngagementRepository;
import com.evenza.promotion.repository.PromotionRepository;

import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.time.Clock;

/**
 * Records promotion engagement and provides owner-only analytics.
 */
@Service
@Transactional(readOnly = true)
public class PromotionAnalyticsService {

    /**
     * Matches the values used by analytics.html.
     */
    public record Metrics(
            long impressions,
            long clicks,
            long inquiries
    ) {
    }
    private final PromotionRepository promotions;
    private final EngagementRepository engagements;
    private final PromotionService promotionService;
    private final PromotionAccess access;
    private final Clock clock;

    public PromotionAnalyticsService(
            PromotionRepository promotions,
            EngagementRepository engagements,
            PromotionService promotionService,
            PromotionAccess access,
            @Qualifier("promotionClock") Clock clock
    ) {
        this.promotions = promotions;
        this.engagements = engagements;
        this.promotionService = promotionService;
        this.access = access;
        this.clock = clock;
    }

    // ---------- Advertisement views and clicks ----------

    /**
     * Records an impression or click.
     *
     * The controller generates the session key on the server.
     * The browser must not supply its own counting key.
     */
    @Transactional
    public void recordVisit(
            Long promotionId,
            Kind kind,
            String sessionKey
    ) {
        if (kind != Kind.IMPRESSION && kind != Kind.CLICK) {
            throw new IllegalArgumentException(
                    "Only impressions and clicks can be recorded "
                            + "through the advertisement visit flow."
            );
        }
        String validatedKey = validateSourceKey(sessionKey);

        Promotion promotion = lockPromotion(promotionId);

        // Do not count interactions with unavailable offers.
        if (!promotion.isVisibleAt(clock.instant())) {
            return;
        }

        // Do not count the owner's own views or clicks.
        if (access.isOwner(promotion.getOwnerUsername())) {
            return;
        }

        recordIfNew(
                promotionId,
                kind,
                validatedKey
        );
    }

    // ---------- Inquiry integration ----------

    /**
     * Records a conversion for an inquiry that has actually been saved.
     *
     * Internal integration method only:
     * - The Inquiry module must validate the source promotion.
     * - It must save the real inquiry before calling this method.
     * - Call within the inquiry-save transaction.
     * - Do not expose this method as a public conversion endpoint.
     */
    @Transactional
    public void recordSavedInquiry(
            Long promotionId,
            String inquiryId
    ) {
        if (inquiryId == null || inquiryId.isBlank()) {
            throw new IllegalArgumentException(
                    "A saved inquiry ID is required."
            );
        }

        String cleanedInquiryId = inquiryId.trim();

        if (cleanedInquiryId.length() > 120) {
            throw new IllegalArgumentException(
                    "Inquiry ID cannot exceed 120 characters."
            );
        }

        lockPromotion(promotionId);

        String sourceKey = "inquiry:" + cleanedInquiryId;

        recordIfNew(
                promotionId,
                Kind.INQUIRY,
                sourceKey
        );
    }
    // ---------- Owner analytics ----------

    /**
     * Returns lifetime totals for an owned promotion.
     * Another vendor cannot access these analytics.
     */
    public Metrics metrics(Long promotionId) {
        promotionService.owned(promotionId);

        long impressions = engagements.countByPromotionIdAndKind(
                promotionId,
                Kind.IMPRESSION
        );

        long clicks = engagements.countByPromotionIdAndKind(
                promotionId,
                Kind.CLICK
        );

        long inquiries = engagements.countByPromotionIdAndKind(
                promotionId,
                Kind.INQUIRY
        );

        return new Metrics(
                impressions,
                clicks,
                inquiries
        );
    }
    // ---------- Internal helpers ----------

    /**
     * Locks the promotion during an engagement write.
     *
     * Calls through this service serialize their duplicate checks
     * for the same promotion. The database unique constraint
     * provides an additional duplicate safeguard.
     */
    private Promotion lockPromotion(Long promotionId) {
        if (promotionId == null || promotionId <= 0) {
            throw promotionNotFound();
        }

        return promotions.lockById(promotionId)
                .orElseThrow(
                        PromotionAnalyticsService::promotionNotFound
                );
    }

    /**
     * Called only after acquiring the promotion lock,
     * inside a write transaction.
     */
    private void recordIfNew(
            Long promotionId,
            Kind kind,
            String sourceKey
    ) {
        boolean alreadyRecorded =
                engagements.existsByPromotionIdAndKindAndSourceKey(
                        promotionId,
                        kind,
                        sourceKey
                );

        if (alreadyRecorded) {
            return;
        }

        Engagement engagement = new Engagement(
                promotionId,
                kind,
                sourceKey,
                clock.instant()
        );

        engagements.save(engagement);
    }

    private String validateSourceKey(String sourceKey) {
        if (sourceKey == null || sourceKey.isBlank()) {
            throw new IllegalArgumentException(
                    "An engagement source key is required."
            );
        }

        String cleanedKey = sourceKey.trim();

        if (cleanedKey.length() > 160) {
            throw new IllegalArgumentException(
                    "Engagement source key cannot exceed 160 characters."
            );
        }

        return cleanedKey;
    }

    private static ResponseStatusException promotionNotFound() {
        return new ResponseStatusException(
                HttpStatus.NOT_FOUND,
                "The requested promotion is not available."
        );
    }
}

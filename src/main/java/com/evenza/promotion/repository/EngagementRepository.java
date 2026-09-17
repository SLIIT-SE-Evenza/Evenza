package com.evenza.promotion.repository;

import com.evenza.promotion.entity.Engagement;
import com.evenza.promotion.entity.Engagement.Kind;

import org.springframework.data.jpa.repository.JpaRepository;

/**
 * Database access for promotion engagement records.
 */
public interface EngagementRepository
        extends JpaRepository<Engagement, Long> {

    /**
     * Checks whether the same interaction key has already
     * been recorded for this promotion and engagement type.
     */
    boolean existsByPromotionIdAndKindAndSourceKey(
            Long promotionId,
            Kind kind,
            String sourceKey
    );

    /**
     * Counts a promotion's recorded interactions of one type.
     */
    long countByPromotionIdAndKind(
            Long promotionId,
            Kind kind
    );
}

package com.evenza.promotion.controller;

import com.evenza.promotion.entity.Promotion;
import com.evenza.promotion.service.PromotionService;

import org.springframework.http.CacheControl;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.List;

/**
 * Public read API for currently available promotions.
 *
 * Returns DTOs rather than exposing database entities.
 */
@RestController
@RequestMapping("/api/promotions")
public class PromotionApiController {

    private final PromotionService service;

    public PromotionApiController(PromotionService service) {
        this.service = service;
    }
    /**
     * Public offer response.
     *
     * Owner account details and internal publication flags
     * are not included.
     */
    public record OfferView(
            Long id,
            String title,
            String description,
            String packageName,
            String serviceCategory,
            String currency,
            BigDecimal originalPrice,
            BigDecimal finalPrice,
            String discountType,
            BigDecimal discountValue,
            String terms,
            Instant startsAt,
            Instant endsAt
    ) {public static OfferView from(Promotion promotion) {
        return new OfferView(
                promotion.getId(),
                promotion.getTitle(),
                promotion.getDescription(),
                promotion.getPackageName(),
                promotion.getServiceCategory(),
                "LKR",
                promotion.getPackagePrice(),
                promotion.getFinalPrice(),
                promotion.getDiscountType().name(),
                promotion.getDiscountValue(),
                promotion.getTerms(),
                promotion.getStartsAt(),
                promotion.getEndsAt()
        );
    }
    }
    /**
     * Returns active offers, optionally filtered by category.
     *
     * Examples:
     * GET /api/promotions
     * GET /api/promotions?category=Photography
     */
    @GetMapping
    public ResponseEntity<List<OfferView>> list(
            @RequestParam(
                    name = "category",
                    required = false
            ) String category
    ) {
        List<OfferView> offers = service.advertised(category)
                .stream()
                .map(OfferView::from)
                .toList();

        return ResponseEntity.ok()
                .cacheControl(CacheControl.noStore())
                .body(offers);
    }
    /**
     * Returns one currently active offer.
     *
     * Unavailable or missing promotions return 404
     * through the service's ResponseStatusException.
     */
    @GetMapping("/{id}")
    public ResponseEntity<OfferView> details(
            @PathVariable("id") Long id
    ) {
        Promotion promotion = service.publicOffer(id);

        return ResponseEntity.ok()
                .cacheControl(CacheControl.noStore())
                .body(OfferView.from(promotion));
    }
}




package com.evenza.promotion.controller;

import com.evenza.promotion.service.PromotionService;
import com.evenza.promotion.service.PromotionAnalyticsService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.List;

/** JSON CRUD endpoints used by the evaluation promotion dashboard. */
@RestController
@RequestMapping("/api/promotion-management")
@PreAuthorize("hasAnyRole('VENDOR', 'ADMIN')")
public class PromotionManagementApiController {
    private final PromotionService service;
    private final PromotionAnalyticsService analytics;

    public PromotionManagementApiController(
            PromotionService service,
            PromotionAnalyticsService analytics) {
        this.service = service;
        this.analytics = analytics;
    }

    public record PromotionView(Long id, Long version, String ownerUsername,
            String title, String description,
            String packageName, String serviceCategory, BigDecimal packagePrice,
            String discountType, BigDecimal discountValue, BigDecimal finalPrice,
            Instant startsAt, Instant endsAt, String terms, String status,
            long impressions, long clicks, long inquiries) {
        static PromotionView from(
                Promotion p,
                PromotionService service,
                PromotionAnalyticsService analytics) {
            PromotionAnalyticsService.Metrics metrics = analytics.metrics(p.getId());
            return new PromotionView(p.getId(), p.getVersion(), p.getOwnerUsername(),
                    p.getTitle(), p.getDescription(),
                    p.getPackageName(), p.getServiceCategory(), p.getPackagePrice(),
                    p.getDiscountType().name(), p.getDiscountValue(), p.getFinalPrice(),
                    p.getStartsAt(), p.getEndsAt(), p.getTerms(), service.status(p).name(),
                    metrics.impressions(), metrics.clicks(), metrics.inquiries());
        }
    }

    @GetMapping
    public List<PromotionView> all() {
        return service.managementList().stream()
                .map(p -> PromotionView.from(p, service, analytics))
                .toList();
    }

    @GetMapping("/{id}")
    public PromotionView one(@PathVariable Long id) {
        return PromotionView.from(service.managementOne(id), service, analytics);
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public PromotionView create(@Valid @RequestBody PromotionForm form) {
        return PromotionView.from(service.save(null, form, null, false), service, analytics);
    }

    @PutMapping("/{id}")
    public PromotionView update(@PathVariable Long id, @Valid @RequestBody PromotionForm form) {
        return PromotionView.from(service.save(id, form, null, false), service, analytics);
    }

    @PatchMapping("/{id}/{action}")
    public PromotionView action(@PathVariable Long id, @PathVariable String action) {
        switch (action.toLowerCase()) {
            case "publish" -> service.publish(id);
            case "deactivate" -> service.deactivate(id);
            case "archive" -> service.archive(id);
            default -> throw new IllegalArgumentException("Unknown promotion action: " + action);
        }
        return PromotionView.from(service.managementOne(id), service, analytics);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        service.delete(id);
        return ResponseEntity.noContent().build();
    }
}

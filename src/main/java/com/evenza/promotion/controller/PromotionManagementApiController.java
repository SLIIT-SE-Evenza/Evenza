package com.evenza.promotion.controller;

import com.evenza.promotion.dto.PromotionForm;
import com.evenza.promotion.entity.Promotion;
import com.evenza.promotion.service.PromotionService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.List;

/** JSON CRUD endpoints used by the evaluation promotion dashboard. */
@RestController
@RequestMapping("/api/promotion-management")
public class PromotionManagementApiController {
    private final PromotionService service;

    public PromotionManagementApiController(PromotionService service) {
        this.service = service;
    }

    public record PromotionView(Long id, Long version, String title, String description,
            String packageName, String serviceCategory, BigDecimal packagePrice,
            String discountType, BigDecimal discountValue, BigDecimal finalPrice,
            Instant startsAt, Instant endsAt, String terms, String status) {
        static PromotionView from(Promotion p, PromotionService service) {
            return new PromotionView(p.getId(), p.getVersion(), p.getTitle(), p.getDescription(),
                    p.getPackageName(), p.getServiceCategory(), p.getPackagePrice(),
                    p.getDiscountType().name(), p.getDiscountValue(), p.getFinalPrice(),
                    p.getStartsAt(), p.getEndsAt(), p.getTerms(), service.status(p).name());
        }
    }

    @GetMapping
    public List<PromotionView> all() {
        return service.managementList().stream().map(p -> PromotionView.from(p, service)).toList();
    }

    @GetMapping("/{id}")
    public PromotionView one(@PathVariable Long id) {
        return PromotionView.from(service.managementOne(id), service);
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public PromotionView create(@Valid @RequestBody PromotionForm form) {
        return PromotionView.from(service.save(null, form, null, false), service);
    }

    @PutMapping("/{id}")
    public PromotionView update(@PathVariable Long id, @Valid @RequestBody PromotionForm form) {
        return PromotionView.from(service.save(id, form, null, false), service);
    }

    @PatchMapping("/{id}/{action}")
    public PromotionView action(@PathVariable Long id, @PathVariable String action) {
        switch (action.toLowerCase()) {
            case "publish" -> service.publish(id);
            case "deactivate" -> service.deactivate(id);
            case "archive" -> service.archive(id);
            default -> throw new IllegalArgumentException("Unknown promotion action: " + action);
        }
        return PromotionView.from(service.managementOne(id), service);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        service.delete(id);
        return ResponseEntity.noContent().build();
    }
}

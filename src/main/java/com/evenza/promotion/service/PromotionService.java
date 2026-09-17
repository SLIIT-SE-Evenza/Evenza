package com.evenza.promotion.service;

import com.evenza.promotion.dto.PromotionForm;
import com.evenza.promotion.entity.Advertisement;
import com.evenza.promotion.entity.Promotion;
import com.evenza.promotion.entity.PromotionStatus;
import com.evenza.promotion.repository.AdvertisementRepository;
import com.evenza.promotion.repository.PromotionRepository;

import jakarta.validation.ConstraintViolation;
import jakarta.validation.Validator;

import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.time.Clock;
import java.time.Instant;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.util.List;
import java.util.Objects;
import java.util.Set;
import java.util.stream.Collectors;

/**
 * Business operations for promotion management.
 */
@Service
@Transactional(readOnly = true)
public class PromotionService {

    private final PromotionRepository promotions;
    private final AdvertisementRepository advertisements;
    private final PromotionAccess access;
    private final Clock clock;
    private final ZoneId zone;
    private final Validator validator;

    public PromotionService(
            PromotionRepository promotions,
            AdvertisementRepository advertisements,
            PromotionAccess access,
            @Qualifier("promotionClock") Clock clock,
            @Qualifier("promotionZone") ZoneId zone,
            Validator validator
    ) {
        this.promotions = promotions;
        this.advertisements = advertisements;
        this.access = access;
        this.clock = clock;
        this.zone = zone;
        this.validator = validator;
    }

    // ---------- Vendor dashboard ----------

    public List<Promotion> mine() {
        String ownerUsername = access.requireVendor();

        return promotions.findByOwnerUsernameOrderByIdDesc(
                ownerUsername
        );
    }

    /** Returns every promotion owned by the evaluation vendor, including drafts. */
    public List<Promotion> managementList() {
        return mine();
    }

    public Promotion managementOne(Long id) {
        return owned(id);
    }

    @Transactional
    public void delete(Long id) {
        promotions.delete(owned(id));
    }
    // ---------- Featured advertisements ----------

    /**
     * Returns up to three newest active promotions.
     */
    public List<Promotion> featured() {
        return promotions.findFeatured(
                clock.instant(),
                PageRequest.of(0, 3)
        );
    }

    // ---------- Ownership ----------

    public Promotion owned(Long id) {
        access.requireVendor();

        Promotion promotion = find(id);

        access.requireOwner(promotion.getOwnerUsername());

        return promotion;
    }

// ---------- Public advertisements ----------

/**
 * Returns active offers, optionally filtered by category.
 */
public List<Promotion> advertised(String category) {
    List<Promotion> visibleOffers =
            promotions.findVisible(clock.instant());

    if (category == null || category.isBlank()) {
        return visibleOffers;
    }

    String selectedCategory = category.trim();

    return visibleOffers.stream()
            .filter(promotion ->
                    promotion.getServiceCategory()
                            .equalsIgnoreCase(selectedCategory)
            )
            .toList();
}

    public Promotion publicOffer(Long id) {
        Promotion promotion = find(id);

        if (!promotion.isVisibleAt(clock.instant())) {
            throw notFound();
        }

        return promotion;
    }
    /**
     * Customers can read active promotions.
     * Owners can also preview their non-active promotions.
     */
    public Promotion readable(Long id) {
        Promotion promotion = find(id);

        boolean publiclyVisible =
                promotion.isVisibleAt(clock.instant());

        boolean ownedByCurrentUser =
                access.isOwner(promotion.getOwnerUsername());

        if (!publiclyVisible && !ownedByCurrentUser) {
            throw notFound();
        }

        return promotion;
    }

    public PromotionStatus status(Promotion promotion) {
        Objects.requireNonNull(
                promotion,
                "A promotion is required."
        );

        return promotion.statusAt(clock.instant());
    }
    // ---------- Banner access ----------

    public boolean hasBanner(Long id) {
        readable(id);

        return advertisements.existsById(id);
    }

    public byte[] banner(Long id) {
        readable(id);

        Advertisement advertisement = advertisements.findById(id)
                .orElseThrow(PromotionService::notFound);

        return advertisement.getImage();
    }

    // ---------- Create and edit ----------

    /**
     * A null ID creates a promotion.
     * A null banner keeps the existing image.
     *
     * Banner bytes must already be validated by BannerValidator.
     */
    @Transactional
    public Promotion save(
            Long id,
            PromotionForm form,
            byte[] banner,
            boolean publish
    ) {
        String ownerUsername = access.requireVendor();

        Promotion promotion = id == null
                ? null
                : owned(id);
        validateForm(form);

        if (
                promotion != null
                        && !Objects.equals(
                        form.getVersion(),
                        promotion.getVersion()
                )
        ) {
            throw new ResponseStatusException(
                    HttpStatus.CONFLICT,
                    "This promotion has changed. "
                            + "Reload the edit page and try again."
            );
        }

        Instant now = clock.instant();

        Instant startsAt = form.getStartsAt()
                .atZone(zone)
                .toInstant();
        Instant endsAt = form.getEndsAt()
                .atZone(zone)
                .toInstant();

        if (!endsAt.isAfter(now)) {
            throw new IllegalArgumentException(
                    "Choose a campaign end time in the future."
            );
        }

        if (promotion == null) {
            promotion = new Promotion(ownerUsername, now);
        }

        promotion.revise(
                form.getTitle(),
                form.getDescription(),
                form.getPackageName(),
                form.getServiceCategory(),
                form.getPackagePrice(),
                form.getDiscountType(),
                form.getDiscountValue(),
                startsAt,
                endsAt,
                form.getTerms(),
                now
        );

        if (publish) {
            promotion.publish(now);
        }
        Promotion savedPromotion =
                promotions.saveAndFlush(promotion);

        if (banner != null) {
            saveBanner(savedPromotion.getId(), banner);
        }

        return savedPromotion;
    }

    /**
     * Supplies existing values to the edit form.
     */
    public PromotionForm form(Long id) {
        Promotion promotion = owned(id);

        if (promotion.isArchived()) {
            throw new IllegalArgumentException(
                    "Archived promotions cannot be edited."
            );
        }

        PromotionForm form = new PromotionForm();

        form.setTitle(promotion.getTitle());
        form.setDescription(promotion.getDescription());
        form.setPackageName(promotion.getPackageName());
        form.setServiceCategory(promotion.getServiceCategory());

        form.setPackagePrice(promotion.getPackagePrice());
        form.setDiscountType(promotion.getDiscountType());
        form.setDiscountValue(promotion.getDiscountValue());

        form.setStartsAt(
                LocalDateTime.ofInstant(
                        promotion.getStartsAt(),
                        zone
                )
        );
        form.setEndsAt(
                LocalDateTime.ofInstant(
                        promotion.getEndsAt(),
                        zone
                )
        );

        form.setTerms(promotion.getTerms());
        form.setVersion(promotion.getVersion());

        return form;
    }

    // ---------- Publication actions ----------

    @Transactional
    public void publish(Long id) {
        Promotion promotion = owned(id);

        promotion.publish(clock.instant());
    }

    @Transactional
    public void deactivate(Long id) {
        Promotion promotion = owned(id);

        promotion.deactivate(clock.instant());
    }

    @Transactional
    public void archive(Long id) {
        Promotion promotion = owned(id);

        promotion.archive(clock.instant());
    }

    // ---------- Internal helpers ----------

    private Promotion find(Long id) {
        if (id == null || id <= 0) {
            throw notFound();
        }
        return promotions.findById(id)
                .orElseThrow(PromotionService::notFound);
    }

    private void validateForm(PromotionForm form) {
        if (form == null) {
            throw new IllegalArgumentException(
                    "Promotion details are required."
            );
        }

        Set<ConstraintViolation<PromotionForm>> violations =
                validator.validate(form);

        if (!violations.isEmpty()) {
            String message = violations.stream()
                    .map(ConstraintViolation::getMessage)
                    .distinct()
                    .sorted()
                    .collect(Collectors.joining(" "));

            throw new IllegalArgumentException(message);
        }
    }
    private void saveBanner(Long promotionId, byte[] banner) {
        Advertisement advertisement =
                advertisements.findById(promotionId).orElse(null);

        if (advertisement == null) {
            advertisement = new Advertisement(
                    promotionId,
                    banner
            );
        } else {
            advertisement.replaceImage(banner);
        }

        advertisements.save(advertisement);
    }

    private static ResponseStatusException notFound() {
        return new ResponseStatusException(
                HttpStatus.NOT_FOUND,
                "The requested promotion or banner is not available."
        );
    }
}






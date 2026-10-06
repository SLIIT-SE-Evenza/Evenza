package com.evenza.promotion.controller;

import com.evenza.promotion.dto.PromotionForm;
import com.evenza.promotion.entity.DiscountType;
import com.evenza.promotion.entity.Engagement.Kind;
import com.evenza.promotion.entity.Promotion;
import com.evenza.promotion.service.BannerValidator;
import com.evenza.promotion.service.PromotionAccess;
import com.evenza.promotion.service.PromotionAnalyticsService;
import com.evenza.promotion.service.PromotionService;

import jakarta.servlet.http.HttpSession;
import jakarta.validation.Valid;

import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.http.CacheControl;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.WebDataBinder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.InitBinder;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;

import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.time.Clock;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.util.HexFormat;

@Controller
@RequestMapping("/promotions")
public class PromotionController {

    private final PromotionService service;
    private final PromotionAnalyticsService analytics;
    private final PromotionAccess access;
    private final BannerValidator banners;
    private final Clock clock;
    private final ZoneId zone;

    public PromotionController(
            PromotionService service,
            PromotionAnalyticsService analytics,
            PromotionAccess access,
            BannerValidator banners,
            @Qualifier("promotionClock") Clock clock,
            @Qualifier("promotionZone") ZoneId zone
    ) {
        this.service = service;
        this.analytics = analytics;
        this.access = access;
        this.banners = banners;
        this.clock = clock;
        this.zone = zone;
    }

    // ---------- Shared page data ----------

    @ModelAttribute
    public void common(Model model) {
        model.addAttribute("promotionService", service);
        model.addAttribute("zone", zone);
    }

    @InitBinder("form")
    public void configureFormBinding(WebDataBinder binder) {
        binder.setAllowedFields(
                "title",
                "description",
                "packageName",
                "serviceCategory",
                "packagePrice",
                "discountType",
                "discountValue",
                "startsAt",
                "endsAt",
                "terms",
                "version"
        );
    }

    // ---------- Customer browsing ----------

    @GetMapping
    public String browse(
            @RequestParam(
                    name = "category",
                    required = false
            ) String category,
            Model model
    ) {
        // Category-filtered offers for the normal listing.
        model.addAttribute(
                "offers",
                service.advertised(category)
        );

        // Newest three active offers across all categories.
        model.addAttribute(
                "featuredOffers",
                service.featured()
        );

        model.addAttribute("category", category);

        return "promotion/browse";
    }

    @GetMapping("/{id}")
    public String details(
            @PathVariable("id") Long id,
            Model model
    ) {
        model.addAttribute(
                "offer",
                service.readable(id)
        );

        return "promotion/details";
    }

    // ---------- Vendor dashboard ----------

    @GetMapping("/mine")
    public String mine(Model model) {
        model.addAttribute("offers", service.mine());

        return "promotion/mine";
    }

    // ---------- Create and edit pages ----------

    @GetMapping("/new")
    public String createForm(Model model) {
        access.requireVendor();

        LocalDateTime start = LocalDateTime.ofInstant(
                clock.instant(),
                zone
        ).withSecond(0).withNano(0);

        PromotionForm form = new PromotionForm();

        form.setDiscountType(DiscountType.PERCENTAGE);
        form.setStartsAt(start);
        form.setEndsAt(start.plusDays(30));

        return renderForm(model, form, null);
    }

    @GetMapping("/{id}/edit")
    public String editForm(
            @PathVariable("id") Long id,
            Model model
    ) {
        PromotionForm form = service.form(id);

        return renderForm(model, form, id);
    }

    // ---------- Form submissions ----------

    @PostMapping
    public String create(
            @Valid @ModelAttribute("form") PromotionForm form,
            BindingResult errors,
            @RequestParam(
                    name = "banner",
                    required = false
            ) MultipartFile banner,
            @RequestParam(
                    name = "action",
                    defaultValue = "save"
            ) String action,
            Model model,
            RedirectAttributes flash
    ) {
        return saveForm(
                null,
                form,
                errors,
                banner,
                action,
                model,
                flash
        );
    }

    @PostMapping("/{id}")
    public String update(
            @PathVariable("id") Long id,
            @Valid @ModelAttribute("form") PromotionForm form,
            BindingResult errors,
            @RequestParam(
                    name = "banner",
                    required = false
            ) MultipartFile banner,
            @RequestParam(
                    name = "action",
                    defaultValue = "save"
            ) String action,
            Model model,
            RedirectAttributes flash
    ) {
        return saveForm(
                id,
                form,
                errors,
                banner,
                action,
                model,
                flash
        );
    }

    // ---------- Publication actions ----------

    @PostMapping("/{id}/publish")
    public String publish(
            @PathVariable("id") Long id,
            RedirectAttributes flash
    ) {
        service.publish(id);

        flash.addFlashAttribute(
                "message",
                "Promotion published. It will appear to customers "
                        + "during its campaign dates."
        );

        return "redirect:/promotions/mine";
    }

    @PostMapping("/{id}/deactivate")
    public String deactivate(
            @PathVariable("id") Long id,
            RedirectAttributes flash
    ) {
        service.deactivate(id);

        flash.addFlashAttribute(
                "message",
                "Promotion deactivated. It is no longer displayed "
                        + "to customers."
        );

        return "redirect:/promotions/mine";
    }

    @PostMapping("/{id}/archive")
    public String archive(
            @PathVariable("id") Long id,
            RedirectAttributes flash
    ) {
        service.archive(id);

        flash.addFlashAttribute(
                "message",
                "Promotion archived successfully."
        );

        return "redirect:/promotions/mine";
    }

    // ---------- Analytics ----------

    @GetMapping("/{id}/analytics")
    public String analyticsPage(
            @PathVariable("id") Long id,
            Model model
    ) {
        Promotion promotion = service.owned(id);

        model.addAttribute("offer", promotion);
        model.addAttribute("metrics", analytics.metrics(id));

        return "promotion/analytics";
    }

    // ---------- Banner ----------

    @GetMapping("/{id}/banner")
    @ResponseBody
    public ResponseEntity<byte[]> banner(
            @PathVariable("id") Long id
    ) {
        byte[] image = service.banner(id);

        return ResponseEntity.ok()
                .cacheControl(CacheControl.noStore())
                .contentType(MediaType.IMAGE_PNG)
                .body(image);
    }

    // ---------- Advertisement interactions ----------

    @PostMapping("/{id}/impression")
    @ResponseBody
    public ResponseEntity<Void> impression(
            @PathVariable("id") Long id,
            HttpSession session
    ) {
        service.publicOffer(id);

        analytics.recordVisit(
                id,
                Kind.IMPRESSION,
                sessionKey(session)
        );

        return ResponseEntity.noContent().build();
    }

    @PostMapping("/{id}/click")
    @ResponseBody
    public ResponseEntity<Void> click(
            @PathVariable("id") Long id,
            HttpSession session
    ) {
        service.publicOffer(id);

        analytics.recordVisit(
                id,
                Kind.CLICK,
                sessionKey(session)
        );

        return ResponseEntity.noContent().build();
    }

    // ---------- Form helpers ----------

    private String saveForm(
            Long id,
            PromotionForm form,
            BindingResult errors,
            MultipartFile banner,
            String action,
            Model model,
            RedirectAttributes flash
    ) {
        access.requireVendor();

        if (id != null) {
            service.owned(id);
        }

        if (!"save".equals(action) && !"publish".equals(action)) {
            errors.reject(
                    "invalidAction",
                    "Choose Save or Publish."
            );
        }

        if (errors.hasErrors()) {
            return renderForm(model, form, id);
        }

        boolean publish = "publish".equals(action);

        try {
            byte[] validatedBanner = banners.normalize(banner);

            service.save(
                    id,
                    form,
                    validatedBanner,
                    publish
            );

        } catch (IllegalArgumentException exception) {
            errors.reject(
                    "invalidPromotion",
                    exception.getMessage()
            );

            return renderForm(model, form, id);
        }

        String message;

        if (publish) {
            message = "Promotion saved and published. "
                    + "It will appear during its campaign dates.";
        } else if (id == null) {
            message = "Promotion saved as a draft.";
        } else {
            message = "Promotion changes saved successfully.";
        }

        flash.addFlashAttribute("message", message);

        return "redirect:/promotions/mine";
    }

    private String renderForm(
            Model model,
            PromotionForm form,
            Long id
    ) {
        model.addAttribute("form", form);
        model.addAttribute("id", id);

        return "promotion/form";
    }

    // ---------- Analytics counting key ----------

    private String sessionKey(HttpSession session) {
        LocalDate utcDate = LocalDate.ofInstant(
                clock.instant(),
                ZoneId.of("UTC")
        );

        String source = session.getId() + ":" + utcDate;

        try {
            MessageDigest digest =
                    MessageDigest.getInstance("SHA-256");

            byte[] hashed = digest.digest(
                    source.getBytes(StandardCharsets.UTF_8)
            );

            return HexFormat.of().formatHex(hashed);

        } catch (NoSuchAlgorithmException exception) {
            throw new IllegalStateException(
                    "SHA-256 is unavailable.",
                    exception
            );
        }
    }
}
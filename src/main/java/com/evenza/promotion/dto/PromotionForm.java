package com.evenza.promotion.dto;

import com.evenza.promotion.entity.DiscountType;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Digits;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.PositiveOrZero;
import jakarta.validation.constraints.Size;

import org.springframework.format.annotation.DateTimeFormat;

import java.math.BigDecimal;
import java.time.LocalDateTime;

/**
 * Input data for creating and editing a promotion.
 *
 * Field names match the Thymeleaf form bindings.
 * Ownership is determined by the authenticated account,
 * not by values submitted in this form.
 */
public class PromotionForm {

    // ---------- Offer details ----------

    @NotBlank(message = "Promotion title is required.")
    @Size(
            max = 150,
            message = "Promotion title cannot exceed 150 characters."
    )
    private String title;

    @NotBlank(message = "Description is required.")
    @Size(
            max = 2000,
            message = "Description cannot exceed 2000 characters."
    )
    private String description;

    @NotBlank(message = "Special package name is required.")
    @Size(
            max = 150,
            message = "Package name cannot exceed 150 characters."
    )
    private String packageName;

    @NotBlank(message = "Service category is required.")
    @Size(
            max = 80,
            message = "Service category cannot exceed 80 characters."
    )
    private String serviceCategory;

    // ---------- Price and discount ----------

    @NotNull(message = "Package price is required.")
    @DecimalMin(
            value = "0.01",
            message = "Package price must be at least LKR 0.01."
    )
    @Digits(
            integer = 10,
            fraction = 2,
            message = "Package price must have at most 10 whole-number "
                    + "digits and 2 decimal places."
    )
    private BigDecimal packagePrice;

    @NotNull(message = "Select a discount type.")
    private DiscountType discountType;

    @NotNull(message = "Discount value is required.")
    @DecimalMin(
            value = "0.01",
            message = "Discount value must be at least 0.01."
    )
    @Digits(
            integer = 10,
            fraction = 2,
            message = "Discount value must have at most 10 whole-number "
                    + "digits and 2 decimal places."
    )
    private BigDecimal discountValue;

    // ---------- Campaign dates ----------

    @NotNull(message = "Campaign start time is required.")
    @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME)
    private LocalDateTime startsAt;

    @NotNull(message = "Campaign end time is required.")
    @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME)
    private LocalDateTime endsAt;

    // ---------- Terms ----------

    @NotBlank(message = "Terms and conditions are required.")
    @Size(
            max = 3000,
            message = "Terms and conditions cannot exceed 3000 characters."
    )
    private String terms;

    // ---------- Edit version ----------

    /**
     * Null for a new promotion.
     * Existing promotions submit their version to detect stale edits.
     */
    @PositiveOrZero(message = "Promotion version must not be negative.")
    private Long version;

    // ---------- Constructor ----------

    public PromotionForm() {
    }
    // ---------- Getters and setters ----------

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getPackageName() {
        return packageName;
    }

    public void setPackageName(String packageName) {
        this.packageName = packageName;
    }

    public String getServiceCategory() {
        return serviceCategory;
    }

    public void setServiceCategory(String serviceCategory) {
        this.serviceCategory = serviceCategory;
    }

    public BigDecimal getPackagePrice() {
        return packagePrice;
    }
    public void setPackagePrice(BigDecimal packagePrice) {
        this.packagePrice = packagePrice;
    }

    public DiscountType getDiscountType() {
        return discountType;
    }

    public void setDiscountType(DiscountType discountType) {
        this.discountType = discountType;
    }

    public BigDecimal getDiscountValue() {
        return discountValue;
    }

    public void setDiscountValue(BigDecimal discountValue) {
        this.discountValue = discountValue;
    }

    public LocalDateTime getStartsAt() {
        return startsAt;
    }

    public void setStartsAt(LocalDateTime startsAt) {
        this.startsAt = startsAt;
    }

    public LocalDateTime getEndsAt() {
        return endsAt;
    }

    public void setEndsAt(LocalDateTime endsAt) {
        this.endsAt = endsAt;
    }

    public String getTerms() {
        return terms;
    }
    public void setTerms(String terms) {
        this.terms = terms;
    }

    public Long getVersion() {
        return version;
    }

    public void setVersion(Long version) {
        this.version = version;
    }
}



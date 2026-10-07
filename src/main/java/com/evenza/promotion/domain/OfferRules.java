package com.evenza.promotion.domain;

import com.evenza.promotion.entity.DiscountType;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.Instant;

/**
 * Shared business rules for special package promotions.
 */
public final class OfferRules {

    private static final BigDecimal ONE_HUNDRED =
            new BigDecimal("100");

    private OfferRules() {
        // Utility class: no object needs to be created.
    }
    public static void validate(
            BigDecimal price,
            DiscountType type,
            BigDecimal discount,
            Instant start,
            Instant end
    ) {
        validatePricing(price, type, discount);

        if (start == null || end == null) {
            throw new IllegalArgumentException(
                    "Campaign start and end times are required."
            );
        }
        if (!end.isAfter(start)) {
            throw new IllegalArgumentException(
                    "End time must be after start time."
            );
        }
    }
    public static BigDecimal finalPrice(
            BigDecimal price,
            DiscountType type,
            BigDecimal discount
    ) {
        validatePricing(price, type, discount);

        BigDecimal reduction;

        if (type == DiscountType.PERCENTAGE) {
            reduction = price
                    .multiply(discount)
                    .divide(ONE_HUNDRED);
        } else {
            reduction = discount;
        }

        return price
                .subtract(reduction)
                .setScale(2, RoundingMode.HALF_UP);
    }
    /**
     * Determines whether an offer can be displayed to customers.
     *
     * The start time is included.
     * The end time is excluded.
     */
    public static boolean visible(
            boolean published,
            boolean archived,
            Instant start,
            Instant end,
            Instant now
    ) {
        if (!published || archived) {
            return false;
        }

        if (start == null || end == null || now == null) {
            return false;
        }

        if (!end.isAfter(start)) {
            return false;
        }

        return !now.isBefore(start) && now.isBefore(end);
    }
    /**
     * Validates values used in discount calculations.
     */
    private static void validatePricing(
            BigDecimal price,
            DiscountType type,
            BigDecimal discount
    ) {
        if (price == null || price.signum() <= 0) {
            throw new IllegalArgumentException(
                    "Package price must be greater than zero."
            );
        }

        if (type == null) {
            throw new IllegalArgumentException(
                    "Select a discount type."
            );
        }

        if (discount == null || discount.signum() <= 0) {
            throw new IllegalArgumentException(
                    "Discount must be greater than zero."
            );
        }

        if (price.scale() > 2 || discount.scale() > 2) {
            throw new IllegalArgumentException(
                    "Use at most two decimal places for price and discount."
            );
        }
        if (
                type == DiscountType.PERCENTAGE
                        && discount.compareTo(ONE_HUNDRED) > 0
        ) {
            throw new IllegalArgumentException(
                    "Percentage discount cannot exceed 100%."
            );
        }

        if (
                type == DiscountType.FIXED_AMOUNT
                        && discount.compareTo(price) > 0
        ) {
            throw new IllegalArgumentException(
                    "Discount cannot exceed the package price."
            );
        }
    }
}

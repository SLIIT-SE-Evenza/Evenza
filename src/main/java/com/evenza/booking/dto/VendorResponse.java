package com.evenza.booking.dto;

import com.evenza.booking.model.Vendor;

import java.math.BigDecimal;

public record VendorResponse(
        Long id,
        String name,
        String category,
        BigDecimal price,
        boolean available,
        String description
) {

    public static VendorResponse from(Vendor vendor) {

        return new VendorResponse(
                vendor.getId(),
                vendor.getName(),
                vendor.getCategory(),
                vendor.getPrice(),
                vendor.isAvailable(),
                vendor.getDescription()
        );
    }
}
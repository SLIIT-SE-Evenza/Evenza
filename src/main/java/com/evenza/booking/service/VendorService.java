package com.evenza.booking.service;

import com.evenza.booking.dto.VendorResponse;
import com.evenza.booking.repository.VendorRepository;

import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.List;

@Service
public class VendorService {

    private final VendorRepository vendorRepository;

    public VendorService(
            VendorRepository vendorRepository) {

        this.vendorRepository = vendorRepository;
    }

    public List<VendorResponse> search(
            String category,
            BigDecimal maxPrice) {

        if (category != null && maxPrice != null) {

            return vendorRepository
                    .findByCategoryIgnoreCaseAndPriceLessThanEqualAndAvailableTrue(
                            category,
                            maxPrice
                    )
                    .stream()
                    .map(VendorResponse::from)
                    .toList();
        }

        if (category != null) {

            return vendorRepository
                    .findByCategoryIgnoreCaseAndAvailableTrue(
                            category
                    )
                    .stream()
                    .map(VendorResponse::from)
                    .toList();
        }

        if (maxPrice != null) {

            return vendorRepository
                    .findByPriceLessThanEqualAndAvailableTrue(
                            maxPrice
                    )
                    .stream()
                    .map(VendorResponse::from)
                    .toList();
        }

        return vendorRepository
                .findByAvailableTrue()
                .stream()
                .map(VendorResponse::from)
                .toList();
    }
}
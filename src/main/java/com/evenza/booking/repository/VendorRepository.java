package com.evenza.booking.repository;

import com.evenza.booking.model.Vendor;
import org.springframework.data.jpa.repository.JpaRepository;

import java.math.BigDecimal;
import java.util.List;

public interface VendorRepository
        extends JpaRepository<Vendor, Long> {

    List<Vendor> findByAvailableTrue();

    List<Vendor> findByCategoryIgnoreCaseAndAvailableTrue(
            String category
    );

    List<Vendor> findByPriceLessThanEqualAndAvailableTrue(
            BigDecimal maxPrice
    );

    List<Vendor>
    findByCategoryIgnoreCaseAndPriceLessThanEqualAndAvailableTrue(
            String category,
            BigDecimal maxPrice
    );
    // Prevents two vendors from using the same name.
    boolean existsByNameIgnoreCase(String name);

    // Used while editing so the current vendor does not match itself.
    boolean existsByNameIgnoreCaseAndIdNot(
            String name,
            Long id
    );
}
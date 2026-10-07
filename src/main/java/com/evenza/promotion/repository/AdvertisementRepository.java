package com.evenza.promotion.repository;

import com.evenza.promotion.entity.Advertisement;

import org.springframework.data.jpa.repository.JpaRepository;

/**
 * Database access for promotion advertisement banners.
 *
 * The advertisement's primary key is its associated promotion ID.
 */
public interface AdvertisementRepository
        extends JpaRepository<Advertisement, Long> {
}

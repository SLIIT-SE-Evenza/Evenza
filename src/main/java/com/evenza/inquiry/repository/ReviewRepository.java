package com.evenza.inquiry.repository;

import com.evenza.inquiry.model.Review;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ReviewRepository extends JpaRepository<Review, Long> {

    List<Review> findByEventId(Long eventId);

    List<Review> findByCustomerId(Long customerId);
}
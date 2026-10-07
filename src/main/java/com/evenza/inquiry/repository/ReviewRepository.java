package com.evenza.inquiry.repository;

import com.evenza.inquiry.model.Review;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ReviewRepository extends JpaRepository<Review, Long> {

    List<Review> findByEventId(Long eventId);

    List<Review> findByCustomerIdOrderByCreatedAtDesc(Long customerId);

    boolean existsByEventIdAndCustomerId(Long eventId, Long customerId);

    boolean existsByEventIdAndCustomerIdAndReviewIdNot(
            Long eventId,
            Long customerId,
            Long reviewId
    );
}

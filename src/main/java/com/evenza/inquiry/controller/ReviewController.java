package com.evenza.inquiry.controller;

import com.evenza.inquiry.dto.ReviewRequest;
import com.evenza.inquiry.model.Review;
import com.evenza.inquiry.service.ReviewService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/reviews")
public class ReviewController {

    private final ReviewService reviewService;

    public ReviewController(ReviewService reviewService) {
        this.reviewService = reviewService;
    }

    @PostMapping
    public ResponseEntity<Review> submitReview(@Valid @RequestBody ReviewRequest request) {
        return ResponseEntity.ok(reviewService.submitReview(request));
    }

    @GetMapping
    public ResponseEntity<List<Review>> getAllReviews() {
        return ResponseEntity.ok(reviewService.getAllReviews());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Review> getReview(@PathVariable Long id) {
        return ResponseEntity.ok(reviewService.getReview(id));
    }

    @GetMapping("/event/{eventId}")
    public ResponseEntity<List<Review>> getReviewsByEvent(@PathVariable Long eventId) {
        return ResponseEntity.ok(reviewService.getReviewsByEvent(eventId));
    }

    @GetMapping("/customer/{customerId}")
    public ResponseEntity<List<Review>> getReviewsByCustomer(@PathVariable Long customerId) {
        return ResponseEntity.ok(reviewService.getReviewsByCustomer(customerId));
    }

    @PutMapping("/{id}/response")
    public ResponseEntity<Review> respondToReview(
            @PathVariable Long id,
            @RequestBody Map<String, String> body) {

        return ResponseEntity.ok(
                reviewService.respondToReview(id, body.get("response"))
        );
    }

    @PutMapping("/{id}")
    public ResponseEntity<Review> update(@PathVariable Long id,
                                         @Valid @RequestBody ReviewRequest request) {
        return ResponseEntity.ok(reviewService.updateReview(id, request));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        reviewService.deleteReview(id);
        return ResponseEntity.noContent().build();
    }
}

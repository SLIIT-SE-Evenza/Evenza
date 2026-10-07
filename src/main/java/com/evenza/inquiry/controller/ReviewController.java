package com.evenza.inquiry.controller;

import com.evenza.common.auth.AuthService;
import com.evenza.common.user.User;
import com.evenza.inquiry.dto.ReviewRequest;
import com.evenza.inquiry.model.Review;
import com.evenza.inquiry.service.ReviewService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/reviews")
@PreAuthorize("isAuthenticated()")
public class ReviewController {

    private final ReviewService reviewService;
    private final AuthService authService;

    public ReviewController(ReviewService reviewService, AuthService authService) {
        this.reviewService = reviewService;
        this.authService = authService;
    }

    @PostMapping
    @PreAuthorize("hasRole('CUSTOMER')")
    public ResponseEntity<Review> submitReview(
            @Valid @RequestBody ReviewRequest request,
            Authentication authentication) {

        return ResponseEntity.status(HttpStatus.CREATED)
                .body(reviewService.submitReview(request, currentUser(authentication)));
    }

    @GetMapping
    @PreAuthorize("hasAnyRole('CUSTOMER', 'EVENT_MANAGER', 'ADMIN')")
    public List<Review> getReviews(Authentication authentication) {
        return reviewService.getVisibleReviews(currentUser(authentication));
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('CUSTOMER', 'EVENT_MANAGER', 'ADMIN')")
    public Review getReview(@PathVariable Long id, Authentication authentication) {
        return reviewService.getVisibleReview(id, currentUser(authentication));
    }

    @GetMapping("/event/{eventId}")
    @PreAuthorize("hasAnyRole('CUSTOMER', 'EVENT_MANAGER', 'ADMIN')")
    public List<Review> getReviewsByEvent(
            @PathVariable Long eventId,
            Authentication authentication) {

        return reviewService.getReviewsByEvent(eventId, currentUser(authentication));
    }

    @GetMapping("/customer/{customerId}")
    @PreAuthorize("hasAnyRole('CUSTOMER', 'EVENT_MANAGER', 'ADMIN')")
    public List<Review> getReviewsByCustomer(
            @PathVariable Long customerId,
            Authentication authentication) {

        return reviewService.getReviewsByCustomer(customerId, currentUser(authentication));
    }

    @PutMapping("/{id}/response")
    @PreAuthorize("hasAnyRole('EVENT_MANAGER', 'ADMIN')")
    public Review respondToReview(
            @PathVariable Long id,
            @RequestBody Map<String, String> body) {

        return reviewService.respondToReview(id, body.get("response"));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('CUSTOMER')")
    public Review update(
            @PathVariable Long id,
            @Valid @RequestBody ReviewRequest request,
            Authentication authentication) {

        return reviewService.updateReview(id, request, currentUser(authentication));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAnyRole('CUSTOMER', 'ADMIN')")
    public ResponseEntity<Void> delete(
            @PathVariable Long id,
            Authentication authentication) {

        reviewService.deleteReview(id, currentUser(authentication));
        return ResponseEntity.noContent().build();
    }

    private User currentUser(Authentication authentication) {
        return authService.findByEmailOrThrow(authentication.getName());
    }
}

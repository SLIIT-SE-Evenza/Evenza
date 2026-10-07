package com.evenza.inquiry.service;

import com.evenza.common.user.User;
import com.evenza.common.user.UserRole;
import com.evenza.inquiry.dto.ReviewRequest;
import com.evenza.inquiry.model.Review;
import com.evenza.inquiry.repository.ReviewRepository;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class ReviewService {

    private final ReviewRepository reviewRepository;

    public ReviewService(ReviewRepository reviewRepository) {
        this.reviewRepository = reviewRepository;
    }

    @Transactional
    public Review submitReview(ReviewRequest request, User currentUser) {
        if (reviewRepository.existsByEventIdAndCustomerId(
                request.getEventId(), currentUser.getId())) {
            throw new IllegalArgumentException("You have already reviewed this event");
        }

        Review review = new Review();
        review.setCustomerId(currentUser.getId());
        copyEditableFields(review, request);
        return reviewRepository.save(review);
    }

    @Transactional(readOnly = true)
    public List<Review> getVisibleReviews(User currentUser) {
        if (isManagement(currentUser)) {
            return reviewRepository.findAll();
        }
        return reviewRepository.findByCustomerIdOrderByCreatedAtDesc(currentUser.getId());
    }

    @Transactional(readOnly = true)
    public Review getVisibleReview(Long id, User currentUser) {
        Review review = getReviewOrThrow(id);
        verifyOwnerOrManagement(review, currentUser);
        return review;
    }

    @Transactional(readOnly = true)
    public List<Review> getReviewsByEvent(Long eventId, User currentUser) {
        List<Review> reviews = reviewRepository.findByEventId(eventId);
        if (isManagement(currentUser)) {
            return reviews;
        }
        return reviews.stream()
                .filter(review -> review.getCustomerId().equals(currentUser.getId()))
                .toList();
    }

    @Transactional(readOnly = true)
    public List<Review> getReviewsByCustomer(Long customerId, User currentUser) {
        if (!isManagement(currentUser) && !currentUser.getId().equals(customerId)) {
            throw new AccessDeniedException("You can only view your own reviews");
        }
        return reviewRepository.findByCustomerIdOrderByCreatedAtDesc(customerId);
    }

    @Transactional
    public Review respondToReview(Long id, String response) {
        Review review = getReviewOrThrow(id);
        if (response == null || response.isBlank()) {
            throw new IllegalArgumentException("Response cannot be empty");
        }
        if (response.trim().length() > 2000) {
            throw new IllegalArgumentException("Response cannot exceed 2000 characters");
        }
        review.setResponse(response.trim());
        return reviewRepository.save(review);
    }

    @Transactional
    public Review updateReview(Long id, ReviewRequest request, User currentUser) {
        Review review = getReviewOrThrow(id);
        verifyOwner(review, currentUser);

        if (reviewRepository.existsByEventIdAndCustomerIdAndReviewIdNot(
                request.getEventId(), currentUser.getId(), id)) {
            throw new IllegalArgumentException("You have already reviewed this event");
        }

        copyEditableFields(review, request);
        return reviewRepository.save(review);
    }

    @Transactional
    public void deleteReview(Long id, User currentUser) {
        Review review = getReviewOrThrow(id);
        if (currentUser.getRole() != UserRole.ADMIN) {
            verifyOwner(review, currentUser);
        }
        reviewRepository.delete(review);
    }

    private Review getReviewOrThrow(Long id) {
        return reviewRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Review not found: " + id));
    }

    private void copyEditableFields(Review review, ReviewRequest request) {
        review.setEventId(request.getEventId());
        review.setRating(request.getRating());
        review.setComment(request.getComment().trim());
        review.setPhotoPath(cleanOptional(request.getPhotoPath()));
        review.setAnonymous(request.isAnonymous());
    }

    private String cleanOptional(String value) {
        return value == null || value.isBlank() ? null : value.trim();
    }

    private void verifyOwner(Review review, User currentUser) {
        if (!review.getCustomerId().equals(currentUser.getId())) {
            throw new AccessDeniedException("This review belongs to another customer");
        }
    }

    private void verifyOwnerOrManagement(Review review, User currentUser) {
        if (!isManagement(currentUser)) {
            verifyOwner(review, currentUser);
        }
    }

    private boolean isManagement(User user) {
        return user.getRole() == UserRole.EVENT_MANAGER
                || user.getRole() == UserRole.ADMIN;
    }
}

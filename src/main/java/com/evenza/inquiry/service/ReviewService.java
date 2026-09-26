package com.evenza.inquiry.service;

import com.evenza.inquiry.dto.ReviewRequest;
import com.evenza.inquiry.model.Review;
import com.evenza.inquiry.repository.ReviewRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ReviewService {

    private final ReviewRepository reviewRepository;

    public ReviewService(ReviewRepository reviewRepository) {
        this.reviewRepository = reviewRepository;
    }

    public Review submitReview(ReviewRequest request) {
        Review review = new Review();
        review.setEventId(request.getEventId());
        review.setCustomerId(request.getCustomerId());
        review.setRating(request.getRating());
        review.setComment(request.getComment());
        review.setPhotoPath(request.getPhotoPath());
        review.setAnonymous(request.isAnonymous());

        return reviewRepository.save(review);
    }

    public Review getReview(Long id) {
        return reviewRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Review not found"));
    }

    public List<Review> getAllReviews() {
        return reviewRepository.findAll();
    }

    public List<Review> getReviewsByEvent(Long eventId) {
        return reviewRepository.findByEventId(eventId);
    }

    public List<Review> getReviewsByCustomer(Long customerId) {
        return reviewRepository.findByCustomerId(customerId);
    }

    public Review respondToReview(Long id, String response) {
        Review review = getReview(id);

        if (response == null || response.trim().isEmpty()) {
            throw new IllegalArgumentException("Response cannot be empty");
        }

        review.setResponse(response);
        return reviewRepository.save(review);
    }

    public Review updateReview(Long id, ReviewRequest request) {
        Review review = getReview(id);
        review.setEventId(request.getEventId());
        review.setCustomerId(request.getCustomerId());
        review.setRating(request.getRating());
        review.setComment(request.getComment());
        review.setPhotoPath(request.getPhotoPath());
        review.setAnonymous(request.isAnonymous());
        return reviewRepository.save(review);
    }

    public void deleteReview(Long id) {
        reviewRepository.delete(getReview(id));
    }
}

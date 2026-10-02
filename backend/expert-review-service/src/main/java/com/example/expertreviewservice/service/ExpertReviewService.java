package com.example.expertreviewservice.service;

import com.example.expertreviewservice.entity.ExpertReview;
import com.example.expertreviewservice.repository.ExpertReviewRepository;

import java.util.List;

public interface ExpertReviewService {

    ExpertReview createReview(ExpertReview e1);
    ExpertReview getReviewById(String reviewId);
    List<ExpertReview> getAllReviews();
    List<ExpertReview>getReviewByStatus(String status);
    ExpertReview updateReviewStatus(String reviwId, String status, String description);
}

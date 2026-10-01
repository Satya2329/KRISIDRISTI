package com.example.expertreviewservice.serviceimpl;

import com.example.expertreviewservice.entity.ExpertReview;
import com.example.expertreviewservice.exception.ResourceNotFoundException;
import com.example.expertreviewservice.repository.ExpertReviewRepository;
import com.example.expertreviewservice.service.ExpertReviewService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;


@Service
public class ExpertReviewServiceImpl implements ExpertReviewService {

    @Autowired
    private ExpertReviewRepository expertReviewRepository;

    public ExpertReview createReview(ExpertReview e1) {
        return expertReviewRepository.save(e1);
    }

    @Override
    public ExpertReview getReviewById(String reviewId) {
        return expertReviewRepository.findById(reviewId).orElseThrow(()->new ResourceNotFoundException("Review not found"));

    }

    @Override
    public List<ExpertReview> getAllReviews() {
        return expertReviewRepository.findAll();
    }

    @Override
    public List<ExpertReview> getReviewByStatus(String status) {
        return expertReviewRepository.findByStatus(status);
    }

    @Override
    public ExpertReview updateReviewStatus(String reviwId, String status, String description) {
        ExpertReview review=getReviewById(reviwId);
        review.setStatus(status);
        if(description!=null){
            review.setDescription(description);
        }
        return expertReviewRepository.save(review);
    }
}

package com.example.expertreviewservice.repository;

import com.example.expertreviewservice.entity.ExpertReview;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ExpertReviewRepository extends JpaRepository<ExpertReview, String> {
//    List<ExpertReview> findByExpertId(String expertId);
//    List<ExpertReview> findbyStatus(String status);
//    List<ExpertReview> findByDiagnosisId(String diagnosisId);
List<ExpertReview> findByStatus(String status);

}

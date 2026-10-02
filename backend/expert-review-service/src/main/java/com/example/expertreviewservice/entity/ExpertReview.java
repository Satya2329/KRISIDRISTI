package com.example.expertreviewservice.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import lombok.*;

@Entity
@Getter
@Setter
@ToString
@AllArgsConstructor
@NoArgsConstructor

public class ExpertReview {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String reviewId;
    private String diagnosisId;
    private String expertId;
    private String description;
    private String status;
}

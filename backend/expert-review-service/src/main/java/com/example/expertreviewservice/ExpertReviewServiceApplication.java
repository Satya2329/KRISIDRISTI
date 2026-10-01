package com.example.expertreviewservice;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.netflix.eureka.server.EnableEurekaServer;

@SpringBootApplication
@EnableEurekaServer
public class ExpertReviewServiceApplication {

    public static void main(String[] args) {
        SpringApplication.run(ExpertReviewServiceApplication.class, args);
    }

}

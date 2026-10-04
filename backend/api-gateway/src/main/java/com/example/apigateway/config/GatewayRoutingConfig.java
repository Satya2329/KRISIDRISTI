package com.example.apigateway.config;

import org.springframework.cloud.gateway.route.RouteLocator;
import org.springframework.cloud.gateway.route.builder.RouteLocatorBuilder;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class GatewayRoutingConfig {

    @Bean
    public RouteLocator routes(RouteLocatorBuilder builder) {

        return builder.routes()

                .route("auth-user-service", r -> r
                        .path("/api/auth/**", "/api/users/**")
                        .uri("http://localhost:8081"))

                .route("media-service", r -> r
                        .path("/api/media/**")
                        .uri("http://localhost:8082"))

                .route("diagnosis-service", r -> r
                        .path("/api/diagnoses/**")
                        .uri("http://localhost:8083"))

                .route("advisory-translation-service", r -> r
                        .path("/api/advisory/**", "/api/translation/**")
                        .uri("http://localhost:8084"))

                .route("whatsapp-voice-service", r -> r
                        .path("/api/whatsapp/**", "/api/voice/**")
                        .uri("http://localhost:8085"))

                .route("expert-review-service", r -> r
                        .path("/api/expert/**")
                        .uri("http://localhost:8086"))

                .build();
    }
}
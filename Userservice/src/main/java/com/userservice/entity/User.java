package com.userservice.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import lombok.*;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@ToString
@Entity
public class User {

    @Id
    String id;

    // FarmerProfile details
    @Column(nullable = false)
    String farmerName;

    String phone;
    String address;
    String farmLocation;

    // LanguagePreference details
    String preferredLanguage;

    // Consent details
    boolean outreachConsent;
    boolean recordingConsent;
    boolean locationConsent;
    boolean retentionConsent;

    // ContactPreference details
    String preferredContactMethod;
}

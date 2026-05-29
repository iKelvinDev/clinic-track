package com.clinictrack.repository;

import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;

import com.clinictrack.entity.Patient;

public interface PatientRepository extends JpaRepository<Patient, UUID> {
    boolean existsByEmail(String email);
}

package com.clinictrack.repository;

import java.util.UUID;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import com.clinictrack.entity.ClinicalEvolution;

public interface ClinicalEvolutionRepository extends JpaRepository<ClinicalEvolution, UUID> {
    Page<ClinicalEvolution> findByPatientIdOrderByCreatedAtDesc(UUID patientId, Pageable pageable);
}

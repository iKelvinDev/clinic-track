package com.clinictrack.service;

import java.util.UUID;

import org.springframework.context.ApplicationEventPublisher;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.clinictrack.dto.request.ClinicalEvolutionRequest;
import com.clinictrack.dto.response.ClinicalEvolutionResponse;
import com.clinictrack.dto.response.PaginatedResponse;
import com.clinictrack.dto.response.PaginationResponse;
import com.clinictrack.entity.ClinicalEvolution;
import com.clinictrack.entity.Patient;
import com.clinictrack.event.NewClinicalEvolutionEvent;
import com.clinictrack.repository.ClinicalEvolutionRepository;
import com.clinictrack.repository.PatientRepository;

import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class ClinicalEvolutionService {
    
    private final ClinicalEvolutionRepository evolutionRepository;
    private final PatientRepository patientRepository;
    private final ApplicationEventPublisher eventPublisher;

    public PaginatedResponse<ClinicalEvolutionResponse> findByPatientId(UUID patientId, int page, int size) {
        Page<ClinicalEvolution> evolutionPage = evolutionRepository
                .findByPatientIdOrderByCreatedAtDesc(patientId, PageRequest.of(page, size));
        return toPaginatedResponse(evolutionPage);
    }

    @Transactional
    public ClinicalEvolutionResponse create(UUID patientId, ClinicalEvolutionRequest request) {
        Patient patient = patientRepository.findById(patientId)
                .orElseThrow(() -> new EntityNotFoundException("Paciente não encontrado com ID: " + patientId));

        ClinicalEvolution evolution = ClinicalEvolution.builder()
                .patient(patient)
                .description(request.getDescription())
                .doctorName(request.getDoctorName())
                .build();

        evolution = evolutionRepository.save(evolution);

        eventPublisher.publishEvent(new NewClinicalEvolutionEvent(evolution));

        return toResponse(evolution);
    }

    private ClinicalEvolutionResponse toResponse(ClinicalEvolution evolution) {
        return ClinicalEvolutionResponse.builder()
                .id(evolution.getId())
                .description(evolution.getDescription())
                .doctorName(evolution.getDoctorName())
                .geminiSummary(evolution.getGeminiSummary())
                .createdAt(evolution.getCreatedAt())
                .build();
    }

    private PaginatedResponse<ClinicalEvolutionResponse> toPaginatedResponse(Page<ClinicalEvolution> page) {
        PaginationResponse pagination = PaginationResponse.builder()
                .page(page.getNumber())
                .size(page.getSize())
                .totalElements(page.getTotalElements())
                .totalPages(page.getTotalPages())
                .build();

        return PaginatedResponse.<ClinicalEvolutionResponse>builder()
                .content(page.getContent().stream().map(this::toResponse).toList())
                .pagination(pagination)
                .build();
    }

}

package com.clinictrack.service;

import java.util.UUID;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.clinictrack.dto.request.PatientRequest;
import com.clinictrack.dto.response.PaginatedResponse;
import com.clinictrack.dto.response.PaginationResponse;
import com.clinictrack.dto.response.PatientResponse;
import com.clinictrack.entity.Patient;
import com.clinictrack.repository.PatientRepository;

import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class PatientService {
    
    private final PatientRepository patientRepository;

    public PaginatedResponse<PatientResponse> findAll(int page, int size) {
        Page<Patient> patientPage = patientRepository.findAll(PageRequest.of(page, size));
        return toPaginatedResponse(patientPage);
    }

    public PatientResponse findById(UUID id) {
        Patient patient = patientRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Paciente não encontrado com ID: " + id));
        return toResponse(patient);
    }

    @Transactional
    public PatientResponse create(PatientRequest request) {
        Patient patient = Patient.builder()
                .name(request.getName())
                .email(request.getEmail())
                .phone(request.getPhone())
                .birthDate(request.getBirthDate())
                .build();
        patient = patientRepository.save(patient);
        return toResponse(patient);
    }

    @Transactional
    public PatientResponse update(UUID id, PatientRequest request) {
        Patient patient = patientRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Paciente não encontrado com ID: " + id));
        patient.setName(request.getName());
        patient.setEmail(request.getEmail());
        patient.setPhone(request.getPhone());
        patient.setBirthDate(request.getBirthDate());
        patient = patientRepository.save(patient);
        return toResponse(patient);
    }

    @Transactional
    public void delete(UUID id) {
        if (!patientRepository.existsById(id)) {
            throw new EntityNotFoundException("Paciente não encontrado com ID: " + id);
        }
        patientRepository.deleteById(id);
    }

    private PatientResponse toResponse(Patient patient) {
        return PatientResponse.builder()
                .id(patient.getId())
                .name(patient.getName())
                .email(patient.getEmail())
                .phone(patient.getPhone())
                .birthDate(patient.getBirthDate())
                .createdAt(patient.getCreatedAt())
                .updatedAt(patient.getUpdatedAt())
                .build();
    }

    private PaginatedResponse<PatientResponse> toPaginatedResponse(Page<Patient> page) {
        PaginationResponse pagination = PaginationResponse.builder()
                .page(page.getNumber())
                .size(page.getSize())
                .totalElements(page.getTotalElements())
                .totalPages(page.getTotalPages())
                .build();

        return PaginatedResponse.<PatientResponse>builder()
                .content(page.getContent().stream().map(this::toResponse).toList())
                .pagination(pagination)
                .build();
    }
}

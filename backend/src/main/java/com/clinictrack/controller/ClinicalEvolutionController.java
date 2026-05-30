package com.clinictrack.controller;

import java.util.UUID;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.clinictrack.dto.request.ClinicalEvolutionRequest;
import com.clinictrack.dto.response.ClinicalEvolutionResponse;
import com.clinictrack.dto.response.PaginatedResponse;
import com.clinictrack.service.ClinicalEvolutionService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/patients/{patientId}/evolutions")
@RequiredArgsConstructor
public class ClinicalEvolutionController {

    private final ClinicalEvolutionService evolutionService;

    @GetMapping
    public ResponseEntity<PaginatedResponse<ClinicalEvolutionResponse>> findByPatientId(
            @PathVariable UUID patientId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        return ResponseEntity.ok(evolutionService.findByPatientId(patientId, page, size));
    }

    @PostMapping
    public ResponseEntity<ClinicalEvolutionResponse> create(
            @PathVariable UUID patientId,
            @Valid @RequestBody ClinicalEvolutionRequest request) {
        ClinicalEvolutionResponse response = evolutionService.create(patientId, request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }
}

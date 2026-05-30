package com.clinictrack.event;

import com.clinictrack.entity.ClinicalEvolution;
import com.clinictrack.repository.ClinicalEvolutionRepository;
import com.clinictrack.service.GeminiService;
import com.clinictrack.service.NotificationService;
import lombok.RequiredArgsConstructor;
import org.springframework.context.event.EventListener;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

@Component
@RequiredArgsConstructor
public class ClinicalEvolutionEventListener {

    private final GeminiService geminiService;
    private final ClinicalEvolutionRepository evolutionRepository;
    private final NotificationService notificationService;

    @Async
    @EventListener
    @Transactional
    public void handleNewEvolution(NewClinicalEvolutionEvent event) {
        ClinicalEvolution evolution = event.getEvolution();

        String summary = geminiService.summarize(evolution.getDescription());
        if (summary != null) {
            evolution.setGeminiSummary(summary);
            evolutionRepository.save(evolution);
        }

        String message = "New clinical evolution registered for patient: "
                + evolution.getPatient().getName();
        notificationService.create(evolution.getPatient(), message);
    }
}

package com.clinictrack.event;

import com.clinictrack.entity.ClinicalEvolution;
import lombok.Getter;
import org.springframework.context.ApplicationEvent;

@Getter
public class NewClinicalEvolutionEvent extends ApplicationEvent {

    private final ClinicalEvolution evolution;

    public NewClinicalEvolutionEvent(ClinicalEvolution evolution) {
        super(evolution);
        this.evolution = evolution;
    }
}

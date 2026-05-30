package com.clinictrack.dto.request;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class ClinicalEvolutionRequest {

    @NotBlank(message = "Descrição é obrigatória")
    private String description;

    private String doctorName;
}

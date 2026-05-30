package com.clinictrack.dto.response;

import lombok.*;
import java.time.LocalDateTime;
import java.util.UUID;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ClinicalEvolutionResponse {

    private UUID id;
    private String description;
    private String doctorName;
    private String geminiSummary;
    private LocalDateTime createdAt;
}

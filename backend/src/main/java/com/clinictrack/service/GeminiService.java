package com.clinictrack.service;

import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClient;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;

@Service
public class GeminiService {

    private final RestClient restClient;
    private final ObjectMapper objectMapper;

    public GeminiService(@Value("${gemini.api-key}") String apiKey,
                         @Value("${gemini.url}") String url,
                         ObjectMapper objectMapper) {
        this.restClient = RestClient.builder()
                .baseUrl(url + "?key=" + apiKey)
                .build();
        this.objectMapper = objectMapper;
    }

    public String summarize(String text) {
        Map<String, Object> request = Map.of(
            "contents", new Object[]{
                Map.of("parts", new Object[]{
                    Map.of("text", "Summarize in up to 2 sentences in Portuguese: " + text)
                })
            }
        );

        try {
            Map<String, Object> response = restClient.post()
                    .body(request)
                    .retrieve()
                    .body(new ParameterizedTypeReference<Map<String, Object>>() {});

            if (response == null) return null;

            var candidates = objectMapper.convertValue(
                response.get("candidates"),
                new TypeReference<List<Map<String, Object>>>() {}
            );

            if (candidates != null && !candidates.isEmpty()) {
                Map<String, Object> content = objectMapper.convertValue(
                    candidates.get(0).get("content"),
                    new TypeReference<Map<String, Object>>() {}
                );

                if (content != null) {
                    var parts = objectMapper.convertValue(
                        content.get("parts"),
                        new TypeReference<List<Map<String, Object>>>() {}
                    );

                    if (parts != null && !parts.isEmpty()) {
                        return (String) parts.get(0).get("text");
                    }
                }
            }
        } catch (Exception e) {
            return null;
        }
        return null;
    }
}

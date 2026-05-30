package com.clinictrack.service;

import java.util.Map;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClient;

@Service
public class GeminiService {

    private final RestClient restClient;

    public GeminiService(@Value("${gemini.api-key}") String apiKey,
                         @Value("${gemini.url}") String url) {
        this.restClient = RestClient.builder()
                .baseUrl(url + "?key=" + apiKey)
                .build();
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
            Map response = restClient.post()
                    .body(request)
                    .retrieve()
                    .body(Map.class);

            var candidates = (java.util.List<Map>) response.get("candidates");
            if (candidates != null && !candidates.isEmpty()) {
                var content = (Map) candidates.get(0).get("content");
                var parts = (java.util.List<Map>) content.get("parts");
                if (parts != null && !parts.isEmpty()) {
                    return (String) parts.get(0).get("text");
                }
            }
        } catch (Exception e) {
            return null;
        }
        return null;
    }
}

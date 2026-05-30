package com.clinictrack.service;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.clinictrack.dto.response.NotificationResponse;
import com.clinictrack.dto.response.PaginatedResponse;
import com.clinictrack.dto.response.PaginationResponse;
import com.clinictrack.entity.Notification;
import com.clinictrack.entity.Patient;
import com.clinictrack.repository.NotificationRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class NotificationService {

    private final NotificationRepository notificationRepository;

    public PaginatedResponse<NotificationResponse> findAll(int page, int size) {
        Page<Notification> notificationPage = notificationRepository
                .findAllByOrderByCreatedAtDesc(PageRequest.of(page, size));
        return toPaginatedResponse(notificationPage);
    }

    @Transactional
    public void create(Patient patient, String message) {
        Notification notification = Notification.builder()
                .patient(patient)
                .message(message)
                .build();
        notificationRepository.save(notification);
    }

    private NotificationResponse toResponse(Notification notification) {
        return NotificationResponse.builder()
                .id(notification.getId())
                .patientId(notification.getPatient().getId())
                .message(notification.getMessage())
                .createdAt(notification.getCreatedAt())
                .build();
    }

    private PaginatedResponse<NotificationResponse> toPaginatedResponse(Page<Notification> page) {
        PaginationResponse pagination = PaginationResponse.builder()
                .page(page.getNumber())
                .size(page.getSize())
                .totalElements(page.getTotalElements())
                .totalPages(page.getTotalPages())
                .build();

        return PaginatedResponse.<NotificationResponse>builder()
                .content(page.getContent().stream().map(this::toResponse).toList())
                .pagination(pagination)
                .build();
    }
}

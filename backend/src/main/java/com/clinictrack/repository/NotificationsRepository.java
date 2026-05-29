package com.clinictrack.repository;

import java.util.UUID;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import com.clinictrack.entity.Notification;

public interface NotificationsRepository extends JpaRepository<Notification, UUID> {
    Page<Notification> findAllByOrderByCreatedAtDesc(Pageable pageable);
}

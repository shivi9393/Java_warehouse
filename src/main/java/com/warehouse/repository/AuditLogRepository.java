package com.warehouse.repository;

import com.warehouse.document.AuditLog;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

/**
 * MongoDB repository for AuditLog operations.
 */
@Repository
public interface AuditLogRepository extends MongoRepository<AuditLog, String> {

    List<AuditLog> findByOrganizationId(Long organizationId);

    List<AuditLog> findByUserId(Long userId);

    List<AuditLog> findByEntityTypeAndEntityId(String entityType, Long entityId);

    List<AuditLog> findByTimestampBetween(LocalDateTime start, LocalDateTime end);

    List<AuditLog> findByOrganizationIdAndTimestampBetween(
            Long organizationId, LocalDateTime start, LocalDateTime end);

    List<AuditLog> findByActionAndOrganizationId(String action, Long organizationId);
}

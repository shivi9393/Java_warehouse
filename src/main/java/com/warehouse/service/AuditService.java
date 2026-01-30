package com.warehouse.service;

import com.warehouse.document.AuditLog;
import com.warehouse.repository.AuditLogRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

/**
 * Service for audit logging operations.
 */
@Service
public class AuditService {

    @Autowired
    private AuditLogRepository auditLogRepository;

    /**
     * Log an action to MongoDB.
     */
    public void logAction(Long userId, Long organizationId, String action,
            String entityType, Long entityId, Map<String, Object> changes) {
        AuditLog log = new AuditLog();
        log.setUserId(userId);
        log.setOrganizationId(organizationId);
        log.setAction(action);
        log.setEntityType(entityType);
        log.setEntityId(entityId);
        log.setChanges(changes != null ? changes : Map.of());
        log.setTimestamp(LocalDateTime.now());

        auditLogRepository.save(log);
    }

    /**
     * Get audit logs by organization.
     */
    public List<AuditLog> getAuditLogsByOrganization(Long organizationId) {
        return auditLogRepository.findByOrganizationId(organizationId);
    }

    /**
     * Get audit logs by entity.
     */
    public List<AuditLog> getAuditLogsByEntity(String entityType, Long entityId) {
        return auditLogRepository.findByEntityTypeAndEntityId(entityType, entityId);
    }

    /**
     * Get audit logs by date range.
     */
    public List<AuditLog> getAuditLogsByDateRange(Long organizationId,
            LocalDateTime start,
            LocalDateTime end) {
        return auditLogRepository.findByOrganizationIdAndTimestampBetween(
                organizationId, start, end);
    }
}

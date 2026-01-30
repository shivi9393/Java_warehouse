package com.warehouse.document;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;

/**
 * MongoDB document for audit logging.
 * Provides flexible schema for tracking all system actions.
 */
@Document(collection = "audit_logs")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class AuditLog {

    @Id
    private String id;

    @Indexed
    private Long organizationId;

    @Indexed
    private Long userId;

    private String userEmail;

    @Indexed
    private String action; // CREATE, UPDATE, DELETE, LOGIN, etc.

    @Indexed
    private String entityType; // User, Warehouse, Inventory, PurchaseOrder, etc.

    @Indexed
    private Long entityId;

    private Map<String, Object> changes = new HashMap<>(); // Before/after values

    @Indexed
    private LocalDateTime timestamp;

    private String ipAddress;

    private String userAgent;

    private Map<String, Object> metadata = new HashMap<>(); // Additional context
}

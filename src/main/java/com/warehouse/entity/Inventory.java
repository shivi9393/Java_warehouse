package com.warehouse.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.time.LocalDate;
import java.time.LocalDateTime;

/**
 * Inventory entity representing stock levels in warehouses.
 */
@Entity
@Table(name = "inventory", uniqueConstraints = @UniqueConstraint(columnNames = { "product_id", "warehouse_id",
        "zone_id", "batch_number" }), indexes = {
                @Index(name = "idx_inventory_warehouse", columnList = "warehouse_id"),
                @Index(name = "idx_inventory_product", columnList = "product_id")
        })
@EntityListeners(AuditingEntityListener.class)
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Inventory {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "product_id", nullable = false)
    private Product product;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "warehouse_id", nullable = false)
    private Warehouse warehouse;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "zone_id")
    private StorageZone zone;

    @Column(nullable = false)
    private Integer quantity = 0;

    @Column(length = 50)
    private String batchNumber;

    @Column
    private LocalDate expiryDate;

    @Column(nullable = false)
    private Integer minStockLevel = 0;

    @Column(nullable = false)
    private Integer maxStockLevel = 1000;

    @LastModifiedDate
    @Column(nullable = false)
    private LocalDateTime lastUpdated;

    // Helper method to check if stock is low
    public boolean isLowStock() {
        return quantity <= minStockLevel;
    }

    // Helper method to check if expiring soon (within 30 days)
    public boolean isExpiringSoon() {
        if (expiryDate == null)
            return false;
        return expiryDate.isBefore(LocalDate.now().plusDays(30));
    }
}

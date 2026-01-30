package com.warehouse.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Storage zone entity representing sections within a warehouse.
 */
@Entity
@Table(name = "storage_zones")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class StorageZone {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 100)
    private String name;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "warehouse_id", nullable = false)
    private Warehouse warehouse;

    @Column(nullable = false)
    private Integer capacity; // Zone capacity in units

    @Column(nullable = false)
    private Integer currentUtilization = 0; // Current usage

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private ZoneType zoneType;

    // Helper method to calculate utilization percentage
    public Double getUtilizationPercentage() {
        if (capacity == 0)
            return 0.0;
        return (currentUtilization * 100.0) / capacity;
    }
}

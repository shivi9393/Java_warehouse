package com.warehouse.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalDateTime;

/**
 * DTO for Inventory data transfer.
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class InventoryDTO {

    private Long id;
    private Long productId;
    private String productName;
    private String productSku;
    private Long warehouseId;
    private String warehouseName;
    private Long zoneId;
    private String zoneName;
    private Integer quantity;
    private String batchNumber;
    private LocalDate expiryDate;
    private Integer minStockLevel;
    private Integer maxStockLevel;
    private LocalDateTime lastUpdated;
    private Boolean isLowStock;
    private Boolean isExpiringSoon;
}

package com.warehouse.dto;

import com.warehouse.entity.ZoneType;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * DTO for StorageZone data transfer.
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class StorageZoneDTO {

    private Long id;
    private String name;
    private Long warehouseId;
    private Integer capacity;
    private Integer currentUtilization;
    private ZoneType zoneType;
    private Double utilizationPercentage;
}

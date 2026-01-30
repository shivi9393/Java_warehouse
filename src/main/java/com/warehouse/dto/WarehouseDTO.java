package com.warehouse.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

/**
 * DTO for Warehouse data transfer.
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class WarehouseDTO {

    private Long id;
    private String name;
    private String location;
    private Integer capacity;
    private Long organizationId;
    private String organizationName;
    private Long managerId;
    private String managerName;
    private Boolean active;
    private LocalDateTime createdAt;
    private List<StorageZoneDTO> zones = new ArrayList<>();
}

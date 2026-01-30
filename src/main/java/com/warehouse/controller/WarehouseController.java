package com.warehouse.controller;

import com.warehouse.dto.StorageZoneDTO;
import com.warehouse.dto.WarehouseDTO;
import com.warehouse.service.WarehouseService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * Controller for warehouse management endpoints.
 */
@RestController
@RequestMapping("/warehouses")
@SecurityRequirement(name = "bearerAuth")
@Tag(name = "Warehouses", description = "Warehouse management endpoints")
public class WarehouseController {

    @Autowired
    private WarehouseService warehouseService;

    @Autowired
    private com.warehouse.repository.UserRepository userRepository;

    @Operation(summary = "Create warehouse", description = "Create a new warehouse")
    @PostMapping
    public ResponseEntity<WarehouseDTO> createWarehouse(
            @Valid @RequestBody WarehouseDTO dto,
            Authentication authentication) {
        Long userId = getUserId(authentication);
        WarehouseDTO created = warehouseService.createWarehouse(dto, userId);
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }

    @Operation(summary = "Add storage zone", description = "Add a storage zone to a warehouse")
    @PostMapping("/{id}/zones")
    public ResponseEntity<StorageZoneDTO> addStorageZone(
            @PathVariable Long id,
            @Valid @RequestBody StorageZoneDTO dto,
            Authentication authentication) {
        Long userId = getUserId(authentication);
        StorageZoneDTO created = warehouseService.addStorageZone(id, dto, userId);
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }

    @Operation(summary = "Get warehouses by organization", description = "Get all warehouses for an organization")
    @GetMapping
    public ResponseEntity<List<WarehouseDTO>> getWarehouses(
            @RequestParam Long organizationId) {
        List<WarehouseDTO> warehouses = warehouseService.getWarehousesByOrganization(organizationId);
        return ResponseEntity.ok(warehouses);
    }

    @Operation(summary = "Get warehouse by ID", description = "Get warehouse details by ID")
    @GetMapping("/{id}")
    public ResponseEntity<WarehouseDTO> getWarehouse(@PathVariable Long id) {
        WarehouseDTO warehouse = warehouseService.getWarehouseById(id);
        return ResponseEntity.ok(warehouse);
    }

    @Operation(summary = "Update warehouse", description = "Update warehouse details")
    @PutMapping("/{id}")
    public ResponseEntity<WarehouseDTO> updateWarehouse(
            @PathVariable Long id,
            @Valid @RequestBody WarehouseDTO dto,
            Authentication authentication) {
        Long userId = getUserId(authentication);
        WarehouseDTO updated = warehouseService.updateWarehouse(id, dto, userId);
        return ResponseEntity.ok(updated);
    }

    private Long getUserId(Authentication authentication) {
        UserDetails userDetails = (UserDetails) authentication.getPrincipal();
        return userRepository.findByEmail(userDetails.getUsername())
                .orElseThrow(() -> new RuntimeException("User not found"))
                .getId();
    }
}

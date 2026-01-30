package com.warehouse.controller;

import com.warehouse.dto.InventoryDTO;
import com.warehouse.dto.StockOperationRequest;
import com.warehouse.service.InventoryService;
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
 * Controller for inventory management endpoints.
 */
@RestController
@RequestMapping("/inventory")
@SecurityRequirement(name = "bearerAuth")
@Tag(name = "Inventory", description = "Inventory management endpoints")
public class InventoryController {

    @Autowired
    private InventoryService inventoryService;

    @Autowired
    private com.warehouse.repository.UserRepository userRepository;

    @Operation(summary = "Stock in", description = "Receive stock into warehouse")
    @PostMapping("/stock-in")
    public ResponseEntity<InventoryDTO> stockIn(
            @Valid @RequestBody StockOperationRequest request,
            Authentication authentication) {
        Long userId = getUserId(authentication);
        InventoryDTO result = inventoryService.stockIn(request, userId);
        return ResponseEntity.status(HttpStatus.CREATED).body(result);
    }

    @Operation(summary = "Stock out", description = "Issue stock from warehouse")
    @PostMapping("/stock-out")
    public ResponseEntity<InventoryDTO> stockOut(
            @Valid @RequestBody StockOperationRequest request,
            Authentication authentication) {
        Long userId = getUserId(authentication);
        InventoryDTO result = inventoryService.stockOut(request, userId);
        return ResponseEntity.ok(result);
    }

    @Operation(summary = "Get inventory by warehouse", description = "Get all inventory for a warehouse")
    @GetMapping
    public ResponseEntity<List<InventoryDTO>> getInventory(
            @RequestParam Long warehouseId) {
        List<InventoryDTO> inventory = inventoryService.getInventoryByWarehouse(warehouseId);
        return ResponseEntity.ok(inventory);
    }

    @Operation(summary = "Get low stock alerts", description = "Get items with low stock levels")
    @GetMapping("/alerts/low-stock")
    public ResponseEntity<List<InventoryDTO>> getLowStockAlerts(
            @RequestParam(required = false) Long warehouseId) {
        List<InventoryDTO> alerts = inventoryService.getLowStockAlerts(warehouseId);
        return ResponseEntity.ok(alerts);
    }

    @Operation(summary = "Get expiring items", description = "Get items expiring within specified days")
    @GetMapping("/alerts/expiring")
    public ResponseEntity<List<InventoryDTO>> getExpiringItems(
            @RequestParam(defaultValue = "30") int daysAhead) {
        List<InventoryDTO> expiring = inventoryService.getExpiringItems(daysAhead);
        return ResponseEntity.ok(expiring);
    }

    private Long getUserId(Authentication authentication) {
        UserDetails userDetails = (UserDetails) authentication.getPrincipal();
        return userRepository.findByEmail(userDetails.getUsername())
                .orElseThrow(() -> new RuntimeException("User not found"))
                .getId();
    }
}

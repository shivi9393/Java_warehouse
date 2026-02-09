package com.warehouse.service;

import com.warehouse.dto.InventoryDTO;
import com.warehouse.dto.StockOperationRequest;
import com.warehouse.entity.*;
import com.warehouse.exception.ResourceNotFoundException;
import com.warehouse.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

/**
 * Service for inventory management operations.
 */
@Service
public class InventoryService {

    @Autowired
    private InventoryRepository inventoryRepository;

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private WarehouseRepository warehouseRepository;

    @Transactional
    public InventoryDTO stockIn(StockOperationRequest request, Long userId) {
        Product product = productRepository.findById(request.getProductId())
                .orElseThrow(() -> new ResourceNotFoundException("Product", "id", request.getProductId()));

        Warehouse warehouse = warehouseRepository.findById(request.getWarehouseId())
                .orElseThrow(() -> new ResourceNotFoundException("Warehouse", "id", request.getWarehouseId()));

        // Find or create inventory record
        Optional<Inventory> existingInventory = inventoryRepository
                .findByProductIdAndWarehouseIdAndBatchNumber(
                        request.getProductId(),
                        request.getWarehouseId(),
                        request.getBatchNumber());

        Inventory inventory;
        if (existingInventory.isPresent()) {
            inventory = existingInventory.get();
            inventory.setQuantity(inventory.getQuantity() + request.getQuantity());
        } else {
            inventory = new Inventory();
            inventory.setProduct(product);
            inventory.setWarehouse(warehouse);
            inventory.setQuantity(request.getQuantity());
            inventory.setBatchNumber(request.getBatchNumber());
            inventory.setExpiryDate(request.getExpiryDate());
        }

        inventory = inventoryRepository.save(inventory);

        return convertToDTO(inventory);
    }

    @Transactional
    public InventoryDTO stockOut(StockOperationRequest request, Long userId) {
        Inventory inventory = inventoryRepository
                .findByProductIdAndWarehouseIdAndBatchNumber(
                        request.getProductId(),
                        request.getWarehouseId(),
                        request.getBatchNumber())
                .orElseThrow(() -> new ResourceNotFoundException("Inventory not found"));

        if (inventory.getQuantity() < request.getQuantity()) {
            throw new IllegalStateException("Insufficient stock. Available: " + inventory.getQuantity());
        }

        inventory.setQuantity(inventory.getQuantity() - request.getQuantity());
        inventory = inventoryRepository.save(inventory);

        return convertToDTO(inventory);
    }

    public List<InventoryDTO> getInventoryByWarehouse(Long warehouseId) {
        return inventoryRepository.findByWarehouseId(warehouseId).stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public List<InventoryDTO> getLowStockAlerts(Long warehouseId) {
        if (warehouseId != null) {
            return inventoryRepository.findLowStockItemsByWarehouse(warehouseId).stream()
                    .map(this::convertToDTO)
                    .collect(Collectors.toList());
        }
        return inventoryRepository.findLowStockItems().stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public List<InventoryDTO> getExpiringItems(int daysAhead) {
        LocalDate futureDate = LocalDate.now().plusDays(daysAhead);
        return inventoryRepository.findExpiringBefore(futureDate).stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    private InventoryDTO convertToDTO(Inventory inventory) {
        InventoryDTO dto = new InventoryDTO();
        dto.setId(inventory.getId());
        dto.setProductId(inventory.getProduct().getId());
        dto.setProductName(inventory.getProduct().getName());
        dto.setProductSku(inventory.getProduct().getSku());
        dto.setWarehouseId(inventory.getWarehouse().getId());
        dto.setWarehouseName(inventory.getWarehouse().getName());

        if (inventory.getZone() != null) {
            dto.setZoneId(inventory.getZone().getId());
            dto.setZoneName(inventory.getZone().getName());
        }

        dto.setQuantity(inventory.getQuantity());
        dto.setBatchNumber(inventory.getBatchNumber());
        dto.setExpiryDate(inventory.getExpiryDate());
        dto.setMinStockLevel(inventory.getMinStockLevel());
        dto.setMaxStockLevel(inventory.getMaxStockLevel());
        dto.setLastUpdated(inventory.getLastUpdated());
        dto.setIsLowStock(inventory.isLowStock());
        dto.setIsExpiringSoon(inventory.isExpiringSoon());

        return dto;
    }
}

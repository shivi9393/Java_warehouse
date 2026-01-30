package com.warehouse.repository;

import com.warehouse.entity.Inventory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

/**
 * Repository for Inventory entity operations.
 */
@Repository
public interface InventoryRepository extends JpaRepository<Inventory, Long> {

    List<Inventory> findByWarehouseId(Long warehouseId);

    List<Inventory> findByProductId(Long productId);

    Optional<Inventory> findByProductIdAndWarehouseIdAndBatchNumber(
            Long productId, Long warehouseId, String batchNumber);

    // Low stock alerts
    @Query("SELECT i FROM Inventory i WHERE i.quantity <= i.minStockLevel")
    List<Inventory> findLowStockItems();

    @Query("SELECT i FROM Inventory i WHERE i.warehouse.id = :warehouseId AND i.quantity <= i.minStockLevel")
    List<Inventory> findLowStockItemsByWarehouse(@Param("warehouseId") Long warehouseId);

    // Expiring items
    @Query("SELECT i FROM Inventory i WHERE i.expiryDate IS NOT NULL AND i.expiryDate <= :date")
    List<Inventory> findExpiringBefore(@Param("date") LocalDate date);

    @Query("SELECT i FROM Inventory i WHERE i.warehouse.organization.id = :orgId")
    List<Inventory> findByOrganizationId(@Param("orgId") Long organizationId);
}

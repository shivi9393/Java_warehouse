package com.warehouse.repository;

import com.warehouse.entity.Shipment;
import com.warehouse.entity.ShipmentStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

/**
 * Repository for Shipment entity operations.
 */
@Repository
public interface ShipmentRepository extends JpaRepository<Shipment, Long> {

    Optional<Shipment> findByTrackingNumber(String trackingNumber);

    Optional<Shipment> findByPurchaseOrderId(Long purchaseOrderId);

    List<Shipment> findByStatus(ShipmentStatus status);

    List<Shipment> findByWarehouseId(Long warehouseId);
}

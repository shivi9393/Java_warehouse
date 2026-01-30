package com.warehouse.repository;

import com.warehouse.entity.PurchaseOrder;
import com.warehouse.entity.PurchaseOrderStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

/**
 * Repository for PurchaseOrder entity operations.
 */
@Repository
public interface PurchaseOrderRepository extends JpaRepository<PurchaseOrder, Long> {

    Optional<PurchaseOrder> findByPoNumber(String poNumber);

    List<PurchaseOrder> findByOrganizationId(Long organizationId);

    List<PurchaseOrder> findByStatus(PurchaseOrderStatus status);

    List<PurchaseOrder> findByVendorId(Long vendorId);

    List<PurchaseOrder> findByCreatedAtBetween(LocalDateTime start, LocalDateTime end);

    List<PurchaseOrder> findByOrganizationIdAndStatus(Long organizationId, PurchaseOrderStatus status);
}

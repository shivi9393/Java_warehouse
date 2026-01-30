package com.warehouse.entity;

/**
 * Purchase order status for workflow management.
 */
public enum PurchaseOrderStatus {
    DRAFT, // Initial creation
    PENDING_APPROVAL, // Awaiting approval
    APPROVED, // Approved by admin
    SHIPPED, // Vendor has shipped
    RECEIVED, // Goods received at warehouse
    CANCELLED // Cancelled
}

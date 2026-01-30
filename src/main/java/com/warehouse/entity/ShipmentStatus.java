package com.warehouse.entity;

/**
 * Shipment status for tracking delivery progress.
 */
public enum ShipmentStatus {
    CREATED, // Shipment created
    IN_TRANSIT, // In transit to warehouse
    OUT_FOR_DELIVERY, // Out for delivery
    DELIVERED, // Successfully delivered
    FAILED // Delivery failed
}

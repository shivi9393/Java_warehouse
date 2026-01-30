package com.warehouse.entity;

/**
 * Inventory transaction types for tracking stock movements.
 */
public enum TransactionType {
    STOCK_IN, // Receiving stock
    STOCK_OUT, // Issuing/selling stock
    TRANSFER, // Transfer between warehouses
    ADJUSTMENT // Manual adjustment (damage, loss, audit)
}

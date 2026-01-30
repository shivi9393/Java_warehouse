package com.warehouse.entity;

/**
 * Storage zone types for warehouse organization.
 */
public enum ZoneType {
    GENERAL, // General storage
    COLD_STORAGE, // Temperature-controlled
    HAZMAT, // Hazardous materials
    RECEIVING, // Receiving area
    SHIPPING, // Shipping area
    QUARANTINE // Quality control/quarantine
}

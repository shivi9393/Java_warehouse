package com.warehouse.entity;

/**
 * User roles for role-based access control (RBAC).
 */
public enum UserRole {
    SUPER_ADMIN,      // Platform owner - full access
    COMPANY_ADMIN,    // Organization admin - manage org users and settings
    OPS_MANAGER,      // Operations manager - manage inventory, POs, shipments
    WAREHOUSE_STAFF,  // Warehouse staff - limited inventory operations
    VENDOR            // Vendor - view POs and shipments
}

-- Warehouse Management SaaS - Sample Seed Data

-- Insert sample organization
INSERT INTO organizations (name, contact_email, contact_phone, address, active)
VALUES ('Demo Corp', 'contact@democorp.com', '+1-555-0100', '123 Business St, San Francisco, CA 94102', TRUE);

-- Insert super admin (password: admin123)
INSERT INTO users (email, password, first_name, last_name, role, organization_id, active)
VALUES ('admin@warehouse-saas.com', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 
        'Super', 'Admin', 'SUPER_ADMIN', 1, TRUE);

-- Insert company admin (password: admin123)
INSERT INTO users (email, password, first_name, last_name, role, organization_id, active)
VALUES ('admin@democorp.com', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy',
        'John', 'Doe', 'COMPANY_ADMIN', 1, TRUE);

-- Insert ops manager (password: manager123)
INSERT INTO users (email, password, first_name, last_name, role, organization_id, active)
VALUES ('ops@democorp.com', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy',
        'Jane', 'Smith', 'OPS_MANAGER', 1, TRUE);

-- Insert warehouse staff (password: staff123)
INSERT INTO users (email, password, first_name, last_name, role, organization_id, active)
VALUES ('staff@democorp.com', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy',
        'Bob', 'Johnson', 'WAREHOUSE_STAFF', 1, TRUE);

-- Insert warehouses
INSERT INTO warehouses (name, location, capacity, organization_id, manager_id, active)
VALUES 
    ('Main Warehouse', '456 Storage Ave, Oakland, CA 94601', 10000, 1, 3, TRUE),
    ('Secondary Warehouse', '789 Logistics Blvd, San Jose, CA 95110', 5000, 1, 3, TRUE);

-- Insert storage zones
INSERT INTO storage_zones (name, warehouse_id, capacity, current_utilization, zone_type)
VALUES
    ('Zone A - General', 1, 3000, 1500, 'GENERAL'),
    ('Zone B - Cold Storage', 1, 2000, 800, 'COLD_STORAGE'),
    ('Zone C - Receiving', 1, 1000, 200, 'RECEIVING'),
    ('Zone D - Shipping', 1, 1000, 300, 'SHIPPING'),
    ('Zone A - General', 2, 2000, 500, 'GENERAL');

-- Insert vendors
INSERT INTO vendors (name, contact_person, email, phone, address, organization_id, 
                     contract_details, payment_terms, rating, active)
VALUES
    ('Tech Supplies Inc', 'Alice Brown', 'alice@techsupplies.com', '+1-555-0200',
     '100 Tech Park, Austin, TX 78701', 1, 'Annual contract', 'Net 30', 4.5, TRUE),
    ('Global Electronics', 'Charlie Davis', 'charlie@globalelec.com', '+1-555-0300',
     '200 Electronics Way, Seattle, WA 98101', 1, 'Quarterly contract', 'Net 45', 4.2, TRUE);

-- Insert products
INSERT INTO products (sku, name, description, vendor_id, category, unit_price, active)
VALUES
    ('LAPTOP-001', 'Business Laptop', 'High-performance business laptop', 1, 'Electronics', 899.99, TRUE),
    ('MOUSE-001', 'Wireless Mouse', 'Ergonomic wireless mouse', 1, 'Accessories', 29.99, TRUE),
    ('MONITOR-001', '27" LED Monitor', '4K LED monitor', 2, 'Electronics', 349.99, TRUE),
    ('KEYBOARD-001', 'Mechanical Keyboard', 'RGB mechanical keyboard', 2, 'Accessories', 79.99, TRUE);

-- Insert inventory
INSERT INTO inventory (product_id, warehouse_id, zone_id, quantity, batch_number, 
                       min_stock_level, max_stock_level)
VALUES
    (1, 1, 1, 50, 'BATCH-2024-001', 10, 100),
    (2, 1, 1, 200, 'BATCH-2024-002', 50, 500),
    (3, 1, 1, 30, 'BATCH-2024-003', 10, 80),
    (4, 1, 1, 100, 'BATCH-2024-004', 20, 200),
    (1, 2, 5, 25, 'BATCH-2024-005', 5, 50);

-- Insert sample purchase order
INSERT INTO purchase_orders (po_number, vendor_id, organization_id, created_by, status, 
                              total_amount, expected_delivery_date)
VALUES ('PO-2024-001', 1, 1, 3, 'APPROVED', 5000.00, DATE_ADD(CURDATE(), INTERVAL 7 DAY));

-- Insert purchase order items
INSERT INTO purchase_order_items (purchase_order_id, product_id, quantity, unit_price, total_price)
VALUES
    (1, 1, 5, 899.99, 4499.95),
    (1, 2, 10, 29.99, 299.90);

-- Insert sample shipment
INSERT INTO shipments (purchase_order_id, tracking_number, carrier, status, 
                       estimated_delivery_date, warehouse_id)
VALUES (1, 'TRACK-123456789', 'FedEx', 'IN_TRANSIT', DATE_ADD(CURDATE(), INTERVAL 5 DAY), 1);

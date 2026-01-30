# Warehouse Management SaaS - API Testing Guide

This guide provides comprehensive examples for testing all API endpoints using cURL.

## Prerequisites

1. **Start the application**:
   ```bash
   docker-compose up -d
   ```

2. **Base URL**: `http://localhost:8080/api`

---

## 1. Authentication

### Register Organization
```bash
curl -X POST http://localhost:8080/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "organizationName": "TechCorp Inc",
    "contactEmail": "contact@techcorp.com",
    "contactPhone": "+1-555-0100",
    "address": "123 Tech Street, San Francisco, CA 94102",
    "adminFirstName": "John",
    "adminLastName": "Doe",
    "adminEmail": "admin@techcorp.com",
    "password": "SecurePass123!"
  }'
```

**Response**:
```json
{
  "token": "eyJhbGciOiJIUzI1NiJ9...",
  "userId": 1,
  "email": "admin@techcorp.com",
  "role": "COMPANY_ADMIN",
  "organizationId": 1,
  "organizationName": "TechCorp Inc"
}
```

### Login
```bash
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@techcorp.com",
    "password": "SecurePass123!"
  }'
```

**Save the token for subsequent requests**:
```bash
export TOKEN="your-jwt-token-here"
```

---

## 2. User Management

### Create User
```bash
curl -X POST http://localhost:8080/api/users \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "warehouse.staff@techcorp.com",
    "password": "StaffPass123!",
    "firstName": "Jane",
    "lastName": "Smith",
    "role": "WAREHOUSE_STAFF",
    "organizationId": 1
  }'
```

### Get Users by Organization
```bash
curl -X GET "http://localhost:8080/api/users?organizationId=1" \
  -H "Authorization: Bearer $TOKEN"
```

### Get User by ID
```bash
curl -X GET http://localhost:8080/api/users/1 \
  -H "Authorization: Bearer $TOKEN"
```

---

## 3. Warehouse Management

### Create Warehouse
```bash
curl -X POST http://localhost:8080/api/warehouses \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Main Distribution Center",
    "location": "456 Logistics Ave, Oakland, CA 94601",
    "capacity": 10000,
    "organizationId": 1,
    "managerId": 2
  }'
```

### Add Storage Zone
```bash
curl -X POST http://localhost:8080/api/warehouses/1/zones \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Zone A - General Storage",
    "capacity": 3000,
    "zoneType": "GENERAL"
  }'
```

### Get Warehouses by Organization
```bash
curl -X GET "http://localhost:8080/api/warehouses?organizationId=1" \
  -H "Authorization: Bearer $TOKEN"
```

### Get Warehouse by ID
```bash
curl -X GET http://localhost:8080/api/warehouses/1 \
  -H "Authorization: Bearer $TOKEN"
```

---

## 4. Vendor Management

### Create Vendor
```bash
curl -X POST http://localhost:8080/api/vendors \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Global Electronics Supply",
    "contactPerson": "Alice Johnson",
    "email": "alice@globalelec.com",
    "phone": "+1-555-0200",
    "address": "789 Vendor Blvd, Seattle, WA 98101",
    "organizationId": 1,
    "contractDetails": "Annual supply contract",
    "paymentTerms": "Net 30 days"
  }'
```

### Get Vendors by Organization
```bash
curl -X GET "http://localhost:8080/api/vendors?organizationId=1" \
  -H "Authorization: Bearer $TOKEN"
```

### Get Vendor by ID
```bash
curl -X GET http://localhost:8080/api/vendors/1 \
  -H "Authorization: Bearer $TOKEN"
```

### Update Vendor
```bash
curl -X PUT http://localhost:8080/api/vendors/1 \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Global Electronics Supply",
    "contactPerson": "Alice Johnson",
    "email": "alice@globalelec.com",
    "phone": "+1-555-0200",
    "address": "789 Vendor Blvd, Seattle, WA 98101",
    "organizationId": 1,
    "contractDetails": "Updated annual contract",
    "paymentTerms": "Net 45 days"
  }'
```

---

## 5. Inventory Management

### Stock In (Receive Inventory)
```bash
curl -X POST http://localhost:8080/api/inventory/stock-in \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "productId": 1,
    "warehouseId": 1,
    "zoneId": 1,
    "quantity": 100,
    "batchNumber": "BATCH-2024-001",
    "expiryDate": "2025-12-31",
    "notes": "Initial stock receipt"
  }'
```

### Stock Out (Issue Inventory)
```bash
curl -X POST http://localhost:8080/api/inventory/stock-out \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "productId": 1,
    "warehouseId": 1,
    "quantity": 10,
    "batchNumber": "BATCH-2024-001",
    "notes": "Customer order fulfillment"
  }'
```

### Get Inventory by Warehouse
```bash
curl -X GET "http://localhost:8080/api/inventory?warehouseId=1" \
  -H "Authorization: Bearer $TOKEN"
```

### Get Low Stock Alerts
```bash
# All warehouses
curl -X GET http://localhost:8080/api/inventory/alerts/low-stock \
  -H "Authorization: Bearer $TOKEN"

# Specific warehouse
curl -X GET "http://localhost:8080/api/inventory/alerts/low-stock?warehouseId=1" \
  -H "Authorization: Bearer $TOKEN"
```

### Get Expiring Items
```bash
# Items expiring in next 30 days (default)
curl -X GET http://localhost:8080/api/inventory/alerts/expiring \
  -H "Authorization: Bearer $TOKEN"

# Items expiring in next 60 days
curl -X GET "http://localhost:8080/api/inventory/alerts/expiring?daysAhead=60" \
  -H "Authorization: Bearer $TOKEN"
```

---

## 6. Purchase Order Management

### Create Purchase Order
```bash
curl -X POST http://localhost:8080/api/purchase-orders \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "vendorId": 1,
    "expectedDeliveryDate": "2024-02-15",
    "items": [
      {
        "productId": 1,
        "quantity": 50
      },
      {
        "productId": 2,
        "quantity": 100
      }
    ]
  }'
```

### Approve Purchase Order
```bash
curl -X PUT http://localhost:8080/api/purchase-orders/1/approve \
  -H "Authorization: Bearer $TOKEN"
```

### Get Purchase Orders by Organization
```bash
curl -X GET "http://localhost:8080/api/purchase-orders?organizationId=1" \
  -H "Authorization: Bearer $TOKEN"
```

### Get Purchase Order by ID
```bash
curl -X GET http://localhost:8080/api/purchase-orders/1 \
  -H "Authorization: Bearer $TOKEN"
```

---

## Complete Workflow Example

Here's a complete workflow from organization registration to purchase order:

```bash
#!/bin/bash

# 1. Register Organization
echo "1. Registering organization..."
REGISTER_RESPONSE=$(curl -s -X POST http://localhost:8080/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "organizationName": "Demo Warehouse Co",
    "contactEmail": "contact@demowarehouse.com",
    "contactPhone": "+1-555-9999",
    "address": "999 Demo St, Demo City, DC 12345",
    "adminFirstName": "Demo",
    "adminLastName": "Admin",
    "adminEmail": "admin@demowarehouse.com",
    "password": "DemoPass123!"
  }')

TOKEN=$(echo $REGISTER_RESPONSE | jq -r '.token')
ORG_ID=$(echo $REGISTER_RESPONSE | jq -r '.organizationId')

echo "Token: $TOKEN"
echo "Organization ID: $ORG_ID"

# 2. Create Warehouse
echo -e "\n2. Creating warehouse..."
WAREHOUSE_RESPONSE=$(curl -s -X POST http://localhost:8080/api/warehouses \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d "{
    \"name\": \"Demo Warehouse\",
    \"location\": \"123 Warehouse Rd\",
    \"capacity\": 5000,
    \"organizationId\": $ORG_ID
  }")

WAREHOUSE_ID=$(echo $WAREHOUSE_RESPONSE | jq -r '.id')
echo "Warehouse ID: $WAREHOUSE_ID"

# 3. Create Vendor
echo -e "\n3. Creating vendor..."
VENDOR_RESPONSE=$(curl -s -X POST http://localhost:8080/api/vendors \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d "{
    \"name\": \"Demo Supplier\",
    \"contactPerson\": \"Supplier Contact\",
    \"email\": \"supplier@demo.com\",
    \"phone\": \"+1-555-8888\",
    \"address\": \"456 Supplier Ave\",
    \"organizationId\": $ORG_ID,
    \"paymentTerms\": \"Net 30\"
  }")

VENDOR_ID=$(echo $VENDOR_RESPONSE | jq -r '.id')
echo "Vendor ID: $VENDOR_ID"

# 4. Create Purchase Order (assuming products exist)
echo -e "\n4. Creating purchase order..."
PO_RESPONSE=$(curl -s -X POST http://localhost:8080/api/purchase-orders \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d "{
    \"vendorId\": $VENDOR_ID,
    \"expectedDeliveryDate\": \"2024-03-01\",
    \"items\": [
      {
        \"productId\": 1,
        \"quantity\": 100
      }
    ]
  }")

PO_ID=$(echo $PO_RESPONSE | jq -r '.id')
echo "Purchase Order ID: $PO_ID"

# 5. Approve Purchase Order
echo -e "\n5. Approving purchase order..."
curl -s -X PUT http://localhost:8080/api/purchase-orders/$PO_ID/approve \
  -H "Authorization: Bearer $TOKEN" | jq '.'

echo -e "\n✅ Workflow completed successfully!"
```

---

## Testing with Swagger UI

Access the interactive API documentation at:
```
http://localhost:8080/api/swagger-ui.html
```

1. Click **"Authorize"** button
2. Enter your JWT token: `Bearer your-token-here`
3. Click **"Authorize"** and **"Close"**
4. Test endpoints directly from the browser

---

## Common Response Codes

| Code | Meaning | Example |
|------|---------|---------|
| 200 | Success | GET requests |
| 201 | Created | POST requests |
| 204 | No Content | DELETE requests |
| 400 | Bad Request | Validation errors |
| 401 | Unauthorized | Missing/invalid token |
| 403 | Forbidden | Insufficient permissions |
| 404 | Not Found | Resource doesn't exist |
| 409 | Conflict | Duplicate resource |
| 500 | Server Error | Internal error |

---

## Error Response Format

All errors return a consistent format:

```json
{
  "timestamp": "2024-01-30T12:00:00",
  "status": 400,
  "error": "Bad Request",
  "message": "Validation failed",
  "path": "/api/users"
}
```

---

## Tips

1. **Save your token**: Export it as an environment variable for easier testing
2. **Use jq**: Install `jq` for pretty-printing JSON responses
3. **Check logs**: View application logs with `docker-compose logs -f app`
4. **Database access**: Connect to MySQL with credentials from `docker-compose.yml`
5. **Swagger**: Use Swagger UI for interactive testing and documentation

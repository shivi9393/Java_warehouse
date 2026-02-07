# Warehouse Management System

A Spring Boot microservices application for warehouse operations, vendor onboarding, and purchase order workflows.

## 🚀 Features

### Core Functionality
- **Spring Boot Microservices**: Modular architecture for warehouse operations, vendor management, and purchase orders
- **JWT Authentication**: Secure token-based authentication with Spring Security
- **Role-Based Access Control (RBAC)**: 5 distinct roles with granular permissions
  - Super Admin (platform owner)
  - Company Admin (organization management)
  - Ops Manager (operations and inventory)
  - Warehouse Staff (inventory operations)
  - Vendor (view orders and shipments)

### Business Modules
- **Warehouse Operations**: Multiple warehouses, storage zones, inventory management
- **Vendor Onboarding**: Vendor profiles, contracts, SLAs, performance tracking
- **Purchase Order Workflows**: Draft → Approval → Shipment → Receipt
- **Inventory Management**: Stock in/out, transfers, adjustments with audit trail
- **Shipment Tracking**: Status updates and tracking
- **Reporting & Alerts**: Low stock alerts, warehouse utilization, vendor KPIs

## 🛠️ Technology Stack

- **Framework**: Spring Boot 3.2.1
- **Language**: Java 17
- **ORM**: Spring Data JPA + Hibernate
- **Databases**: 
  - MySQL 8.0 (transactional data)
  - MongoDB 6.0 (audit logs)
- **Security**: Spring Security + JWT-based authentication
- **API Documentation**: Swagger/OpenAPI 3.0
- **Build Tool**: Maven
- **Testing**: JUnit 5 + Mockito

## 📋 Prerequisites

- Java 17 or higher
- Maven 3.6+
- MySQL 8.0
- MongoDB 6.0

## 🏗️ Project Structure

```
warehouse-management/
├── src/
│   ├── main/
│   │   ├── java/com/warehouse/
│   │   │   ├── config/          # Security, OpenAPI configuration
│   │   │   ├── controller/      # REST controllers
│   │   │   ├── dto/             # Data Transfer Objects
│   │   │   ├── entity/          # JPA entities
│   │   │   ├── document/        # MongoDB documents
│   │   │   ├── repository/      # JPA & MongoDB repositories
│   │   │   ├── security/        # JWT, authentication
│   │   │   ├── service/         # Business logic
│   │   │   └── exception/       # Custom exceptions
│   │   └── resources/
│   │       ├── application.yml           # Main configuration
│   │       ├── application-dev.yml       # Development config
│   │       ├── application-prod.yml      # Production config
│   │       └── db/
│   │           ├── schema.sql            # Database schema
│   │           └── seed-data.sql         # Sample data
│   └── test/                    # Unit and integration tests
├── Dockerfile
├── docker-compose.yml
└── pom.xml
```

## 🚀 Quick Start

### 1. Install Dependencies

**Install MySQL** (macOS):
```bash
brew install mysql
brew services start mysql

# Create database and user
mysql -u root -p
CREATE DATABASE warehouse_db;
CREATE USER 'warehouse_user'@'localhost' IDENTIFIED BY 'warehouse_pass';
GRANT ALL PRIVILEGES ON warehouse_db.* TO 'warehouse_user'@'localhost';
FLUSH PRIVILEGES;
EXIT;
```

**Install MongoDB** (macOS):
```bash
brew tap mongodb/brew
brew install mongodb-community
brew services start mongodb-community
```

### 2. Build and Run

```bash
cd "/Users/shivdev/Desktop/Spring/warehouse management"

# Build the project
mvn clean install

# Run the application
mvn spring-boot:run
```

### 3. Access the Application

- **API Base URL**: `http://localhost:8080/api`
- **Swagger UI**: `http://localhost:8080/api/swagger-ui.html`

## 📚 API Documentation

Once the application is running, access the interactive API documentation at:

**Swagger UI**: `http://localhost:8080/api/swagger-ui.html`

### Sample API Endpoints

#### Authentication
- `POST /api/auth/register` - Register new organization
- `POST /api/auth/login` - User login

#### Users (Admin only)
- `POST /api/users` - Create user
- `GET /api/users` - List users
- `PUT /api/users/{id}` - Update user

#### Warehouses
- `POST /api/warehouses` - Create warehouse
- `GET /api/warehouses` - List warehouses
- `POST /api/warehouses/{id}/zones` - Add storage zone

#### Inventory
- `POST /api/inventory/stock-in` - Receive stock
- `POST /api/inventory/transfer` - Transfer stock
- `GET /api/inventory/alerts/low-stock` - Low stock alerts

#### Purchase Orders
- `POST /api/purchase-orders` - Create PO
- `PUT /api/purchase-orders/{id}/approve` - Approve PO
- `PUT /api/purchase-orders/{id}/receive` - Receive goods

## 🔐 Default Credentials

After running seed data:

| Role | Email | Password |
|------|-------|----------|
| Super Admin | admin@warehouse-saas.com | admin123 |
| Company Admin | admin@democorp.com | admin123 |
| Ops Manager | ops@democorp.com | manager123 |
| Warehouse Staff | staff@democorp.com | staff123 |

## 🧪 Testing

```bash
# Run all tests
mvn test

# Run with coverage
mvn clean test jacoco:report

# View coverage report
open target/site/jacoco/index.html
```

## 📊 Database Schema

The application uses two databases:

### MySQL (Transactional Data)
- organizations
- users
- warehouses, storage_zones
- vendors, products
- inventory, inventory_transactions
- purchase_orders, purchase_order_items
- shipments

### MongoDB (Audit Logs)
- audit_logs collection

## 🔧 Configuration

### Application Properties

The application uses `application.yml` for configuration. Key settings:

- **Database**: MySQL connection (localhost:3306)
- **MongoDB**: Audit log storage (localhost:27017)
- **JWT Secret**: Configurable via environment variable `JWT_SECRET`
- **Server Port**: 8080
- **Context Path**: /api

### Environment Variables (Optional)

```bash
# Database
DB_URL=jdbc:mysql://localhost:3306/warehouse_db
DB_USERNAME=warehouse_user
DB_PASSWORD=warehouse_pass

# MongoDB
MONGODB_URI=mongodb://localhost:27017/warehouse_audit

# JWT
JWT_SECRET=your-256-bit-secret-key-change-this
```

## 🎯 Key Features Implemented

- ✅ Spring Boot microservices for warehouse operations, vendor onboarding, and purchase orders
- ✅ REST APIs using Spring Data JPA, Hibernate, and MySQL
- ✅ JWT-based authentication and role-based access control with Spring Security
- ✅ Unit and integration tests using JUnit
- ✅ SQL query optimization with proper indexing
- ✅ SOLID principles implementation in service layers
- ✅ Audit logging with MongoDB
- ✅ Swagger/OpenAPI documentation

## 📝 License

This project is licensed under the Apache License 2.0.

---

**Built with ❤️ using Spring Boot**

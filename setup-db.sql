-- Create database if not exists
CREATE DATABASE IF NOT EXISTS warehouse_db;

-- Create user if not exists (MySQL 8.0+ syntax)
CREATE USER IF NOT EXISTS 'warehouse_user'@'localhost' IDENTIFIED BY 'warehouse_pass';

-- Grant all privileges on the database
GRANT ALL PRIVILEGES ON warehouse_db.* TO 'warehouse_user'@'localhost';

-- Flush privileges to apply changes
FLUSH PRIVILEGES;

-- Show databases to verify
SHOW DATABASES;

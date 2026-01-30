package com.warehouse.repository;

import com.warehouse.entity.Warehouse;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * Repository for Warehouse entity operations.
 */
@Repository
public interface WarehouseRepository extends JpaRepository<Warehouse, Long> {

    List<Warehouse> findByOrganizationId(Long organizationId);

    List<Warehouse> findByManagerId(Long managerId);

    List<Warehouse> findByActiveTrue();

    List<Warehouse> findByOrganizationIdAndActiveTrue(Long organizationId);
}

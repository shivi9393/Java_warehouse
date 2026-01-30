package com.warehouse.repository;

import com.warehouse.entity.Vendor;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.util.List;

/**
 * Repository for Vendor entity operations.
 */
@Repository
public interface VendorRepository extends JpaRepository<Vendor, Long> {

    List<Vendor> findByOrganizationId(Long organizationId);

    List<Vendor> findByActiveTrue();

    List<Vendor> findByOrganizationIdAndActiveTrue(Long organizationId);

    List<Vendor> findByRatingGreaterThanEqual(BigDecimal rating);

    boolean existsByEmail(String email);
}

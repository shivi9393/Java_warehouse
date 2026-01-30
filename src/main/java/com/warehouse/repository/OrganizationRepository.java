package com.warehouse.repository;

import com.warehouse.entity.Organization;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

/**
 * Repository for Organization entity operations.
 */
@Repository
public interface OrganizationRepository extends JpaRepository<Organization, Long> {

    Optional<Organization> findByName(String name);

    List<Organization> findByActiveTrue();

    boolean existsByName(String name);

    boolean existsByContactEmail(String contactEmail);
}

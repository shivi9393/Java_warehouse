package com.warehouse.repository;

import com.warehouse.entity.User;
import com.warehouse.entity.UserRole;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

/**
 * Repository for User entity operations.
 */
@Repository
public interface UserRepository extends JpaRepository<User, Long> {

    Optional<User> findByEmail(String email);

    List<User> findByOrganizationId(Long organizationId);

    List<User> findByRole(UserRole role);

    boolean existsByEmail(String email);

    List<User> findByOrganizationIdAndActiveTrue(Long organizationId);
}

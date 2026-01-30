package com.warehouse.controller;

import com.warehouse.dto.CreateUserRequest;
import com.warehouse.dto.UserDTO;
import com.warehouse.service.UserService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * Controller for user management endpoints.
 */
@RestController
@RequestMapping("/users")
@SecurityRequirement(name = "bearerAuth")
@Tag(name = "Users", description = "User management endpoints")
public class UserController {

    @Autowired
    private UserService userService;

    @Autowired
    private com.warehouse.repository.UserRepository userRepository;

    @Operation(summary = "Create user", description = "Create a new user (Admin only)")
    @PreAuthorize("hasAnyRole('SUPER_ADMIN', 'COMPANY_ADMIN')")
    @PostMapping
    public ResponseEntity<UserDTO> createUser(
            @Valid @RequestBody CreateUserRequest request,
            Authentication authentication) {
        Long userId = getUserId(authentication);
        UserDTO created = userService.createUser(request, userId);
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }

    @Operation(summary = "Get users by organization", description = "Get all users for an organization")
    @GetMapping
    public ResponseEntity<List<UserDTO>> getUsers(
            @RequestParam Long organizationId) {
        List<UserDTO> users = userService.getUsersByOrganization(organizationId);
        return ResponseEntity.ok(users);
    }

    @Operation(summary = "Get user by ID", description = "Get user details by ID")
    @GetMapping("/{id}")
    public ResponseEntity<UserDTO> getUser(@PathVariable Long id) {
        UserDTO user = userService.getUserById(id);
        return ResponseEntity.ok(user);
    }

    @Operation(summary = "Deactivate user", description = "Deactivate a user (Admin only)")
    @PreAuthorize("hasAnyRole('SUPER_ADMIN', 'COMPANY_ADMIN')")
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deactivateUser(
            @PathVariable Long id,
            Authentication authentication) {
        Long userId = getUserId(authentication);
        userService.deactivateUser(id, userId);
        return ResponseEntity.noContent().build();
    }

    private Long getUserId(Authentication authentication) {
        UserDetails userDetails = (UserDetails) authentication.getPrincipal();
        return userRepository.findByEmail(userDetails.getUsername())
                .orElseThrow(() -> new RuntimeException("User not found"))
                .getId();
    }
}

package com.warehouse.controller;

import com.warehouse.dto.VendorDTO;
import com.warehouse.service.VendorService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * Controller for vendor management endpoints.
 */
@RestController
@RequestMapping("/vendors")
@SecurityRequirement(name = "bearerAuth")
@Tag(name = "Vendors", description = "Vendor management endpoints")
public class VendorController {

    @Autowired
    private VendorService vendorService;

    @Autowired
    private com.warehouse.repository.UserRepository userRepository;

    @Operation(summary = "Create vendor", description = "Onboard a new vendor")
    @PostMapping
    public ResponseEntity<VendorDTO> createVendor(
            @Valid @RequestBody VendorDTO dto,
            Authentication authentication) {
        Long userId = getUserId(authentication);
        VendorDTO created = vendorService.createVendor(dto, userId);
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }

    @Operation(summary = "Get vendors by organization", description = "Get all vendors for an organization")
    @GetMapping
    public ResponseEntity<List<VendorDTO>> getVendors(
            @RequestParam Long organizationId) {
        List<VendorDTO> vendors = vendorService.getVendorsByOrganization(organizationId);
        return ResponseEntity.ok(vendors);
    }

    @Operation(summary = "Get vendor by ID", description = "Get vendor details by ID")
    @GetMapping("/{id}")
    public ResponseEntity<VendorDTO> getVendor(@PathVariable Long id) {
        VendorDTO vendor = vendorService.getVendorById(id);
        return ResponseEntity.ok(vendor);
    }

    @Operation(summary = "Update vendor", description = "Update vendor details")
    @PutMapping("/{id}")
    public ResponseEntity<VendorDTO> updateVendor(
            @PathVariable Long id,
            @Valid @RequestBody VendorDTO dto,
            Authentication authentication) {
        Long userId = getUserId(authentication);
        VendorDTO updated = vendorService.updateVendor(id, dto, userId);
        return ResponseEntity.ok(updated);
    }

    private Long getUserId(Authentication authentication) {
        UserDetails userDetails = (UserDetails) authentication.getPrincipal();
        return userRepository.findByEmail(userDetails.getUsername())
                .orElseThrow(() -> new RuntimeException("User not found"))
                .getId();
    }
}

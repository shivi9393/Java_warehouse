package com.warehouse.controller;

import com.warehouse.dto.CreatePurchaseOrderRequest;
import com.warehouse.dto.PurchaseOrderDTO;
import com.warehouse.service.PurchaseOrderService;
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
 * Controller for purchase order management endpoints.
 */
@RestController
@RequestMapping("/purchase-orders")
@SecurityRequirement(name = "bearerAuth")
@Tag(name = "Purchase Orders", description = "Purchase order management endpoints")
public class PurchaseOrderController {

    @Autowired
    private PurchaseOrderService purchaseOrderService;

    @Autowired
    private com.warehouse.repository.UserRepository userRepository;

    @Operation(summary = "Create purchase order", description = "Create a new purchase order")
    @PostMapping
    public ResponseEntity<PurchaseOrderDTO> createPurchaseOrder(
            @Valid @RequestBody CreatePurchaseOrderRequest request,
            Authentication authentication) {
        Long userId = getUserId(authentication);
        PurchaseOrderDTO created = purchaseOrderService.createPurchaseOrder(request, userId);
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }

    @Operation(summary = "Approve purchase order", description = "Approve a purchase order")
    @PutMapping("/{id}/approve")
    public ResponseEntity<PurchaseOrderDTO> approvePurchaseOrder(
            @PathVariable Long id,
            Authentication authentication) {
        Long userId = getUserId(authentication);
        PurchaseOrderDTO approved = purchaseOrderService.approvePurchaseOrder(id, userId);
        return ResponseEntity.ok(approved);
    }

    @Operation(summary = "Get purchase orders by organization", description = "Get all purchase orders for an organization")
    @GetMapping
    public ResponseEntity<List<PurchaseOrderDTO>> getPurchaseOrders(
            @RequestParam Long organizationId) {
        List<PurchaseOrderDTO> orders = purchaseOrderService.getPurchaseOrdersByOrganization(organizationId);
        return ResponseEntity.ok(orders);
    }

    @Operation(summary = "Get purchase order by ID", description = "Get purchase order details by ID")
    @GetMapping("/{id}")
    public ResponseEntity<PurchaseOrderDTO> getPurchaseOrder(@PathVariable Long id) {
        PurchaseOrderDTO order = purchaseOrderService.getPurchaseOrderById(id);
        return ResponseEntity.ok(order);
    }

    private Long getUserId(Authentication authentication) {
        UserDetails userDetails = (UserDetails) authentication.getPrincipal();
        return userRepository.findByEmail(userDetails.getUsername())
                .orElseThrow(() -> new RuntimeException("User not found"))
                .getId();
    }
}

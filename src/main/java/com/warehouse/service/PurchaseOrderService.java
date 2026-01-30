package com.warehouse.service;

import com.warehouse.dto.CreatePurchaseOrderRequest;
import com.warehouse.dto.PurchaseOrderDTO;
import com.warehouse.dto.PurchaseOrderItemDTO;
import com.warehouse.entity.*;
import com.warehouse.exception.ResourceNotFoundException;
import com.warehouse.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

/**
 * Service for purchase order management.
 */
@Service
public class PurchaseOrderService {

    @Autowired
    private PurchaseOrderRepository purchaseOrderRepository;

    @Autowired
    private VendorRepository vendorRepository;

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private AuditService auditService;

    @Transactional
    public PurchaseOrderDTO createPurchaseOrder(CreatePurchaseOrderRequest request, Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", userId));

        Vendor vendor = vendorRepository.findById(request.getVendorId())
                .orElseThrow(() -> new ResourceNotFoundException("Vendor", "id", request.getVendorId()));

        PurchaseOrder po = new PurchaseOrder();
        po.setPoNumber("PO-" + System.currentTimeMillis());
        po.setVendor(vendor);
        po.setOrganization(user.getOrganization());
        po.setCreatedBy(user);
        po.setStatus(PurchaseOrderStatus.DRAFT);
        po.setExpectedDeliveryDate(request.getExpectedDeliveryDate());

        // Add items
        for (CreatePurchaseOrderRequest.PurchaseOrderItemRequest itemReq : request.getItems()) {
            Product product = productRepository.findById(itemReq.getProductId())
                    .orElseThrow(() -> new ResourceNotFoundException("Product", "id", itemReq.getProductId()));

            PurchaseOrderItem item = new PurchaseOrderItem();
            item.setPurchaseOrder(po);
            item.setProduct(product);
            item.setQuantity(itemReq.getQuantity());
            item.setUnitPrice(product.getUnitPrice());

            po.getItems().add(item);
        }

        po.calculateTotal();
        po = purchaseOrderRepository.save(po);

        auditService.logAction(userId, user.getOrganization().getId(),
                "CREATE", "PurchaseOrder", po.getId(), null);

        return convertToDTO(po);
    }

    @Transactional
    public PurchaseOrderDTO approvePurchaseOrder(Long poId, Long userId) {
        PurchaseOrder po = purchaseOrderRepository.findById(poId)
                .orElseThrow(() -> new ResourceNotFoundException("PurchaseOrder", "id", poId));

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", userId));

        if (po.getStatus() != PurchaseOrderStatus.DRAFT && po.getStatus() != PurchaseOrderStatus.PENDING_APPROVAL) {
            throw new IllegalStateException("Only DRAFT or PENDING_APPROVAL orders can be approved");
        }

        po.setStatus(PurchaseOrderStatus.APPROVED);
        po.setApprovedBy(user);
        po.setApprovedAt(LocalDateTime.now());
        po = purchaseOrderRepository.save(po);

        auditService.logAction(userId, po.getOrganization().getId(),
                "APPROVE", "PurchaseOrder", po.getId(), null);

        return convertToDTO(po);
    }

    public List<PurchaseOrderDTO> getPurchaseOrdersByOrganization(Long organizationId) {
        return purchaseOrderRepository.findByOrganizationId(organizationId).stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public PurchaseOrderDTO getPurchaseOrderById(Long id) {
        PurchaseOrder po = purchaseOrderRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("PurchaseOrder", "id", id));
        return convertToDTO(po);
    }

    private PurchaseOrderDTO convertToDTO(PurchaseOrder po) {
        PurchaseOrderDTO dto = new PurchaseOrderDTO();
        dto.setId(po.getId());
        dto.setPoNumber(po.getPoNumber());
        dto.setVendorId(po.getVendor().getId());
        dto.setVendorName(po.getVendor().getName());
        dto.setOrganizationId(po.getOrganization().getId());
        dto.setCreatedById(po.getCreatedBy().getId());
        dto.setCreatedByName(po.getCreatedBy().getFullName());

        if (po.getApprovedBy() != null) {
            dto.setApprovedById(po.getApprovedBy().getId());
            dto.setApprovedByName(po.getApprovedBy().getFullName());
        }

        dto.setStatus(po.getStatus());
        dto.setTotalAmount(po.getTotalAmount());
        dto.setCreatedAt(po.getCreatedAt());
        dto.setApprovedAt(po.getApprovedAt());
        dto.setExpectedDeliveryDate(po.getExpectedDeliveryDate());

        dto.setItems(po.getItems().stream()
                .map(this::convertItemToDTO)
                .collect(Collectors.toList()));

        return dto;
    }

    private PurchaseOrderItemDTO convertItemToDTO(PurchaseOrderItem item) {
        PurchaseOrderItemDTO dto = new PurchaseOrderItemDTO();
        dto.setId(item.getId());
        dto.setProductId(item.getProduct().getId());
        dto.setProductName(item.getProduct().getName());
        dto.setProductSku(item.getProduct().getSku());
        dto.setQuantity(item.getQuantity());
        dto.setUnitPrice(item.getUnitPrice());
        dto.setTotalPrice(item.getTotalPrice());
        return dto;
    }
}

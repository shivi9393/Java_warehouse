package com.warehouse.dto;

import com.warehouse.entity.PurchaseOrderStatus;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

/**
 * DTO for PurchaseOrder data transfer.
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class PurchaseOrderDTO {

    private Long id;
    private String poNumber;
    private Long vendorId;
    private String vendorName;
    private Long organizationId;
    private Long createdById;
    private String createdByName;
    private Long approvedById;
    private String approvedByName;
    private PurchaseOrderStatus status;
    private BigDecimal totalAmount;
    private LocalDateTime createdAt;
    private LocalDateTime approvedAt;
    private LocalDate expectedDeliveryDate;
    private List<PurchaseOrderItemDTO> items = new ArrayList<>();
}

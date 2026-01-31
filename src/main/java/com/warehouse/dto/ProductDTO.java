package com.warehouse.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

/**
 * DTO for Product data transfer.
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class ProductDTO {

    private Long id;
    private String sku;
    private String name;
    private String description;
    private Long vendorId;
    private String vendorName;
    private String category;
    private BigDecimal unitPrice;
    private Boolean active;
}

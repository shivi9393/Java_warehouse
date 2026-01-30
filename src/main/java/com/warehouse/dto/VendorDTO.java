package com.warehouse.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;

/**
 * DTO for Vendor data transfer.
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class VendorDTO {

    private Long id;
    private String name;
    private String contactPerson;
    private String email;
    private String phone;
    private String address;
    private Long organizationId;
    private String contractDetails;
    private String paymentTerms;
    private String complianceDocuments;
    private BigDecimal rating;
    private Boolean active;
    private LocalDateTime createdAt;
}

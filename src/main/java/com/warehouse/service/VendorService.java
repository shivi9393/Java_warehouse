package com.warehouse.service;

import com.warehouse.dto.VendorDTO;
import com.warehouse.entity.Organization;
import com.warehouse.entity.Vendor;
import com.warehouse.exception.DuplicateResourceException;
import com.warehouse.exception.ResourceNotFoundException;
import com.warehouse.repository.OrganizationRepository;
import com.warehouse.repository.VendorRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

/**
 * Service for vendor management operations.
 */
@Service
public class VendorService {

    @Autowired
    private VendorRepository vendorRepository;

    @Autowired
    private OrganizationRepository organizationRepository;

    @Transactional
    public VendorDTO createVendor(VendorDTO dto, Long userId) {
        if (vendorRepository.existsByEmail(dto.getEmail())) {
            throw new DuplicateResourceException("Vendor", "email", dto.getEmail());
        }

        Organization organization = organizationRepository.findById(dto.getOrganizationId())
                .orElseThrow(() -> new ResourceNotFoundException("Organization", "id", dto.getOrganizationId()));

        Vendor vendor = new Vendor();
        vendor.setName(dto.getName());
        vendor.setContactPerson(dto.getContactPerson());
        vendor.setEmail(dto.getEmail());
        vendor.setPhone(dto.getPhone());
        vendor.setAddress(dto.getAddress());
        vendor.setOrganization(organization);
        vendor.setContractDetails(dto.getContractDetails());
        vendor.setPaymentTerms(dto.getPaymentTerms());
        vendor.setComplianceDocuments(dto.getComplianceDocuments());
        vendor.setActive(true);

        vendor = vendorRepository.save(vendor);

        return convertToDTO(vendor);
    }

    public List<VendorDTO> getVendorsByOrganization(Long organizationId) {
        return vendorRepository.findByOrganizationId(organizationId).stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public VendorDTO getVendorById(Long id) {
        Vendor vendor = vendorRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Vendor", "id", id));
        return convertToDTO(vendor);
    }

    @Transactional
    public VendorDTO updateVendor(Long id, VendorDTO dto, Long userId) {
        Vendor vendor = vendorRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Vendor", "id", id));

        vendor.setName(dto.getName());
        vendor.setContactPerson(dto.getContactPerson());
        vendor.setPhone(dto.getPhone());
        vendor.setAddress(dto.getAddress());
        vendor.setContractDetails(dto.getContractDetails());
        vendor.setPaymentTerms(dto.getPaymentTerms());
        vendor.setComplianceDocuments(dto.getComplianceDocuments());

        vendor = vendorRepository.save(vendor);

        return convertToDTO(vendor);
    }

    private VendorDTO convertToDTO(Vendor vendor) {
        VendorDTO dto = new VendorDTO();
        dto.setId(vendor.getId());
        dto.setName(vendor.getName());
        dto.setContactPerson(vendor.getContactPerson());
        dto.setEmail(vendor.getEmail());
        dto.setPhone(vendor.getPhone());
        dto.setAddress(vendor.getAddress());
        dto.setOrganizationId(vendor.getOrganization().getId());
        dto.setContractDetails(vendor.getContractDetails());
        dto.setPaymentTerms(vendor.getPaymentTerms());
        dto.setComplianceDocuments(vendor.getComplianceDocuments());
        dto.setRating(vendor.getRating());
        dto.setActive(vendor.getActive());
        dto.setCreatedAt(vendor.getCreatedAt());
        return dto;
    }
}

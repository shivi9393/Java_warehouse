package com.warehouse.service;

import com.warehouse.dto.VendorDTO;
import com.warehouse.entity.Organization;
import com.warehouse.entity.Vendor;
import com.warehouse.exception.DuplicateResourceException;
import com.warehouse.exception.ResourceNotFoundException;
import com.warehouse.repository.OrganizationRepository;
import com.warehouse.repository.VendorRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyLong;
import static org.mockito.Mockito.*;

/**
 * Unit tests for VendorService.
 * Tests vendor onboarding and management operations.
 */
@ExtendWith(MockitoExtension.class)
class VendorServiceTest {

    @Mock
    private VendorRepository vendorRepository;

    @Mock
    private OrganizationRepository organizationRepository;

    @Mock
    private AuditService auditService;

    @InjectMocks
    private VendorService vendorService;

    private Organization testOrganization;
    private Vendor testVendor;
    private VendorDTO vendorDTO;

    @BeforeEach
    void setUp() {
        // Setup test organization
        testOrganization = new Organization();
        testOrganization.setId(1L);
        testOrganization.setName("Test Corp");

        // Setup test vendor
        testVendor = new Vendor();
        testVendor.setId(1L);
        testVendor.setName("ABC Suppliers");
        testVendor.setContactPerson("John Smith");
        testVendor.setEmail("contact@abcsuppliers.com");
        testVendor.setPhone("555-1234");
        testVendor.setAddress("123 Main St");
        testVendor.setOrganization(testOrganization);
        testVendor.setContractDetails("Standard contract");
        testVendor.setPaymentTerms("Net 30");
        testVendor.setActive(true);

        // Setup vendor DTO
        vendorDTO = new VendorDTO();
        vendorDTO.setName("XYZ Suppliers");
        vendorDTO.setContactPerson("Jane Doe");
        vendorDTO.setEmail("contact@xyzsuppliers.com");
        vendorDTO.setPhone("555-5678");
        vendorDTO.setAddress("456 Oak Ave");
        vendorDTO.setOrganizationId(1L);
        vendorDTO.setContractDetails("Premium contract");
        vendorDTO.setPaymentTerms("Net 45");
    }

    @Test
    void createVendor_Success() {
        // Arrange
        when(vendorRepository.existsByEmail(vendorDTO.getEmail())).thenReturn(false);
        when(organizationRepository.findById(1L)).thenReturn(Optional.of(testOrganization));
        when(vendorRepository.save(any(Vendor.class))).thenReturn(testVendor);

        // Act
        VendorDTO result = vendorService.createVendor(vendorDTO, 1L);

        // Assert
        assertNotNull(result);
        assertEquals(testVendor.getId(), result.getId());
        assertEquals(testVendor.getName(), result.getName());
        verify(vendorRepository).save(any(Vendor.class));
        verify(auditService).logAction(eq(1L), eq(1L), eq("CREATE"), eq("Vendor"), anyLong(), isNull());
    }

    @Test
    void createVendor_DuplicateEmail_ThrowsException() {
        // Arrange
        when(vendorRepository.existsByEmail(vendorDTO.getEmail())).thenReturn(true);

        // Act & Assert
        assertThrows(DuplicateResourceException.class, () -> {
            vendorService.createVendor(vendorDTO, 1L);
        });

        verify(vendorRepository, never()).save(any(Vendor.class));
    }

    @Test
    void createVendor_OrganizationNotFound_ThrowsException() {
        // Arrange
        when(vendorRepository.existsByEmail(vendorDTO.getEmail())).thenReturn(false);
        when(organizationRepository.findById(1L)).thenReturn(Optional.empty());

        // Act & Assert
        assertThrows(ResourceNotFoundException.class, () -> {
            vendorService.createVendor(vendorDTO, 1L);
        });

        verify(vendorRepository, never()).save(any(Vendor.class));
    }

    @Test
    void getVendorsByOrganization_Success() {
        // Arrange
        List<Vendor> vendors = Arrays.asList(testVendor);
        when(vendorRepository.findByOrganizationId(1L)).thenReturn(vendors);

        // Act
        List<VendorDTO> result = vendorService.getVendorsByOrganization(1L);

        // Assert
        assertNotNull(result);
        assertEquals(1, result.size());
        assertEquals(testVendor.getName(), result.get(0).getName());
        assertEquals(testVendor.getEmail(), result.get(0).getEmail());
    }

    @Test
    void getVendorById_Success() {
        // Arrange
        when(vendorRepository.findById(1L)).thenReturn(Optional.of(testVendor));

        // Act
        VendorDTO result = vendorService.getVendorById(1L);

        // Assert
        assertNotNull(result);
        assertEquals(testVendor.getId(), result.getId());
        assertEquals(testVendor.getName(), result.getName());
        assertEquals(testVendor.getEmail(), result.getEmail());
    }

    @Test
    void getVendorById_NotFound_ThrowsException() {
        // Arrange
        when(vendorRepository.findById(1L)).thenReturn(Optional.empty());

        // Act & Assert
        assertThrows(ResourceNotFoundException.class, () -> {
            vendorService.getVendorById(1L);
        });
    }

    @Test
    void updateVendor_Success() {
        // Arrange
        when(vendorRepository.findById(1L)).thenReturn(Optional.of(testVendor));
        when(vendorRepository.save(any(Vendor.class))).thenReturn(testVendor);

        // Act
        VendorDTO result = vendorService.updateVendor(1L, vendorDTO, 2L);

        // Assert
        assertNotNull(result);
        verify(vendorRepository).save(any(Vendor.class));
        verify(auditService).logAction(eq(2L), eq(1L), eq("UPDATE"), eq("Vendor"), eq(1L), isNull());
    }

    @Test
    void updateVendor_NotFound_ThrowsException() {
        // Arrange
        when(vendorRepository.findById(1L)).thenReturn(Optional.empty());

        // Act & Assert
        assertThrows(ResourceNotFoundException.class, () -> {
            vendorService.updateVendor(1L, vendorDTO, 2L);
        });

        verify(vendorRepository, never()).save(any(Vendor.class));
    }
}

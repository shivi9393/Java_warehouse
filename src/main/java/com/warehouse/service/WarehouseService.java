package com.warehouse.service;

import com.warehouse.dto.StorageZoneDTO;
import com.warehouse.dto.WarehouseDTO;
import com.warehouse.entity.*;
import com.warehouse.exception.DuplicateResourceException;
import com.warehouse.exception.ResourceNotFoundException;
import com.warehouse.repository.OrganizationRepository;
import com.warehouse.repository.UserRepository;
import com.warehouse.repository.WarehouseRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

/**
 * Service for warehouse management operations.
 */
@Service
public class WarehouseService {

    @Autowired
    private WarehouseRepository warehouseRepository;

    @Autowired
    private OrganizationRepository organizationRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private AuditService auditService;

    @Transactional
    public WarehouseDTO createWarehouse(WarehouseDTO dto, Long userId) {
        Organization organization = organizationRepository.findById(dto.getOrganizationId())
                .orElseThrow(() -> new ResourceNotFoundException("Organization", "id", dto.getOrganizationId()));

        Warehouse warehouse = new Warehouse();
        warehouse.setName(dto.getName());
        warehouse.setLocation(dto.getLocation());
        warehouse.setCapacity(dto.getCapacity());
        warehouse.setOrganization(organization);
        warehouse.setActive(true);

        if (dto.getManagerId() != null) {
            User manager = userRepository.findById(dto.getManagerId())
                    .orElseThrow(() -> new ResourceNotFoundException("User", "id", dto.getManagerId()));
            warehouse.setManager(manager);
        }

        warehouse = warehouseRepository.save(warehouse);

        auditService.logAction(userId, organization.getId(), "CREATE", "Warehouse", warehouse.getId(), null);

        return convertToDTO(warehouse);
    }

    @Transactional
    public StorageZoneDTO addStorageZone(Long warehouseId, StorageZoneDTO dto, Long userId) {
        Warehouse warehouse = warehouseRepository.findById(warehouseId)
                .orElseThrow(() -> new ResourceNotFoundException("Warehouse", "id", warehouseId));

        StorageZone zone = new StorageZone();
        zone.setName(dto.getName());
        zone.setWarehouse(warehouse);
        zone.setCapacity(dto.getCapacity());
        zone.setCurrentUtilization(0);
        zone.setZoneType(dto.getZoneType());

        warehouse.getZones().add(zone);
        warehouseRepository.save(warehouse);

        auditService.logAction(userId, warehouse.getOrganization().getId(),
                "CREATE", "StorageZone", zone.getId(), null);

        return convertZoneToDTO(zone);
    }

    public List<WarehouseDTO> getWarehousesByOrganization(Long organizationId) {
        return warehouseRepository.findByOrganizationId(organizationId).stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public WarehouseDTO getWarehouseById(Long id) {
        Warehouse warehouse = warehouseRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Warehouse", "id", id));
        return convertToDTO(warehouse);
    }

    @Transactional
    public WarehouseDTO updateWarehouse(Long id, WarehouseDTO dto, Long userId) {
        Warehouse warehouse = warehouseRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Warehouse", "id", id));

        warehouse.setName(dto.getName());
        warehouse.setLocation(dto.getLocation());
        warehouse.setCapacity(dto.getCapacity());

        if (dto.getManagerId() != null) {
            User manager = userRepository.findById(dto.getManagerId())
                    .orElseThrow(() -> new ResourceNotFoundException("User", "id", dto.getManagerId()));
            warehouse.setManager(manager);
        }

        warehouse = warehouseRepository.save(warehouse);

        auditService.logAction(userId, warehouse.getOrganization().getId(),
                "UPDATE", "Warehouse", warehouse.getId(), null);

        return convertToDTO(warehouse);
    }

    private WarehouseDTO convertToDTO(Warehouse warehouse) {
        WarehouseDTO dto = new WarehouseDTO();
        dto.setId(warehouse.getId());
        dto.setName(warehouse.getName());
        dto.setLocation(warehouse.getLocation());
        dto.setCapacity(warehouse.getCapacity());
        dto.setOrganizationId(warehouse.getOrganization().getId());
        dto.setOrganizationName(warehouse.getOrganization().getName());
        dto.setActive(warehouse.getActive());
        dto.setCreatedAt(warehouse.getCreatedAt());

        if (warehouse.getManager() != null) {
            dto.setManagerId(warehouse.getManager().getId());
            dto.setManagerName(warehouse.getManager().getFullName());
        }

        dto.setZones(warehouse.getZones().stream()
                .map(this::convertZoneToDTO)
                .collect(Collectors.toList()));

        return dto;
    }

    private StorageZoneDTO convertZoneToDTO(StorageZone zone) {
        StorageZoneDTO dto = new StorageZoneDTO();
        dto.setId(zone.getId());
        dto.setName(zone.getName());
        dto.setWarehouseId(zone.getWarehouse().getId());
        dto.setCapacity(zone.getCapacity());
        dto.setCurrentUtilization(zone.getCurrentUtilization());
        dto.setZoneType(zone.getZoneType());
        dto.setUtilizationPercentage(zone.getUtilizationPercentage());
        return dto;
    }
}

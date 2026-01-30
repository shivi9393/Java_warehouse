package com.warehouse.dto;

import com.warehouse.entity.UserRole;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

/**
 * DTO for User data transfer (excludes password).
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class UserDTO {

    private Long id;
    private String email;
    private String firstName;
    private String lastName;
    private UserRole role;
    private Long organizationId;
    private String organizationName;
    private Boolean active;
    private LocalDateTime createdAt;
}

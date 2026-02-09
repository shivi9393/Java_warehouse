package com.warehouse.service;

import com.warehouse.dto.CreateUserRequest;
import com.warehouse.dto.UserDTO;
import com.warehouse.entity.Organization;
import com.warehouse.entity.User;
import com.warehouse.entity.UserRole;
import com.warehouse.exception.DuplicateResourceException;
import com.warehouse.exception.ResourceNotFoundException;
import com.warehouse.repository.OrganizationRepository;
import com.warehouse.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyLong;
import static org.mockito.Mockito.*;

/**
 * Unit tests for UserService.
 * Tests user management operations including creation, retrieval, and
 * deactivation.
 */
@ExtendWith(MockitoExtension.class)
class UserServiceTest {

    @Mock
    private UserRepository userRepository;

    @Mock
    private OrganizationRepository organizationRepository;

    @Mock
    private PasswordEncoder passwordEncoder;

    @InjectMocks
    private UserService userService;

    private Organization testOrganization;
    private User testUser;
    private CreateUserRequest createUserRequest;

    @BeforeEach
    void setUp() {
        // Setup test organization
        testOrganization = new Organization();
        testOrganization.setId(1L);
        testOrganization.setName("Test Corp");

        // Setup test user
        testUser = new User();
        testUser.setId(1L);
        testUser.setEmail("test@example.com");
        testUser.setFirstName("John");
        testUser.setLastName("Doe");
        testUser.setRole(UserRole.WAREHOUSE_STAFF);
        testUser.setOrganization(testOrganization);
        testUser.setActive(true);

        // Setup create user request
        createUserRequest = new CreateUserRequest();
        createUserRequest.setEmail("newuser@example.com");
        createUserRequest.setPassword("password123");
        createUserRequest.setFirstName("Jane");
        createUserRequest.setLastName("Smith");
        createUserRequest.setRole(UserRole.WAREHOUSE_STAFF);
        createUserRequest.setOrganizationId(1L);
    }

    @Test
    void createUser_Success() {
        // Arrange
        when(userRepository.existsByEmail(createUserRequest.getEmail())).thenReturn(false);
        when(organizationRepository.findById(1L)).thenReturn(Optional.of(testOrganization));
        when(passwordEncoder.encode(anyString())).thenReturn("encodedPassword");
        when(userRepository.save(any(User.class))).thenReturn(testUser);

        // Act
        UserDTO result = userService.createUser(createUserRequest, 1L);

        // Assert
        assertNotNull(result);
        assertEquals(testUser.getId(), result.getId());
        assertEquals(testUser.getEmail(), result.getEmail());
        verify(userRepository).save(any(User.class));
    }

    @Test
    void createUser_DuplicateEmail_ThrowsException() {
        // Arrange
        when(userRepository.existsByEmail(createUserRequest.getEmail())).thenReturn(true);

        // Act & Assert
        assertThrows(DuplicateResourceException.class, () -> {
            userService.createUser(createUserRequest, 1L);
        });

        verify(userRepository, never()).save(any(User.class));
    }

    @Test
    void createUser_OrganizationNotFound_ThrowsException() {
        // Arrange
        when(userRepository.existsByEmail(createUserRequest.getEmail())).thenReturn(false);
        when(organizationRepository.findById(1L)).thenReturn(Optional.empty());

        // Act & Assert
        assertThrows(ResourceNotFoundException.class, () -> {
            userService.createUser(createUserRequest, 1L);
        });

        verify(userRepository, never()).save(any(User.class));
    }

    @Test
    void getUsersByOrganization_Success() {
        // Arrange
        List<User> users = Arrays.asList(testUser);
        when(userRepository.findByOrganizationId(1L)).thenReturn(users);

        // Act
        List<UserDTO> result = userService.getUsersByOrganization(1L);

        // Assert
        assertNotNull(result);
        assertEquals(1, result.size());
        assertEquals(testUser.getEmail(), result.get(0).getEmail());
    }

    @Test
    void getUserById_Success() {
        // Arrange
        when(userRepository.findById(1L)).thenReturn(Optional.of(testUser));

        // Act
        UserDTO result = userService.getUserById(1L);

        // Assert
        assertNotNull(result);
        assertEquals(testUser.getId(), result.getId());
        assertEquals(testUser.getEmail(), result.getEmail());
    }

    @Test
    void getUserById_NotFound_ThrowsException() {
        // Arrange
        when(userRepository.findById(1L)).thenReturn(Optional.empty());

        // Act & Assert
        assertThrows(ResourceNotFoundException.class, () -> {
            userService.getUserById(1L);
        });
    }

    @Test
    void deactivateUser_Success() {
        // Arrange
        when(userRepository.findById(1L)).thenReturn(Optional.of(testUser));
        when(userRepository.save(any(User.class))).thenReturn(testUser);

        // Act
        userService.deactivateUser(1L, 2L);

        // Assert
        verify(userRepository).save(argThat(user -> !user.getActive()));
    }

    @Test
    void deactivateUser_NotFound_ThrowsException() {
        // Arrange
        when(userRepository.findById(1L)).thenReturn(Optional.empty());

        // Act & Assert
        assertThrows(ResourceNotFoundException.class, () -> {
            userService.deactivateUser(1L, 2L);
        });

        verify(userRepository, never()).save(any(User.class));
    }
}

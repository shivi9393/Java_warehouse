package com.warehouse.service;

import com.warehouse.dto.AuthenticationRequest;
import com.warehouse.dto.AuthenticationResponse;
import com.warehouse.dto.RegistrationRequest;
import com.warehouse.entity.Organization;
import com.warehouse.entity.User;
import com.warehouse.entity.UserRole;
import com.warehouse.exception.DuplicateResourceException;
import com.warehouse.repository.OrganizationRepository;
import com.warehouse.repository.UserRepository;
import com.warehouse.security.JwtTokenProvider;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Service for authentication operations (login, registration).
 */
@Service
public class AuthenticationService {

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private OrganizationRepository organizationRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JwtTokenProvider tokenProvider;

    /**
     * Authenticate user and generate JWT token.
     */
    public AuthenticationResponse login(AuthenticationRequest request) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        request.getEmail(),
                        request.getPassword()));

        SecurityContextHolder.getContext().setAuthentication(authentication);
        String token = tokenProvider.generateToken(authentication);

        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new RuntimeException("User not found"));

        // Login successful

        return new AuthenticationResponse(
                token,
                user.getId(),
                user.getEmail(),
                user.getRole().name(),
                user.getOrganization().getId(),
                user.getOrganization().getName());
    }

    /**
     * Register new organization with admin user.
     */
    @Transactional
    public AuthenticationResponse register(RegistrationRequest request) {
        // Check if organization already exists
        if (organizationRepository.existsByName(request.getOrganizationName())) {
            throw new DuplicateResourceException("Organization", "name", request.getOrganizationName());
        }

        if (organizationRepository.existsByContactEmail(request.getContactEmail())) {
            throw new DuplicateResourceException("Organization", "contactEmail", request.getContactEmail());
        }

        if (userRepository.existsByEmail(request.getAdminEmail())) {
            throw new DuplicateResourceException("User", "email", request.getAdminEmail());
        }

        // Create organization
        Organization organization = new Organization();
        organization.setName(request.getOrganizationName());
        organization.setContactEmail(request.getContactEmail());
        organization.setContactPhone(request.getContactPhone());
        organization.setAddress(request.getAddress());
        organization.setActive(true);
        organization = organizationRepository.save(organization);

        // Create admin user
        User admin = new User();
        admin.setEmail(request.getAdminEmail());
        admin.setPassword(passwordEncoder.encode(request.getPassword()));
        admin.setFirstName(request.getAdminFirstName());
        admin.setLastName(request.getAdminLastName());
        admin.setRole(UserRole.COMPANY_ADMIN);
        admin.setOrganization(organization);
        admin.setActive(true);
        admin = userRepository.save(admin);

        // Generate token
        String token = tokenProvider.generateToken(admin.getEmail(), admin.getRole().name());

        // Organization created successfully

        return new AuthenticationResponse(
                token,
                admin.getId(),
                admin.getEmail(),
                admin.getRole().name(),
                organization.getId(),
                organization.getName());
    }
}

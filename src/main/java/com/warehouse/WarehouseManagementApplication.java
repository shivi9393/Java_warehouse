package com.warehouse;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.builder.SpringApplicationBuilder;
import org.springframework.boot.web.servlet.support.SpringBootServletInitializer;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;
import org.springframework.data.mongodb.config.EnableMongoAuditing;

/**
 * Main application class for Warehouse Management SaaS platform.
 * Extends SpringBootServletInitializer for Tomcat deployment compatibility.
 */
@SpringBootApplication
@EnableJpaAuditing
@EnableMongoAuditing
public class WarehouseManagementApplication extends SpringBootServletInitializer {

    @Override
    protected SpringApplicationBuilder configure(SpringApplicationBuilder application) {
        return application.sources(WarehouseManagementApplication.class);
    }

    public static void main(String[] args) {
        SpringApplication.run(WarehouseManagementApplication.class, args);
    }
}

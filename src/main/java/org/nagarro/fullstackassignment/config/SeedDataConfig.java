package org.nagarro.fullstackassignment.config;

import org.nagarro.fullstackassignment.model.AppUser;
import org.nagarro.fullstackassignment.model.Role;
import org.nagarro.fullstackassignment.repository.AppUserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

@Configuration
public class SeedDataConfig {

    @Bean
    CommandLineRunner seedUsers(AppUserRepository userRepository, PasswordEncoder passwordEncoder) {
        return args -> {
            AppUser customer = userRepository.findByUsername("customer1").orElse(null);
            if (customer == null) {
                AppUser newCustomer = new AppUser();
                newCustomer.setUsername("customer1");
                newCustomer.setPassword(passwordEncoder.encode("Customer@123"));
                newCustomer.setRole(Role.CUSTOMER);
                newCustomer.setEmail("customer1@justeat.test");
                userRepository.save(newCustomer);
            } else if (customer.getEmail() == null || customer.getEmail().isBlank()) {
                customer.setEmail("customer1@justeat.test");
                userRepository.save(customer);
            }

            AppUser owner = userRepository.findByUsername("owner1").orElse(null);
            if (owner == null) {
                AppUser newOwner = new AppUser();
                newOwner.setUsername("owner1");
                newOwner.setPassword(passwordEncoder.encode("Owner@123"));
                newOwner.setRole(Role.OWNER);
                newOwner.setEmail("owner1@justeat.test");
                userRepository.save(newOwner);
            } else if (owner.getEmail() == null || owner.getEmail().isBlank()) {
                owner.setEmail("owner1@justeat.test");
                userRepository.save(owner);
            }
        };
    }
}


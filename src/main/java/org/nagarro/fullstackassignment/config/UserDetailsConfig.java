package org.nagarro.fullstackassignment.config;

import org.nagarro.fullstackassignment.repository.AppUserRepository;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;

import java.util.List;

@Configuration
public class UserDetailsConfig {

    @Bean
    UserDetailsService userDetailsService(AppUserRepository userRepository) {
        return identifier -> {
            // Try to find by username first, then by email
            return userRepository.findByUsername(identifier)
                    .or(() -> userRepository.findByEmailIgnoreCase(identifier.toLowerCase()))
                    .map(u -> new User(
                            u.getUsername(),
                            u.getPassword(),
                            List.of(new SimpleGrantedAuthority("ROLE_" + u.getRole().name()))
                    ))
                    .orElseThrow(() -> new UsernameNotFoundException("User not found"));
        };
    }
}


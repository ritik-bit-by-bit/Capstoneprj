package org.nagarro.fullstackassignment.service;

import org.nagarro.fullstackassignment.model.AppUser;
import org.nagarro.fullstackassignment.repository.AppUserRepository;
import org.springframework.stereotype.Service;

@Service
public class CurrentUserService {

    private final AppUserRepository userRepository;

    public CurrentUserService(AppUserRepository userRepository) {
        this.userRepository = userRepository;
    }

    public AppUser findByUsername(String username) {
        return userRepository.findByUsername(username).orElseThrow(() -> new IllegalArgumentException("User not found"));
    }
}


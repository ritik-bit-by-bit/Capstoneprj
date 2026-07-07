package org.nagarro.fullstackassignment.repository;

import org.nagarro.fullstackassignment.model.PasswordResetToken;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface PasswordResetTokenRepository extends JpaRepository<PasswordResetToken, Long> {
    Optional<PasswordResetToken> findByTokenAndUsername(String token, String username);
    void deleteByUsername(String username);
}


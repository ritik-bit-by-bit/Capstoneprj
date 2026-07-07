package org.nagarro.fullstackassignment.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Email;

public class AuthDtos {

    public record RegisterRequest(
            @NotBlank String username,
            @NotBlank String password,
            @NotBlank String role,
            @Email @NotBlank String email
    ) {
    }

    public record LoginRequest(
            @NotBlank
            @Schema(description = "Username or Email", example = "john OR john@example.com")
            String username,

            @NotBlank
            @Schema(description = "Password", example = "John@1234")
            String password
    ) {
    }

    public record AuthResponse(String token, String role, String redirectPath) {
    }

    public record PasswordResetRequest(@NotBlank String email) {
    }

    public record PasswordResetConfirmRequest(@Email @NotBlank String email,
                                              @NotBlank String otp,
                                              @NotBlank String newPassword) {
    }

    public record PasswordResetTokenResponse(String message) {
    }
}


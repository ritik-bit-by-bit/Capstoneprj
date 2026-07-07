package org.nagarro.fullstackassignment.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.nagarro.fullstackassignment.dto.AuthDtos;
import org.nagarro.fullstackassignment.service.AuthService;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/auth")
@Tag(name = "Authentication", description = "User registration, login, and password reset operations")
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @PostMapping("/register")
    @ResponseStatus(HttpStatus.CREATED)
    @Operation(
        summary = "Register a new user",
        description = "Create a new user account as either CUSTOMER or OWNER"
    )
    @ApiResponses(value = {
        @ApiResponse(responseCode = "201", description = "User registered successfully"),
        @ApiResponse(responseCode = "400", description = "Invalid input or user already exists", content = @Content)
    })
    public void register(@Valid @RequestBody AuthDtos.RegisterRequest request) {
        authService.register(request);
    }

    @PostMapping("/login")
    @Operation(
        summary = "Login to the system",
        description = "Authenticate user with username OR email and password, receive JWT token for subsequent requests"
    )
    @ApiResponses(value = {
        @ApiResponse(
            responseCode = "200",
            description = "Login successful, JWT token returned",
            content = @Content(schema = @Schema(implementation = AuthDtos.AuthResponse.class))
        ),
        @ApiResponse(responseCode = "401", description = "Invalid credentials", content = @Content)
    })
    public AuthDtos.AuthResponse login(@Valid @RequestBody AuthDtos.LoginRequest request) {
        return authService.login(request);
    }

    @PostMapping("/password-reset/request")
    @Operation(
        summary = "Request password reset OTP",
        description = "Send OTP to user's email for password reset"
    )
    @ApiResponses(value = {
        @ApiResponse(
            responseCode = "200",
            description = "OTP sent successfully",
            content = @Content(schema = @Schema(implementation = AuthDtos.PasswordResetTokenResponse.class))
        ),
        @ApiResponse(responseCode = "404", description = "User not found", content = @Content)
    })
    public AuthDtos.PasswordResetTokenResponse requestPasswordReset(@Valid @RequestBody AuthDtos.PasswordResetRequest request) {
        return authService.createResetToken(request);
    }

    @PostMapping("/password-reset/confirm")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    @Operation(
        summary = "Confirm password reset with OTP",
        description = "Reset password using OTP received via email"
    )
    @ApiResponses(value = {
        @ApiResponse(responseCode = "204", description = "Password reset successful"),
        @ApiResponse(responseCode = "400", description = "Invalid or expired OTP", content = @Content)
    })
    public void confirmPasswordReset(@Valid @RequestBody AuthDtos.PasswordResetConfirmRequest request) {
        authService.confirmReset(request);
    }
}


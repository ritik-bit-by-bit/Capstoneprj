package org.nagarro.fullstackassignment.service;

import org.nagarro.fullstackassignment.dto.AuthDtos;
import org.nagarro.fullstackassignment.model.AppUser;
import org.nagarro.fullstackassignment.model.PasswordResetToken;
import org.nagarro.fullstackassignment.model.Role;
import org.nagarro.fullstackassignment.repository.AppUserRepository;
import org.nagarro.fullstackassignment.repository.PasswordResetTokenRepository;
import org.nagarro.fullstackassignment.security.JwtService;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.mail.MailException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.beans.factory.annotation.Value;

import java.security.SecureRandom;
import java.time.LocalDateTime;
import java.util.Locale;

@Service
@Transactional
public class AuthService {

    private final AppUserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;
    private final JwtService jwtService;
    private final PasswordResetTokenRepository passwordResetTokenRepository;
    private final EmailService emailService;
    private final int otpExpiryMinutes;
    private final SecureRandom secureRandom = new SecureRandom();

    public AuthService(AppUserRepository userRepository,
                       PasswordEncoder passwordEncoder,
                       AuthenticationManager authenticationManager,
                       JwtService jwtService,
                       PasswordResetTokenRepository passwordResetTokenRepository,
                       EmailService emailService,
                       @Value("${app.password-reset.otp-expiry-minutes:10}") int otpExpiryMinutes) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.authenticationManager = authenticationManager;
        this.jwtService = jwtService;
        this.passwordResetTokenRepository = passwordResetTokenRepository;
        this.emailService = emailService;
        this.otpExpiryMinutes = otpExpiryMinutes;
    }

    public void register(AuthDtos.RegisterRequest request) {
        String normalizedEmail = normalizeEmail(request.email());

        userRepository.findByUsername(request.username()).ifPresent(v -> {
            throw new IllegalArgumentException("Username already exists");
        });
        if (userRepository.existsByEmailIgnoreCase(normalizedEmail)) {
            throw new IllegalArgumentException("Email already exists");
        }
        if (!PasswordPolicy.isValid(request.password())) {
            throw new IllegalArgumentException("Password does not meet complexity rules");
        }

        AppUser user = new AppUser();
        user.setUsername(request.username());
        user.setPassword(passwordEncoder.encode(request.password()));
        user.setRole(Role.valueOf(request.role().toUpperCase()));
        user.setEmail(normalizedEmail);
        userRepository.save(user);
    }

    public AuthDtos.AuthResponse login(AuthDtos.LoginRequest request) {
        // Authenticate with the identifier (username or email)
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.username(), request.password())
        );

        // Find user by username or email
        AppUser user = userRepository.findByUsername(request.username())
                .or(() -> userRepository.findByEmailIgnoreCase(request.username().toLowerCase()))
                .orElseThrow(() -> new IllegalArgumentException("Invalid credentials"));

        String redirectPath = user.getRole() == Role.CUSTOMER ? "/customer" : "/owner";
        return new AuthDtos.AuthResponse(jwtService.generateToken(user), user.getRole().name(), redirectPath);
    }

    public AuthDtos.PasswordResetTokenResponse createResetToken(AuthDtos.PasswordResetRequest request) {
        String identifier = request.email() == null ? "" : request.email().trim();
        if (identifier.isBlank()) {
            throw new IllegalArgumentException("Email or username is required");
        }

        AppUser user = userRepository.findByEmailIgnoreCase(identifier)
                .or(() -> userRepository.findByUsername(identifier))
                .orElseThrow(() -> new IllegalArgumentException("No account found for this email or username"));

        if (user.getEmail() == null || user.getEmail().isBlank()) {
            throw new IllegalArgumentException("Account email is missing. Please contact support or update your profile email.");
        }

        String normalizedEmail = normalizeEmail(user.getEmail());

        passwordResetTokenRepository.deleteByUsername(normalizedEmail);

        String otp = String.format("%06d", secureRandom.nextInt(1_000_000));

        PasswordResetToken token = new PasswordResetToken();
        token.setToken(otp);
        token.setUsername(normalizedEmail);
        token.setExpiresAt(LocalDateTime.now().plusMinutes(otpExpiryMinutes));
        passwordResetTokenRepository.save(token);

        try {
            emailService.sendPasswordResetOtp(normalizedEmail, user.getUsername(), otp);
        } catch (MailException ex) {
            throw new IllegalStateException("Unable to send OTP email. Please verify mail configuration and try again.");
        }

        return new AuthDtos.PasswordResetTokenResponse("OTP sent to your email");
    }

    public void confirmReset(AuthDtos.PasswordResetConfirmRequest request) {
        String normalizedEmail = normalizeEmail(request.email());

        PasswordResetToken token = passwordResetTokenRepository.findByTokenAndUsername(request.otp(), normalizedEmail)
                .orElseThrow(() -> new IllegalArgumentException("Invalid OTP"));

        if (token.isUsed() || token.getExpiresAt().isBefore(LocalDateTime.now())) {
            throw new IllegalArgumentException("Token expired or used");
        }
        if (!PasswordPolicy.isValid(request.newPassword())) {
            throw new IllegalArgumentException("Password does not meet complexity rules");
        }

        AppUser user = userRepository.findByEmailIgnoreCase(normalizedEmail)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));
        user.setPassword(passwordEncoder.encode(request.newPassword()));

        token.setUsed(true);
    }

    private String normalizeEmail(String email) {
        return email.trim().toLowerCase(Locale.ROOT);
    }
}

package com.evenza.common.auth;

import com.evenza.common.auth.dto.AuthResponse;
import com.evenza.common.auth.dto.LoginRequest;
import com.evenza.common.auth.dto.RegisterRequest;
import com.evenza.common.user.User;
import com.evenza.common.user.UserRepository;
import com.evenza.common.user.UserRole;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Locale;

@Service
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public AuthService(
            UserRepository userRepository,
            PasswordEncoder passwordEncoder) {

        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    // Creates a customer account with an encrypted password.
    @Transactional
    public AuthResponse register(RegisterRequest request) {
        String name = request.name().trim();
        String email = normalizeEmail(request.email());

        if (userRepository.existsByEmailIgnoreCase(email)) {
            throw new IllegalArgumentException(
                    "An account already exists with this email"
            );
        }

        User user = new User();
        user.setName(name);
        user.setEmail(email);
        user.setPassword(passwordEncoder.encode(request.password()));
        user.setRole(UserRole.CUSTOMER);
        user.setPhone(cleanPhone(request.phone()));

        return toResponse(userRepository.save(user));
    }

    // Checks the supplied email and password.
    @Transactional
    public User authenticate(LoginRequest request) {
        String email = normalizeEmail(request.email());

        User user = userRepository.findByEmailIgnoreCase(email)
                .orElseThrow(() ->
                        new IllegalArgumentException(
                                "Invalid email or password"
                        )
                );

        String storedPassword = user.getPassword();
        boolean passwordMatches =
                passwordEncoder.matches(request.password(), storedPassword);

        /*
         * Existing demo users may still have plain-text passwords.
         * If one successfully logs in, upgrade that password to BCrypt once.
         */
        if (!passwordMatches
                && storedPassword.equals(request.password())) {

            user.setPassword(
                    passwordEncoder.encode(request.password())
            );

            passwordMatches = true;
        }

        if (!passwordMatches) {
            throw new IllegalArgumentException(
                    "Invalid email or password"
            );
        }

        return user;
    }
    // Loads the currently logged-in user using their authenticated email.
    @Transactional(readOnly = true)
    public User findByEmailOrThrow(String email) {
        return userRepository.findByEmailIgnoreCase(email)
                .orElseThrow(() ->
                        new IllegalArgumentException(
                                "Authenticated user account was not found"
                        )
                );
    }

    public AuthResponse toResponse(User user) {
        return new AuthResponse(
                user.getId(),
                user.getName(),
                user.getEmail(),
                user.getRole()
        );
    }

    private String normalizeEmail(String email) {
        return email.trim().toLowerCase(Locale.ROOT);
    }

    private String cleanPhone(String phone) {
        if (phone == null || phone.isBlank()) {
            return null;
        }

        return phone.trim();
    }
}
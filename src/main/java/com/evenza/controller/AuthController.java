package com.evenza.controller;

import jakarta.validation.Valid;
import com.evenza.dto.AuthDTOs.LoginRequest;
import com.evenza.dto.AuthDTOs.RegisterRequest;
import com.evenza.dto.AuthDTOs.AuthResponse;
import com.evenza.entity.User;
import com.evenza.repository.UserRepository;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public AuthController(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @PostMapping("/register")
    @Transactional
    public ResponseEntity<?> register(@Valid @RequestBody RegisterRequest request) {
        try {
            String cleanEmail = request.getEmail().trim().toLowerCase();

            if (userRepository.existsByEmailIgnoreCase(cleanEmail)) {
                return ResponseEntity.status(HttpStatus.CONFLICT)
                        .body("Email address '" + cleanEmail + "' is already in use.");
            }

            User user = new User();
            user.setFullName(request.getFullName().trim());
            user.setEmail(cleanEmail);
            user.setPassword(passwordEncoder.encode(request.getPassword()));
            user.setRole(request.getRole().trim());

            User saved = userRepository.saveAndFlush(user);

            String token = "jwt_" + UUID.randomUUID().toString();
            return ResponseEntity.status(HttpStatus.CREATED)
                    .body(new AuthResponse(token, saved.getId(), saved.getFullName(), saved.getEmail(), saved.getRole()));

        } catch (Exception ex) {
            ex.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Registration server error: " + ex.getMessage());
        }
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@Valid @RequestBody LoginRequest request) {
        try {
            String cleanEmail = request.getEmail().trim().toLowerCase();

            // Case-insensitive user lookup
            User user = userRepository.findByEmailIgnoreCase(cleanEmail).orElse(null);

            if (user == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body("No registered account found with that email address.");
            }

            // Verify password against stored BCrypt hash
            if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body("Incorrect password. Please try again.");
            }

            String token = "jwt_" + UUID.randomUUID().toString();
            return ResponseEntity.ok(new AuthResponse(token, user.getId(), user.getFullName(), user.getEmail(), user.getRole()));

        } catch (Exception ex) {
            ex.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Login server error: " + ex.getMessage());
        }
    }
}
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
    public ResponseEntity<?> register(@Valid @RequestBody RegisterRequest request) {
        try {
            // Check if email already exists
            if (userRepository.existsByEmail(request.getEmail())) {
                return ResponseEntity.status(HttpStatus.CONFLICT)
                        .body("Email address '" + request.getEmail() + "' is already in use.");
            }

            // Encode password with BCrypt
            String encodedPassword = passwordEncoder.encode(request.getPassword());

            // Instantiate User using standard constructor/setters
            User user = new User();
            user.setFullName(request.getFullName());
            user.setEmail(request.getEmail());
            user.setPassword(encodedPassword);
            user.setRole(request.getRole());

            User saved = userRepository.save(user);

            String token = "jwt_" + UUID.randomUUID().toString();
            return ResponseEntity.status(HttpStatus.CREATED)
                    .body(new AuthResponse(token, saved.getId(), saved.getFullName(), saved.getEmail(), saved.getRole()));

        } catch (Exception ex) {
            ex.printStackTrace(); // Prints exact error in Spring Boot terminal
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Registration server error: " + ex.getMessage());
        }
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@Valid @RequestBody LoginRequest request) {
        try {
            User user = userRepository.findByEmail(request.getEmail()).orElse(null);

            if (user == null || !passwordEncoder.matches(request.getPassword(), user.getPassword())) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body("Invalid email address or password.");
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
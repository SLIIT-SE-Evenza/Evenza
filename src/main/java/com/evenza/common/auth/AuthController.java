package com.evenza.common.auth;

import com.evenza.common.auth.dto.AuthResponse;
import com.evenza.common.auth.dto.LoginRequest;
import com.evenza.common.auth.dto.RegisterRequest;
import com.evenza.common.user.User;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpSession;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AnonymousAuthenticationToken;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.context.HttpSessionSecurityContextRepository;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    // Creates a new CUSTOMER account.
    @PostMapping("/register")
    public ResponseEntity<AuthResponse> register(
            @Valid @RequestBody RegisterRequest request) {

        AuthResponse response = authService.register(request);

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(response);
    }

    // Verifies the credentials and creates a secure server session.
    @PostMapping("/login")
    public AuthResponse login(
            @Valid @RequestBody LoginRequest request,
            HttpServletRequest servletRequest) {

        User user = authService.authenticate(request);

        SimpleGrantedAuthority authority =
                new SimpleGrantedAuthority(
                        "ROLE_" + user.getRole().name()
                );

        Authentication authentication =
                UsernamePasswordAuthenticationToken.authenticated(
                        user.getEmail(),
                        null,
                        List.of(authority)
                );

        SecurityContext context =
                SecurityContextHolder.createEmptyContext();

        context.setAuthentication(authentication);
        SecurityContextHolder.setContext(context);

        HttpSession session = servletRequest.getSession(true);

        // Changes the session ID after login to prevent session fixation.
        servletRequest.changeSessionId();

        session.setAttribute(
                HttpSessionSecurityContextRepository
                        .SPRING_SECURITY_CONTEXT_KEY,
                context
        );

        return authService.toResponse(user);
    }

    // Returns the user belonging to the current login session.
    @GetMapping("/me")
    public AuthResponse currentUser(Authentication authentication) {
        if (authentication == null
                || !authentication.isAuthenticated()
                || authentication instanceof AnonymousAuthenticationToken) {

            throw new ResponseStatusException(
                    HttpStatus.UNAUTHORIZED,
                    "You are not logged in"
            );
        }

        User user = authService.findByEmailOrThrow(
                authentication.getName()
        );

        return authService.toResponse(user);
    }

    // Invalidates the current server session.
    @PostMapping("/logout")
    public Map<String, String> logout(
            HttpServletRequest servletRequest) {

        HttpSession session = servletRequest.getSession(false);

        if (session != null) {
            session.invalidate();
        }

        SecurityContextHolder.clearContext();

        return Map.of("message", "Logged out successfully");
    }
}

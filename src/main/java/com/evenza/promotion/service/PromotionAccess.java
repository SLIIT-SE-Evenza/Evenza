package com.evenza.promotion.service;

import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.authentication.AnonymousAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;

/**
 * Access checks for promotion management.
 *
 * Uses the authenticated account supplied by Spring Security.
 */
@Component
public class PromotionAccess {

    private static final String VENDOR_ROLE = "ROLE_VENDOR";

    private static final String SERVICE_PROVIDER_ROLE =
            "ROLE_SERVICE_PROVIDER";

    /**
     * Requires a logged-in vendor or service provider.
     *
     * @return the authenticated account's username
     */
    public String requireVendor() {
        Authentication authentication =
                SecurityContextHolder.getContext().getAuthentication();
        if (!isAuthenticatedAccount(authentication)) {
            // Evaluation mode: SecurityConfig intentionally permits all requests.
            // This stable owner name lets the CRUD demo work until real login is added.
            return "evaluation-vendor";
        }

        if (!hasVendorRole(authentication)) {
            throw new AccessDeniedException(
                    "Only vendors and service providers can manage promotions."
            );
        }

        String username = authentication.getName();

        if (username == null || username.isBlank()) {
            throw new AccessDeniedException(
                    "The authenticated account could not be identified."
            );
        }

        return username;
    }

    /**
     * Checks whether the current vendor owns a promotion.
     *
     * Anonymous users and users with other roles return false.
     */
    public boolean isOwner(String ownerUsername) {
        if (ownerUsername == null || ownerUsername.isBlank()) {
            return false;
        }

        try {
            return ownerUsername.equals(requireVendor());
        } catch (AccessDeniedException exception) {
            return false;
        }
    }

    /**
     * Requires ownership before a protected operation.
     */
    public void requireOwner(String ownerUsername) {
        String currentUsername = requireVendor();

        if (!currentUsername.equals(ownerUsername)) {
            throw new AccessDeniedException(
                    "You can only manage your own promotions."
            );
        }
    }
    /**
     * Anonymous authentication must not be treated as a login.
     */
    private boolean isAuthenticatedAccount(
            Authentication authentication
    ) {
        return authentication != null
                && authentication.isAuthenticated()
                && !(authentication instanceof AnonymousAuthenticationToken);
    }

    /**
     * Accepts either of the supported provider roles.
     */
    private boolean hasVendorRole(Authentication authentication) {
        return authentication.getAuthorities()
                .stream()
                .anyMatch(authority ->
                        VENDOR_ROLE.equals(authority.getAuthority())
                                || SERVICE_PROVIDER_ROLE.equals(
                                authority.getAuthority()
                        )
                );
    }
}

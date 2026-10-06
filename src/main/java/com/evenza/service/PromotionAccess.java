package com.evenza.service;

import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.authentication.AnonymousAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;

/** Centralized role and ownership checks for Promotion management. */
@Component
public class PromotionAccess {

    private static final String VENDOR_ROLE = "ROLE_VENDOR";
    private static final String ADMIN_ROLE = "ROLE_ADMIN";

    /**
     * Requires a logged-in vendor or administrator and returns the account email.
     * The email is stored as the promotion owner username.
     */
    public String requireVendor() {
        Authentication authentication = currentAuthentication();

        if (!hasRole(authentication, VENDOR_ROLE)
                && !hasRole(authentication, ADMIN_ROLE)) {
            throw new AccessDeniedException(
                    "Only vendors and administrators can manage promotions."
            );
        }

        String username = authentication.getName();
        if (username == null || username.isBlank()) {
            throw new AccessDeniedException(
                    "The authenticated promotion account could not be identified."
            );
        }
        return username;
    }

    public boolean isAdmin() {
        Authentication authentication = SecurityContextHolder
                .getContext()
                .getAuthentication();

        return isAuthenticatedAccount(authentication)
                && hasRole(authentication, ADMIN_ROLE);
    }

    /** Administrators may inspect every promotion; vendors may inspect their own. */
    public boolean isOwner(String ownerUsername) {
        if (ownerUsername == null || ownerUsername.isBlank()) {
            return false;
        }
        if (isAdmin()) {
            return true;
        }

        try {
            return ownerUsername.equals(requireVendor());
        } catch (AccessDeniedException exception) {
            return false;
        }
    }

    /** Administrators may manage all promotions; vendors are ownership restricted. */
    public void requireOwner(String ownerUsername) {
        if (isAdmin()) {
            return;
        }

        String currentUsername = requireVendor();
        if (!currentUsername.equals(ownerUsername)) {
            throw new AccessDeniedException(
                    "You can only manage promotions created by your vendor account."
            );
        }
    }

    private Authentication currentAuthentication() {
        Authentication authentication = SecurityContextHolder
                .getContext()
                .getAuthentication();

        if (!isAuthenticatedAccount(authentication)) {
            throw new AccessDeniedException("Log in before managing promotions.");
        }
        return authentication;
    }

    private boolean isAuthenticatedAccount(Authentication authentication) {
        return authentication != null
                && authentication.isAuthenticated()
                && !(authentication instanceof AnonymousAuthenticationToken);
    }

    private boolean hasRole(Authentication authentication, String role) {
        return authentication.getAuthorities().stream()
                .anyMatch(authority -> role.equals(authority.getAuthority()));
    }
}

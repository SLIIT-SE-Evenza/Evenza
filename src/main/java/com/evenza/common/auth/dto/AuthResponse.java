package com.evenza.common.auth.dto;

import com.evenza.common.user.UserRole;

public record AuthResponse(
        Long id,
        String name,
        String email,
        UserRole role
) {
}
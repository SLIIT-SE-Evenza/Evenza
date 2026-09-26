package com.evenza.common.auth.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

public record RegisterRequest(

        @NotBlank(message = "Name is required")
        @Size(min = 2, max = 100, message = "Name must contain 2 to 100 characters")
        String name,

        @NotBlank(message = "Email is required")
        @Email(message = "Enter a valid email address")
        @Size(max = 150, message = "Email is too long")
        String email,

        @NotBlank(message = "Password is required")
        @Size(min = 8, max = 72, message = "Password must contain 8 to 72 characters")
        String password,

        @Pattern(
                regexp = "^$|^[0-9+\\- ]{7,20}$",
                message = "Enter a valid phone number"
        )
        String phone
) {
}
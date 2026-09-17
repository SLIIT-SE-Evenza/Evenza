package com.evenza.common.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
public class SecurityConfig {

    /*
     * IMPORTANT: this opens every endpoint to everyone — no login required.
     * This is ONLY acceptable because we're in early development and need
     * a working demo tonight. Real login/role-based access (per the
     * proposal's Security NFR) is planned work, not skipped permanently.
     */
    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
                .authorizeHttpRequests(auth -> auth.anyRequest().permitAll())
                .csrf(csrf -> csrf.disable()); // disabled so browser fetch() calls work without a CSRF token

        return http.build();
    }
}
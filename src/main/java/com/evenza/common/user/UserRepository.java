package com.evenza.common.user;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {

    // Used by existing Schedule module code.
    Optional<User> findByEmail(String email);

    // Used by authentication without email case sensitivity.
    Optional<User> findByEmailIgnoreCase(String email);

    // Prevents duplicate registrations with different letter cases.
    boolean existsByEmailIgnoreCase(String email);
}
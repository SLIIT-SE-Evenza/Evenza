package com.evenza.user.service;

import com.evenza.user.dto.UserRegistrationDto;
import com.evenza.user.entity.User;
import com.evenza.user.repository.UserRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public UserService(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    public void registerUser(UserRegistrationDto dto) {
        if (userRepository.findByEmail(dto.getEmail()).isPresent()) {
            throw new IllegalArgumentException("Email is already registered");
        }

        User user = new User(
                dto.getFirstName(),
                dto.getLastName(),
                dto.getEmail(),
                dto.getRole(),
                passwordEncoder.encode(dto.getPassword())
        );

        userRepository.save(user);
    }
}

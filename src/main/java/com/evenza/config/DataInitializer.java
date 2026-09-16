package com.evenza.config;

import com.evenza.entity.InventoryItem;
import com.evenza.entity.User;
import com.evenza.repository.InventoryRepository;
import com.evenza.repository.UserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.util.List;

@Component
public class DataInitializer implements CommandLineRunner {

    private final InventoryRepository inventoryRepo;
    private final UserRepository userRepo;
    private final PasswordEncoder encoder;

    public DataInitializer(InventoryRepository inventoryRepo, UserRepository userRepo, PasswordEncoder encoder) {
        this.inventoryRepo = inventoryRepo;
        this.userRepo = userRepo;
        this.encoder = encoder;
    }

    @Override
    public void run(String... args) {
        // Seed default accounts
        if (userRepo.count() == 0) {
            userRepo.save(User.builder()
                    .fullName("Keshavan M.")
                    .email("inventory@evenza.lk")
                    .password(encoder.encode("Password123!"))
                    .role("Inventory Staff")
                    .build());

            userRepo.save(User.builder()
                    .fullName("Amara Silva")
                    .email("customer@evenza.lk")
                    .password(encoder.encode("Password123!"))
                    .role("Customer")
                    .build());
        }

        // Seed initial warehouse inventory
        if (inventoryRepo.count() == 0) {
            inventoryRepo.saveAll(List.of(
                    InventoryItem.builder()
                            .sku("INV-1002")
                            .name("Banquet Velvet Chairs")
                            .category("Seating")
                            .totalQuantity(50)
                            .allocatedQuantity(42)
                            .minSafetyLimit(25)
                            .conditionStatus("Good")
                            .unitCost(BigDecimal.valueOf(1500))
                            .build(),
                    InventoryItem.builder()
                            .sku("INV-1044")
                            .name("Wireless Shure Mic Kit")
                            .category("AV Equipment")
                            .totalQuantity(10)
                            .allocatedQuantity(8)
                            .minSafetyLimit(5)
                            .conditionStatus("New")
                            .unitCost(BigDecimal.valueOf(12000))
                            .build(),
                    InventoryItem.builder()
                            .sku("INV-1090")
                            .name("LED Par Can Lights")
                            .category("Lighting")
                            .totalQuantity(20)
                            .allocatedQuantity(16)
                            .minSafetyLimit(12)
                            .conditionStatus("Needs Maintenance")
                            .unitCost(BigDecimal.valueOf(4500))
                            .build(),
                    InventoryItem.builder()
                            .sku("INV-1105")
                            .name("Round Wooden Dining Tables")
                            .category("Tables")
                            .totalQuantity(30)
                            .allocatedQuantity(10)
                            .minSafetyLimit(10)
                            .conditionStatus("Good")
                            .unitCost(BigDecimal.valueOf(8000))
                            .build()
            ));
        }
    }
}
package com.evenza.config;

import com.evenza.entity.Category;
import com.evenza.entity.InventoryItem;
import com.evenza.entity.User;
import com.evenza.repository.CategoryRepository;
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
    private final CategoryRepository categoryRepo;

    public DataInitializer(
            InventoryRepository inventoryRepo,
            UserRepository userRepo,
            PasswordEncoder encoder,
            CategoryRepository categoryRepo
    ) {
        this.inventoryRepo = inventoryRepo;
        this.userRepo = userRepo;
        this.encoder = encoder;
        this.categoryRepo = categoryRepo;
    }

    @Override
    public void run(String... args) {
        // 1. Seed default accounts
        if (userRepo.count() == 0) {
            User inventoryUser = new User();
            inventoryUser.setFullName("Keshavan M.");
            inventoryUser.setEmail("inventory@evenza.lk");
            inventoryUser.setPassword(encoder.encode("Password123!"));
            inventoryUser.setRole("Inventory Staff");
            userRepo.save(inventoryUser);

            User customerUser = new User();
            customerUser.setFullName("Amara Silva");
            customerUser.setEmail("customer@evenza.lk");
            customerUser.setPassword(encoder.encode("Password123!"));
            customerUser.setRole("Customer");
            userRepo.save(customerUser);
        }

        // 2. Seed equipment categories
        if (categoryRepo.count() == 0) {
            categoryRepo.saveAll(List.of(
                new Category(null, "Seating", "Chairs, benches, and sofas"),
                new Category(null, "Tables", "Banquet, round, and dining tables"),
                new Category(null, "Lighting", "Stage, ambient, and spot lighting"),
                new Category(null, "AV Equipment", "Microphones, speakers, and amplifiers")
            ));
        }

        // 3. Seed initial warehouse inventory
        if (inventoryRepo.count() == 0) {
            inventoryRepo.saveAll(List.of(
                new InventoryItem(null, "INV-1002", "Banquet Velvet Chairs", "Seating", 50, 42, 25, "Good", BigDecimal.valueOf(1500)),
                new InventoryItem(null, "INV-1044", "Wireless Shure Mic Kit", "AV Equipment", 10, 8, 5, "New", BigDecimal.valueOf(12000)),
                new InventoryItem(null, "INV-1090", "LED Par Can Lights", "Lighting", 20, 16, 12, "Needs Maintenance", BigDecimal.valueOf(4500)),
                new InventoryItem(null, "INV-1105", "Round Wooden Dining Tables", "Tables", 30, 10, 10, "Good", BigDecimal.valueOf(8000))
            ));
        }
    }
}
package com.evenza.inventory.controller;

import com.evenza.inventory.entity.Category;
import com.evenza.inventory.repository.CategoryRepository;
import com.evenza.inventory.repository.InventoryRepository;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/inventory/categories")
public class CategoryController {

    private final CategoryRepository categoryRepository;
    private final InventoryRepository inventoryRepository;

    public CategoryController(CategoryRepository categoryRepository, InventoryRepository inventoryRepository) {
        this.categoryRepository = categoryRepository;
        this.inventoryRepository = inventoryRepository;
    }

    @GetMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'EVENT_MANAGER', 'INVENTORY_STAFF')")
    @Transactional(readOnly = true)
    public List<Category> getAllCategories() {
        return categoryRepository.findAll();
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    @PreAuthorize("hasAnyRole('ADMIN', 'INVENTORY_STAFF')")
    @Transactional
    public Category createCategory(@Valid @RequestBody Category category) {
        String name = category.getName().trim();

        if (categoryRepository.existsByNameIgnoreCase(name)) {
            throw new IllegalArgumentException("Category already exists: " + name);
        }

        category.setName(name);
        return categoryRepository.save(category);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    @PreAuthorize("hasAnyRole('ADMIN', 'INVENTORY_STAFF')")
    @Transactional
    public void deleteCategory(@PathVariable Long id) {
        Category category = categoryRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Category not found: " + id));

        if (!inventoryRepository.findByCategoryIgnoreCase(category.getName()).isEmpty()) {
            throw new IllegalArgumentException("Cannot delete category. It is being used by inventory items.");
        }

        categoryRepository.delete(category);
    }
}

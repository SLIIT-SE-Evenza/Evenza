package com.evenza.inventory.controller;

import com.evenza.inventory.entity.Category;
import com.evenza.inventory.repository.CategoryRepository;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.GetMapping;
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

    public CategoryController(CategoryRepository categoryRepository) {
        this.categoryRepository = categoryRepository;
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
}

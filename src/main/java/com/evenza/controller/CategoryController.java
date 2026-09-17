package com.evenza.controller;

import com.evenza.entity.Category;
import com.evenza.repository.CategoryRepository;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/inventory/categories")
public class CategoryController {

    private final CategoryRepository categoryRepository;

    public CategoryController(CategoryRepository categoryRepository) {
        this.categoryRepository = categoryRepository;
    }

    @GetMapping
    public ResponseEntity<List<Category>> getAllCategories() {
        return ResponseEntity.ok(categoryRepository.findAll());
    }

    @PostMapping
    @Transactional
    public ResponseEntity<?> createCategory(@Valid @RequestBody Category category) {
        if (categoryRepository.existsByNameIgnoreCase(category.getName().trim())) {
            return ResponseEntity.status(HttpStatus.CONFLICT)
                    .body("Category '" + category.getName() + "' already exists.");
        }
        category.setName(category.getName().trim());
        Category saved = categoryRepository.saveAndFlush(category);
        return ResponseEntity.status(HttpStatus.CREATED).body(saved);
    }
}
package com.evenza.controller;

import jakarta.validation.Valid;
import com.evenza.dto.InventoryDTOs.*;
import com.evenza.entity.InventoryItem;
import com.evenza.service.InventoryService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/inventory/items")
public class InventoryController {

    private final InventoryService inventoryService;

    public InventoryController(InventoryService inventoryService) {
        this.inventoryService = inventoryService;
    }

    @GetMapping
    public ResponseEntity<List<InventoryItem>> getAllItems() {
        return ResponseEntity.ok(inventoryService.getAllItems());
    }

    @GetMapping("/{id}")
    public ResponseEntity<InventoryItem> getItemById(@PathVariable Long id) {
        return ResponseEntity.ok(inventoryService.getItemById(id));
    }

    @PostMapping
    public ResponseEntity<InventoryItem> createItem(@Valid @RequestBody CreateItemRequest req) {
        return ResponseEntity.status(HttpStatus.CREATED).body(inventoryService.createItem(req));
    }

    @PostMapping("/{id}/adjust")
    public ResponseEntity<?> adjustStock(@PathVariable Long id, @RequestBody AdjustStockRequest req) {
        try {
            return ResponseEntity.ok(inventoryService.adjustStock(id, req));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PostMapping("/allocate")
    public ResponseEntity<?> allocateGear(@Valid @RequestBody AllocateGearRequest req) {
        try {
            return ResponseEntity.ok(inventoryService.allocateToEvent(req));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteItem(@PathVariable Long id) {
        try {
            inventoryService.deleteItem(id);
            return ResponseEntity.noContent().build();
        } catch (IllegalStateException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}
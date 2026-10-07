package com.evenza.inventory.controller;

import com.evenza.inventory.dto.InventoryDTOs.AdjustStockRequest;
import com.evenza.inventory.dto.InventoryDTOs.AllocateGearRequest;
import com.evenza.inventory.dto.InventoryDTOs.CreateItemRequest;
import com.evenza.inventory.entity.InventoryItem;
import com.evenza.inventory.service.InventoryService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
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
@RequestMapping("/api/inventory/items")
public class InventoryController {

    private final InventoryService inventoryService;

    public InventoryController(InventoryService inventoryService) {
        this.inventoryService = inventoryService;
    }

    @GetMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'EVENT_MANAGER', 'INVENTORY_STAFF')")
    public List<InventoryItem> getAllItems() {
        return inventoryService.getAllItems();
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'EVENT_MANAGER', 'INVENTORY_STAFF')")
    public InventoryItem getItemById(@PathVariable Long id) {
        return inventoryService.getItemById(id);
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    @PreAuthorize("hasAnyRole('ADMIN', 'INVENTORY_STAFF')")
    public InventoryItem createItem(@Valid @RequestBody CreateItemRequest request) {
        return inventoryService.createItem(request);
    }

    @PostMapping("/{id}/adjust")
    @PreAuthorize("hasAnyRole('ADMIN', 'INVENTORY_STAFF')")
    public InventoryItem adjustStock(
            @PathVariable Long id,
            @Valid @RequestBody AdjustStockRequest request) {

        return inventoryService.adjustStock(id, request);
    }

    @PostMapping("/allocate")
    @PreAuthorize("hasAnyRole('ADMIN', 'EVENT_MANAGER', 'INVENTORY_STAFF')")
    public InventoryItem allocateGear(@Valid @RequestBody AllocateGearRequest request) {
        return inventoryService.allocateToEvent(request);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    @PreAuthorize("hasAnyRole('ADMIN', 'INVENTORY_STAFF')")
    public void deleteItem(@PathVariable Long id) {
        inventoryService.deleteItem(id);
    }
}

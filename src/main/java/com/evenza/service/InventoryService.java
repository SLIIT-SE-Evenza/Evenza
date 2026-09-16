package com.evenza.service;

import com.evenza.dto.InventoryDTOs.*;
import com.evenza.entity.InventoryItem;
import com.evenza.repository.InventoryRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Random;

@Service
public class InventoryService {

    private final InventoryRepository inventoryRepository;

    public InventoryService(InventoryRepository inventoryRepository) {
        this.inventoryRepository = inventoryRepository;
    }

    public List<InventoryItem> getAllItems() {
        return inventoryRepository.findAll();
    }

    public InventoryItem getItemById(Long id) {
        return inventoryRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Inventory asset not found with ID: " + id));
    }

    @Transactional
    public InventoryItem createItem(CreateItemRequest req) {
        String generatedSku = req.getSku() != null && !req.getSku().isBlank()
                ? req.getSku()
                : "INV-" + (1000 + new Random().nextInt(9000));

        InventoryItem item = InventoryItem.builder()
                .sku(generatedSku)
                .name(req.getName())
                .category(req.getCategory())
                .totalQuantity(req.getTotalQuantity())
                .allocatedQuantity(0)
                .minSafetyLimit(req.getMinSafetyLimit() != null ? req.getMinSafetyLimit() : 5)
                .conditionStatus(req.getConditionStatus())
                .unitCost(req.getUnitCost())
                .build();

        return inventoryRepository.save(item);
    }

    @Transactional
    public InventoryItem adjustStock(Long id, AdjustStockRequest req) {
        InventoryItem item = getItemById(id);
        int newTotal = item.getTotalQuantity() + req.getDelta();

        // Prevent lowering below units already assigned to events (T-17.4)
        if (newTotal < item.getAllocatedQuantity()) {
            throw new IllegalArgumentException("Cannot reduce stock below currently allocated units (" + item.getAllocatedQuantity() + ")");
        }

        item.setTotalQuantity(newTotal);
        return inventoryRepository.save(item);
    }

    @Transactional
    public InventoryItem allocateToEvent(AllocateGearRequest req) {
        InventoryItem item = getItemById(req.getItemId());
        int available = item.getTotalQuantity() - item.getAllocatedQuantity();

        // Check available stock before allocation (T-18.3)
        if (req.getQuantity() > available) {
            throw new IllegalArgumentException("Insufficient inventory available. Remaining: " + available);
        }

        // Update allocated stock count (T-18.5)
        item.setAllocatedQuantity(item.getAllocatedQuantity() + req.getQuantity());
        return inventoryRepository.save(item);
    }

    @Transactional
    public void deleteItem(Long id) {
        InventoryItem item = getItemById(id);
        if (item.getAllocatedQuantity() > 0) {
            throw new IllegalStateException("Cannot delete an item that is currently allocated to active events.");
        }
        inventoryRepository.delete(item);
    }
}
package com.evenza.inventory.service;

import com.evenza.event.repository.EventRepository;
import com.evenza.inventory.dto.InventoryDTOs.AdjustStockRequest;
import com.evenza.inventory.dto.InventoryDTOs.AllocateGearRequest;
import com.evenza.inventory.dto.InventoryDTOs.CreateItemRequest;
import com.evenza.inventory.entity.Category;
import com.evenza.inventory.entity.InventoryItem;
import com.evenza.inventory.repository.CategoryRepository;
import com.evenza.inventory.repository.InventoryRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Locale;
import java.util.UUID;

@Service
public class InventoryService {

    private final InventoryRepository inventoryRepository;
    private final CategoryRepository categoryRepository;
    private final EventRepository eventRepository;

    public InventoryService(
            InventoryRepository inventoryRepository,
            CategoryRepository categoryRepository,
            EventRepository eventRepository) {

        this.inventoryRepository = inventoryRepository;
        this.categoryRepository = categoryRepository;
        this.eventRepository = eventRepository;
    }

    @Transactional(readOnly = true)
    public List<InventoryItem> getAllItems() {
        return inventoryRepository.findAll();
    }

    @Transactional(readOnly = true)
    public InventoryItem getItemById(Long id) {
        return inventoryRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException(
                        "Inventory item not found: " + id
                ));
    }

    @Transactional
    public InventoryItem createItem(CreateItemRequest request) {
        String sku = cleanSku(request.getSku());
        if (sku == null) {
            sku = generateUniqueSku();
        } else if (inventoryRepository.existsBySkuIgnoreCase(sku)) {
            throw new IllegalArgumentException("An inventory item already uses SKU " + sku);
        }

        String categoryName = request.getCategory().trim();
        Category category = categoryRepository.findByNameIgnoreCase(categoryName)
                .orElseThrow(() -> new IllegalArgumentException(
                        "Inventory category not found: " + categoryName
                ));

        InventoryItem item = new InventoryItem();
        item.setSku(sku);
        item.setName(request.getName().trim());
        item.setCategory(category.getName());
        item.setTotalQuantity(request.getTotalQuantity());
        item.setAllocatedQuantity(0);
        item.setMinSafetyLimit(
                request.getMinSafetyLimit() == null ? 5 : request.getMinSafetyLimit()
        );
        item.setConditionStatus(request.getConditionStatus().trim());
        item.setUnitCost(request.getUnitCost());

        return inventoryRepository.save(item);
    }

    @Transactional
    public InventoryItem adjustStock(Long id, AdjustStockRequest request) {
        if (request.getDelta() == 0) {
            throw new IllegalArgumentException("Stock adjustment cannot be zero");
        }

        InventoryItem item = getItemById(id);
        int newTotal = item.getTotalQuantity() + request.getDelta();

        if (newTotal < 0) {
            throw new IllegalArgumentException("Total stock cannot be negative");
        }

        if (newTotal < item.getAllocatedQuantity()) {
            throw new IllegalArgumentException(
                    "Cannot reduce stock below allocated units ("
                            + item.getAllocatedQuantity() + ")"
            );
        }

        item.setTotalQuantity(newTotal);
        return item; // JPA dirty checking saves the managed entity.
    }

    @Transactional
    public InventoryItem allocateToEvent(AllocateGearRequest request) {
        // Reuses the Event entity and repository already present in Evenza.
        if (!eventRepository.existsById(request.getEventId())) {
            throw new IllegalArgumentException("Event not found: " + request.getEventId());
        }

        InventoryItem item = getItemById(request.getItemId());
        int available = item.getTotalQuantity() - item.getAllocatedQuantity();

        if (request.getQuantity() > available) {
            throw new IllegalArgumentException(
                    "Insufficient inventory. Available quantity: " + available
            );
        }

        item.setAllocatedQuantity(item.getAllocatedQuantity() + request.getQuantity());
        return item;
    }

    @Transactional
    public void deleteItem(Long id) {
        InventoryItem item = getItemById(id);

        if (item.getAllocatedQuantity() > 0) {
            throw new IllegalArgumentException(
                    "Cannot delete an item currently allocated to an event"
            );
        }

        inventoryRepository.delete(item);
    }

    private String cleanSku(String value) {
        if (value == null || value.isBlank()) {
            return null;
        }
        return value.trim().toUpperCase(Locale.ROOT);
    }

    private String generateUniqueSku() {
        String sku;
        do {
            sku = "INV-" + UUID.randomUUID()
                    .toString()
                    .substring(0, 8)
                    .toUpperCase(Locale.ROOT);
        } while (inventoryRepository.existsBySkuIgnoreCase(sku));
        return sku;
    }
}

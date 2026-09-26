package com.evenza.inventory.repository;

import com.evenza.inventory.entity.InventoryItem;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface InventoryRepository extends JpaRepository<InventoryItem, Long> {
    Optional<InventoryItem> findBySkuIgnoreCase(String sku);
    boolean existsBySkuIgnoreCase(String sku);
    List<InventoryItem> findByCategoryIgnoreCase(String category);
}

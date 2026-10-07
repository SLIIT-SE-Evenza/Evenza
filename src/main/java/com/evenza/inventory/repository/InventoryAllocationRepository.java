package com.evenza.inventory.repository;

import com.evenza.inventory.entity.InventoryAllocation;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface InventoryAllocationRepository extends JpaRepository<InventoryAllocation, Long> {
    List<InventoryAllocation> findByEventId(Long eventId);
    List<InventoryAllocation> findByItemId(Long itemId);
}

package com.evenza.inventory.entity;

import com.evenza.event.entity.Event;
import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "inventory_allocations")
public class InventoryAllocation {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "item_id", nullable = false)
    private InventoryItem item;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "event_id", nullable = false)
    private Event event;

    @Column(nullable = false)
    private int quantity;

    @Column(name = "allocated_at", updatable = false)
    private LocalDateTime allocatedAt;

    public InventoryAllocation() {
    }

    public InventoryAllocation(InventoryItem item, Event event, int quantity) {
        this.item = item;
        this.event = event;
        this.quantity = quantity;
    }

    @PrePersist
    void onAllocate() {
        this.allocatedAt = LocalDateTime.now();
    }

    public Long getId() {
        return id;
    }

    public InventoryItem getItem() {
        return item;
    }

    public void setItem(InventoryItem item) {
        this.item = item;
    }

    public Event getEvent() {
        return event;
    }

    public void setEvent(Event event) {
        this.event = event;
    }

    public int getQuantity() {
        return quantity;
    }

    public void setQuantity(int quantity) {
        this.quantity = quantity;
    }

    public LocalDateTime getAllocatedAt() {
        return allocatedAt;
    }
}

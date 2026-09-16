package com.evenza.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import java.math.BigDecimal;

@Entity
@Table(name = "inventory_items")
public class InventoryItem {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank
    @Column(nullable = false, unique = true)
    private String sku;

    @NotBlank
    @Column(nullable = false)
    private String name;

    @NotBlank
    @Column(nullable = false)
    private String category;

    @Min(0)
    @Column(nullable = false)
    private Integer totalQuantity;

    @Min(0)
    @Column(nullable = false)
    private Integer allocatedQuantity;

    @Min(0)
    @Column(nullable = false)
    private Integer minSafetyLimit;

    @Column(nullable = false)
    private String conditionStatus;

    private BigDecimal unitCost;

    public InventoryItem() {}

    public InventoryItem(Long id, String sku, String name, String category, Integer totalQuantity, 
                         Integer allocatedQuantity, Integer minSafetyLimit, String conditionStatus, BigDecimal unitCost) {
        this.id = id;
        this.sku = sku;
        this.name = name;
        this.category = category;
        this.totalQuantity = totalQuantity;
        this.allocatedQuantity = allocatedQuantity;
        this.minSafetyLimit = minSafetyLimit;
        this.conditionStatus = conditionStatus;
        this.unitCost = unitCost;
    }

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getSku() { return sku; }
    public void setSku(String sku) { this.sku = sku; }
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public String getCategory() { return category; }
    public void setCategory(String category) { this.category = category; }
    public Integer getTotalQuantity() { return totalQuantity; }
    public void setTotalQuantity(Integer totalQuantity) { this.totalQuantity = totalQuantity; }
    public Integer getAllocatedQuantity() { return allocatedQuantity; }
    public void setAllocatedQuantity(Integer allocatedQuantity) { this.allocatedQuantity = allocatedQuantity; }
    public Integer getMinSafetyLimit() { return minSafetyLimit; }
    public void setMinSafetyLimit(Integer minSafetyLimit) { this.minSafetyLimit = minSafetyLimit; }
    public String getConditionStatus() { return conditionStatus; }
    public void setConditionStatus(String conditionStatus) { this.conditionStatus = conditionStatus; }
    public BigDecimal getUnitCost() { return unitCost; }
    public void setUnitCost(BigDecimal unitCost) { this.unitCost = unitCost; }

    public static InventoryItemBuilder builder() {
        return new InventoryItemBuilder();
    }

    public static class InventoryItemBuilder {
        private Long id;
        private String sku;
        private String name;
        private String category;
        private Integer totalQuantity = 0;
        private Integer allocatedQuantity = 0;
        private Integer minSafetyLimit = 5;
        private String conditionStatus = "Good";
        private BigDecimal unitCost;

        public InventoryItemBuilder id(Long id) { this.id = id; return this; }
        public InventoryItemBuilder sku(String sku) { this.sku = sku; return this; }
        public InventoryItemBuilder name(String name) { this.name = name; return this; }
        public InventoryItemBuilder category(String category) { this.category = category; return this; }
        public InventoryItemBuilder totalQuantity(Integer totalQuantity) { this.totalQuantity = totalQuantity; return this; }
        public InventoryItemBuilder allocatedQuantity(Integer allocatedQuantity) { this.allocatedQuantity = allocatedQuantity; return this; }
        public InventoryItemBuilder minSafetyLimit(Integer minSafetyLimit) { this.minSafetyLimit = minSafetyLimit; return this; }
        public InventoryItemBuilder conditionStatus(String conditionStatus) { this.conditionStatus = conditionStatus; return this; }
        public InventoryItemBuilder unitCost(BigDecimal unitCost) { this.unitCost = unitCost; return this; }

        public InventoryItem build() {
            return new InventoryItem(id, sku, name, category, totalQuantity, allocatedQuantity, minSafetyLimit, conditionStatus, unitCost);
        }
    }
}
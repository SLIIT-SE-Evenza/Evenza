package com.evenza.inventory.dto;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

import java.math.BigDecimal;

/** Request objects used by the Inventory REST API. */
public final class InventoryDTOs {

    private InventoryDTOs() {
    }

    public static class CreateItemRequest {
        @Size(max = 50)
        private String sku;

        @NotBlank
        @Size(max = 150)
        private String name;

        @NotBlank
        @Size(max = 100)
        private String category;

        @NotNull
        @Min(1)
        private Integer totalQuantity;

        @Min(0)
        private Integer minSafetyLimit;

        @NotBlank
        @Size(max = 30)
        private String conditionStatus;

        @DecimalMin(value = "0.0", inclusive = true)
        private BigDecimal unitCost;

        public CreateItemRequest() {
        }

        public String getSku() { return sku; }
        public void setSku(String sku) { this.sku = sku; }
        public String getName() { return name; }
        public void setName(String name) { this.name = name; }
        public String getCategory() { return category; }
        public void setCategory(String category) { this.category = category; }
        public Integer getTotalQuantity() { return totalQuantity; }
        public void setTotalQuantity(Integer totalQuantity) { this.totalQuantity = totalQuantity; }
        public Integer getMinSafetyLimit() { return minSafetyLimit; }
        public void setMinSafetyLimit(Integer minSafetyLimit) { this.minSafetyLimit = minSafetyLimit; }
        public String getConditionStatus() { return conditionStatus; }
        public void setConditionStatus(String conditionStatus) { this.conditionStatus = conditionStatus; }
        public BigDecimal getUnitCost() { return unitCost; }
        public void setUnitCost(BigDecimal unitCost) { this.unitCost = unitCost; }
    }

    public static class AdjustStockRequest {
        private int delta;

        @NotBlank
        @Size(max = 250)
        private String reason;

        public AdjustStockRequest() {
        }

        public int getDelta() { return delta; }
        public void setDelta(int delta) { this.delta = delta; }
        public String getReason() { return reason; }
        public void setReason(String reason) { this.reason = reason; }
    }

    public static class AllocateGearRequest {
        @NotNull
        private Long eventId;

        @NotNull
        private Long itemId;

        @Min(1)
        private int quantity;

        public AllocateGearRequest() {
        }

        public Long getEventId() { return eventId; }
        public void setEventId(Long eventId) { this.eventId = eventId; }
        public Long getItemId() { return itemId; }
        public void setItemId(Long itemId) { this.itemId = itemId; }
        public int getQuantity() { return quantity; }
        public void setQuantity(int quantity) { this.quantity = quantity; }
    }
}

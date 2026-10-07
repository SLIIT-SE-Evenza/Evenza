package com.evenza.singleton_demo;

import java.util.HashMap;
import java.util.Map;

/**
 * Classical Singleton Implementation (SLIIT SE2030)
 * 
 * Intent: Ensures only one centralized configuration manager exists
 * across the entire warehouse/inventory module and provides a global
 * point of access to it.
 */
public class InventoryConfigurationManager {

    // Declare a private static instance variable of the same class
    private static InventoryConfigurationManager instance;

    // Configuration settings state
    private int defaultSafetyStockThreshold;
    private double damagedEquipmentPenaltyRate;
    private String warehouseOperatingZone;
    private final Map<String, Integer> categoryDefaultLimits;

    // Make the constructor private to prevent direct instantiation
    private InventoryConfigurationManager() {
        // Initialize default global settings
        this.defaultSafetyStockThreshold = 10;
        this.damagedEquipmentPenaltyRate = 0.20; // 20% penalty fee
        this.warehouseOperatingZone = "Colombo Logistics Central (Zone-A)";
        this.categoryDefaultLimits = new HashMap<>();

        categoryDefaultLimits.put("Seating", 25);
        categoryDefaultLimits.put("Tables", 15);
        categoryDefaultLimits.put("Lighting", 12);
        categoryDefaultLimits.put("AV Equipment", 5);

        System.out.println(">> [InventoryConfigurationManager] New single instance initialized!");
    }

    // Provide a public static method to access the single instance
    public static synchronized InventoryConfigurationManager getInstance() {
        // Only create on the first call
        if (instance == null) {
            instance = new InventoryConfigurationManager();
        }
        return instance;
    }

    // Business helper methods
    public int getSafetyThresholdForCategory(String category) {
        return categoryDefaultLimits.getOrDefault(category, defaultSafetyStockThreshold);
    }

    public void updateSafetyThreshold(String category, int newLimit) {
        categoryDefaultLimits.put(category, newLimit);
    }

    public int getDefaultSafetyStockThreshold() {
        return defaultSafetyStockThreshold;
    }

    public void setDefaultSafetyStockThreshold(int defaultSafetyStockThreshold) {
        this.defaultSafetyStockThreshold = defaultSafetyStockThreshold;
    }

    public double getDamagedEquipmentPenaltyRate() {
        return damagedEquipmentPenaltyRate;
    }

    public void setDamagedEquipmentPenaltyRate(double damagedEquipmentPenaltyRate) {
        this.damagedEquipmentPenaltyRate = damagedEquipmentPenaltyRate;
    }

    public String getWarehouseOperatingZone() {
        return warehouseOperatingZone;
    }

    public void setWarehouseOperatingZone(String warehouseOperatingZone) {
        this.warehouseOperatingZone = warehouseOperatingZone;
    }
}
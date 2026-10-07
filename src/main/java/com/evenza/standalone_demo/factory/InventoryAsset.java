package com.evenza.standalone_demo.factory;

/**
 * Product Interface (Factory Pattern)
 */
public interface InventoryAsset {
    String getAssetType();
    boolean requiresElectricalInspection();
    double calculateMaintenanceReserve(int quantity);
    String getStorageGuidelines();
}
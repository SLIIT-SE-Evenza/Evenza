package com.evenza.standalone_demo.factory;

public class SeatingAsset implements InventoryAsset {
    @Override
    public String getAssetType() {
        return "FURNITURE_AND_SEATING";
    }

    @Override
    public boolean requiresElectricalInspection() {
        return false; // Visual structural check only
    }

    @Override
    public double calculateMaintenanceReserve(int quantity) {
        return quantity * 75.0; // Rs. 75 per chair/table
    }

    @Override
    public String getStorageGuidelines() {
        return "Store stacked in dry warehouse Zone A.";
    }
}
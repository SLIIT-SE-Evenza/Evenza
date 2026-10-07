package com.evenza.standalone_demo.factory;

public class LightingAsset implements InventoryAsset {
    @Override
    public String getAssetType() {
        return "STAGE_AND_RIG_LIGHTING";
    }

    @Override
    public boolean requiresElectricalInspection() {
        return true; // Requires voltage load and DMX validation
    }

    @Override
    public double calculateMaintenanceReserve(int quantity) {
        return quantity * 300.0; // Rs. 300 per fixture
    }

    @Override
    public String getStorageGuidelines() {
        return "Pack in padded road cases in Rigging Zone B.";
    }
}
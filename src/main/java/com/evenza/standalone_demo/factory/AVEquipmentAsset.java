package com.evenza.standalone_demo.factory;

public class AVEquipmentAsset implements InventoryAsset {
    @Override
    public String getAssetType() {
        return "AUDIO_VISUAL_ELECTRONICS";
    }

    @Override
    public boolean requiresElectricalInspection() {
        return true; // Requires frequency & impedance testing
    }

    @Override
    public double calculateMaintenanceReserve(int quantity) {
        return quantity * 750.0; // Rs. 750 per unit buffer
    }

    @Override
    public String getStorageGuidelines() {
        return "Store in climate-controlled audio rack Zone C.";
    }
}
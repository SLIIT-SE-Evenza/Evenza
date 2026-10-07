package com.evenza.standalone_demo.factory;

/**
 * Classical GoF Factory Class (SE2030 Lecture 08)
 */
public class InventoryAssetFactory {

    public static InventoryAsset createAsset(String category) {
        if (category == null || category.trim().isEmpty()) {
            return new SeatingAsset(); // Default fallback
        }

        switch (category.toUpperCase().trim()) {
            case "SEATING":
            case "TABLES":
            case "FURNITURE":
                return new SeatingAsset();

            case "AV EQUIPMENT":
            case "AV":
            case "AUDIO":
                return new AVEquipmentAsset();

            case "LIGHTING":
            case "RIGGING":
                return new LightingAsset();

            default:
                throw new IllegalArgumentException("Unknown equipment category: " + category);
        }
    }
}
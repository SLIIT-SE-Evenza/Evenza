package com.evenza.standalone_demo.service;

import com.evenza.standalone_demo.factory.InventoryAsset;
import com.evenza.standalone_demo.factory.InventoryAssetFactory;
import com.evenza.standalone_demo.model.AssetSpecification;

/**
 * Demonstrates Inversion of Control (IoC):
 * Client services do not care which concrete class gets created;
 * they delegate creation to the Factory and consume the interface.
 */
public class InventoryAssetCreator {

    public void processAndRegisterAsset(AssetSpecification spec) {
        System.out.println("\n--------------------------------------------------");
        System.out.println("Processing New Inventory Item: " + spec.getName());
        System.out.println("Requested Category: " + spec.getCategory());

        // 1. Inversion of Control through the Factory pattern:
        InventoryAsset asset = InventoryAssetFactory.createAsset(spec.getCategory());

        // 2. Polymorphic behavior execution:
        System.out.println("-> Classified Asset Type: " + asset.getAssetType());
        System.out.println("-> Requires Electrical Inspection: " + asset.requiresElectricalInspection());
        System.out.println("-> Total Maintenance Reserve: Rs. " + asset.calculateMaintenanceReserve(spec.getQuantity()));
        System.out.println("-> Storage Instructions: " + asset.getStorageGuidelines());
        System.out.println("--------------------------------------------------");
    }
}
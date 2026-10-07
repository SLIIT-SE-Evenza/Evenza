package com.evenza.standalone_demo;

import com.evenza.standalone_demo.model.AssetSpecification;
import com.evenza.standalone_demo.service.InventoryAssetCreator;

public class DemoApplication {

    public static void main(String[] args) {
        System.out.println("==================================================");
        System.out.println("  EVENZA INVENTORY - FACTORY PATTERN & IoC DEMO   ");
        System.out.println("==================================================");

        InventoryAssetCreator creator = new InventoryAssetCreator();

        // 1. Process Seating Item (Furniture)
        AssetSpecification chairs = new AssetSpecification("Banquet Velvet Chairs", "Seating", 50, 1500.0);
        creator.processAndRegisterAsset(chairs);

        // 2. Process AV Item (Requires testing)
        AssetSpecification micKit = new AssetSpecification("Wireless Shure Mic Kit", "AV Equipment", 8, 12000.0);
        creator.processAndRegisterAsset(micKit);

        // 3. Process Lighting Item (Rigging)
        AssetSpecification parCans = new AssetSpecification("LED Par Can Lights", "Lighting", 20, 4500.0);
        creator.processAndRegisterAsset(parCans);
    }
}
package com.evenza.singleton_demo;

public class SingletonDemoApplication {

    public static void main(String[] args) {
        System.out.println("==========================================================");
        System.out.println("   EVENZA INVENTORY - CLASSICAL SINGLETON PATTERN DEMO   ");
        System.out.println("==========================================================");

        // 1. Retrieve the instance for the first time
        System.out.println("\n[Client A - Warehouse Dispatch Desk] Requesting configuration...");
        InventoryConfigurationManager managerA = InventoryConfigurationManager.getInstance();

        // 2. Retrieve the instance from another client/module
        System.out.println("\n[Client B - Stock Audit Service] Requesting configuration...");
        InventoryConfigurationManager managerB = InventoryConfigurationManager.getInstance();

        // 3. Verify object identity (Slide 25 check: obj1 == obj2)
        System.out.println("\n----------------- VERIFICATION CHECK -----------------");
        System.out.println("Reference managerA HashCode: " + System.identityHashCode(managerA));
        System.out.println("Reference managerB HashCode: " + System.identityHashCode(managerB));
        
        boolean isSameObject = (managerA == managerB);
        System.out.println("Are both instances referring to the EXACT same object? " + isSameObject); // true

        // 4. Demonstrate Global Shared State
        System.out.println("\n----------------- GLOBAL STATE DEMO ------------------");
        System.out.println("Original 'Seating' Safety Threshold: " 
                + managerA.getSafetyThresholdForCategory("Seating") + " units");

        // Client A modifies the threshold
        System.out.println("[Client A] Updating 'Seating' threshold to 40 units...");
        managerA.updateSafetyThreshold("Seating", 40);

        // Client B inspects the threshold
        System.out.println("[Client B] Reading 'Seating' threshold via managerB: " 
                + managerB.getSafetyThresholdForCategory("Seating") + " units");

        System.out.println("\nResult: Modifying state in managerA immediately updated managerB!");
        System.out.println("==========================================================");
    }
}
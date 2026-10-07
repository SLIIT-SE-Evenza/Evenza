package com.evenza.standalone_demo.model;

public class AssetSpecification {
    private String name;
    private String category;
    private int quantity;
    private double unitCost;

    public AssetSpecification(String name, String category, int quantity, double unitCost) {
        this.name = name;
        this.category = category;
        this.quantity = quantity;
        this.unitCost = unitCost;
    }

    public String getName() { return name; }
    public String getCategory() { return category; }
    public int getQuantity() { return quantity; }
    public double getUnitCost() { return unitCost; }
}
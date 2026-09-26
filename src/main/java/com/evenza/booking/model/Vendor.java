package com.evenza.booking.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Digits;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

import java.math.BigDecimal;

@Entity
@Table(name = "vendors")
public class Vendor {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message = "Vendor name is required")
    @Size(min = 2, max = 100,
            message = "Vendor name must contain 2 to 100 characters")
    @Column(nullable = false, length = 100)
    private String name;

    @NotBlank(message = "Vendor category is required")
    @Size(min = 2, max = 100,
            message = "Category must contain 2 to 100 characters")
    @Column(nullable = false, length = 100)
    private String category;

    @NotNull(message = "Vendor price is required")
    @DecimalMin(value = "0.01",
            message = "Vendor price must be greater than zero")
    @Digits(integer = 10, fraction = 2,
            message = "Vendor price can contain up to 10 whole digits and 2 decimal places")
    @Column(nullable = false, precision = 12, scale = 2)
    private BigDecimal price;

    @Column(nullable = false)
    private boolean available = true;

    @Size(max = 500,
            message = "Description cannot exceed 500 characters")
    @Column(length = 500)
    private String description;

    public Vendor() {
    }

    public Long getId() {
        return id;
    }

    public String getName() {
        return name;
    }

    public String getCategory() {
        return category;
    }

    public BigDecimal getPrice() {
        return price;
    }

    public boolean isAvailable() {
        return available;
    }

    public String getDescription() {
        return description;
    }

    public void setName(String name) {
        this.name = clean(name);
    }

    public void setCategory(String category) {
        this.category = clean(category);
    }

    public void setPrice(BigDecimal price) {
        this.price = price;
    }

    public void setAvailable(boolean available) {
        this.available = available;
    }

    public void setDescription(String description) {
        this.description =
                description == null || description.isBlank()
                        ? null
                        : description.trim();
    }

    private String clean(String value) {
        return value == null ? null : value.trim();
    }
}
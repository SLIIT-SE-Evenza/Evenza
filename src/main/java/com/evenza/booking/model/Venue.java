package com.evenza.booking.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

@Entity
@Table(name = "venues")
public class Venue {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message = "Venue name is required")
    @Size(min = 2, max = 100,
            message = "Venue name must contain 2 to 100 characters")
    @Column(nullable = false, length = 100)
    private String name;

    @NotBlank(message = "Venue location is required")
    @Size(min = 2, max = 200,
            message = "Location must contain 2 to 200 characters")
    @Column(nullable = false, length = 200)
    private String location;

    @Min(value = 1,
            message = "Venue capacity must be at least 1")
    @Max(value = 1000000,
            message = "Venue capacity cannot exceed 1000000")
    @Column(nullable = false)
    private int capacity;

    @Column(nullable = false)
    private boolean available = true;

    public Venue() {
    }

    public Long getId() {
        return id;
    }

    public String getName() {
        return name;
    }

    public String getLocation() {
        return location;
    }

    public int getCapacity() {
        return capacity;
    }

    public boolean isAvailable() {
        return available;
    }

    public void setName(String name) {
        this.name = clean(name);
    }

    public void setLocation(String location) {
        this.location = clean(location);
    }

    public void setCapacity(int capacity) {
        this.capacity = capacity;
    }

    public void setAvailable(boolean available) {
        this.available = available;
    }

    private String clean(String value) {
        return value == null ? null : value.trim();
    }
}
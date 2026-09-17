package com.evenza.booking.controller;

import com.evenza.booking.model.Vendor;
import com.evenza.booking.model.Venue;
import com.evenza.booking.repository.VendorRepository;
import com.evenza.booking.repository.VenueRepository;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/** Small CRUD API for the vendors and venues needed by the booking screen. */
@RestController
@RequestMapping("/api/booking-resources")
public class BookingResourceController {
    private final VendorRepository vendors;
    private final VenueRepository venues;

    public BookingResourceController(VendorRepository vendors, VenueRepository venues) {
        this.vendors = vendors;
        this.venues = venues;
    }

    @GetMapping("/vendors")
    public List<Vendor> vendors() { return vendors.findAll(); }

    @PostMapping("/vendors")
    @ResponseStatus(HttpStatus.CREATED)
    public Vendor createVendor(@RequestBody Vendor vendor) { return vendors.save(vendor); }

    @PutMapping("/vendors/{id}")
    public Vendor updateVendor(@PathVariable Long id, @RequestBody Vendor input) {
        Vendor vendor = vendors.findById(id).orElseThrow(() -> new IllegalArgumentException("Vendor not found"));
        vendor.setName(input.getName()); vendor.setCategory(input.getCategory());
        vendor.setPrice(input.getPrice()); vendor.setAvailable(input.isAvailable());
        vendor.setDescription(input.getDescription());
        return vendors.save(vendor);
    }

    @DeleteMapping("/vendors/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteVendor(@PathVariable Long id) { vendors.deleteById(id); }

    @GetMapping("/venues")
    public List<Venue> venues() { return venues.findAll(); }

    @PostMapping("/venues")
    @ResponseStatus(HttpStatus.CREATED)
    public Venue createVenue(@RequestBody Venue venue) { return venues.save(venue); }

    @PutMapping("/venues/{id}")
    public Venue updateVenue(@PathVariable Long id, @RequestBody Venue input) {
        Venue venue = venues.findById(id).orElseThrow(() -> new IllegalArgumentException("Venue not found"));
        venue.setName(input.getName()); venue.setLocation(input.getLocation());
        venue.setCapacity(input.getCapacity()); venue.setAvailable(input.isAvailable());
        return venues.save(venue);
    }

    @DeleteMapping("/venues/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteVenue(@PathVariable Long id) { venues.deleteById(id); }
}

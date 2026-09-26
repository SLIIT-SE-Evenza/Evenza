package com.evenza.booking.controller;

import com.evenza.booking.model.Vendor;
import com.evenza.booking.model.Venue;
import com.evenza.booking.repository.BookingRepository;
import com.evenza.booking.repository.VendorRepository;
import com.evenza.booking.repository.VenueRepository;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * CRUD API for vendors and venues used by the Booking module.
 *
 * Customers may view resources.
 * Event managers and administrators may create, update and delete resources.
 */
@RestController
@RequestMapping("/api/booking-resources")
public class BookingResourceController {

    private final VendorRepository vendorRepository;
    private final VenueRepository venueRepository;
    private final BookingRepository bookingRepository;

    public BookingResourceController(
            VendorRepository vendorRepository,
            VenueRepository venueRepository,
            BookingRepository bookingRepository) {

        this.vendorRepository = vendorRepository;
        this.venueRepository = venueRepository;
        this.bookingRepository = bookingRepository;
    }

    // Customers and management users may view vendors.
    @GetMapping("/vendors")
    @PreAuthorize("hasAnyRole('CUSTOMER', 'EVENT_MANAGER', 'ADMIN')")
    public List<Vendor> vendors() {
        return vendorRepository.findAll();
    }

    // Only management can add a vendor.
    @PostMapping("/vendors")
    @ResponseStatus(HttpStatus.CREATED)
    @PreAuthorize("hasAnyRole('EVENT_MANAGER', 'ADMIN')")
    public Vendor createVendor(
            @Valid @RequestBody Vendor vendor) {

        String name = vendor.getName().trim();

        if (vendorRepository.existsByNameIgnoreCase(name)) {
            throw new IllegalArgumentException(
                    "A vendor with this name already exists"
            );
        }

        vendor.setName(name);
        return vendorRepository.save(vendor);
    }

    // Only management can edit a vendor.
    @PutMapping("/vendors/{id}")
    @PreAuthorize("hasAnyRole('EVENT_MANAGER', 'ADMIN')")
    public Vendor updateVendor(
            @PathVariable Long id,
            @Valid @RequestBody Vendor input) {

        Vendor vendor = vendorRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException(
                        "Vendor not found: " + id
                ));

        String name = input.getName().trim();

        if (vendorRepository
                .existsByNameIgnoreCaseAndIdNot(name, id)) {

            throw new IllegalArgumentException(
                    "A vendor with this name already exists"
            );
        }

        vendor.setName(name);
        vendor.setCategory(input.getCategory());
        vendor.setPrice(input.getPrice());
        vendor.setAvailable(input.isAvailable());
        vendor.setDescription(input.getDescription());

        return vendorRepository.save(vendor);
    }

    /*
     * A vendor cannot be deleted while a booking still references it.
     * Mark it unavailable instead when historical bookings exist.
     */
    @DeleteMapping("/vendors/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    @PreAuthorize("hasAnyRole('EVENT_MANAGER', 'ADMIN')")
    public void deleteVendor(@PathVariable Long id) {

        if (!vendorRepository.existsById(id)) {
            throw new IllegalArgumentException(
                    "Vendor not found: " + id
            );
        }

        if (bookingRepository.existsByVendorId(id)) {
            throw new IllegalArgumentException(
                    "This vendor is used by existing bookings. Mark it unavailable instead"
            );
        }

        vendorRepository.deleteById(id);
    }

    // Customers and management users may view venues.
    @GetMapping("/venues")
    @PreAuthorize("hasAnyRole('CUSTOMER', 'EVENT_MANAGER', 'ADMIN')")
    public List<Venue> venues() {
        return venueRepository.findAll();
    }

    // Only management can add a venue.
    @PostMapping("/venues")
    @ResponseStatus(HttpStatus.CREATED)
    @PreAuthorize("hasAnyRole('EVENT_MANAGER', 'ADMIN')")
    public Venue createVenue(
            @Valid @RequestBody Venue venue) {

        String name = venue.getName().trim();

        if (venueRepository.existsByNameIgnoreCase(name)) {
            throw new IllegalArgumentException(
                    "A venue with this name already exists"
            );
        }

        venue.setName(name);
        return venueRepository.save(venue);
    }

    // Only management can edit a venue.
    @PutMapping("/venues/{id}")
    @PreAuthorize("hasAnyRole('EVENT_MANAGER', 'ADMIN')")
    public Venue updateVenue(
            @PathVariable Long id,
            @Valid @RequestBody Venue input) {

        Venue venue = venueRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException(
                        "Venue not found: " + id
                ));

        String name = input.getName().trim();

        if (venueRepository
                .existsByNameIgnoreCaseAndIdNot(name, id)) {

            throw new IllegalArgumentException(
                    "A venue with this name already exists"
            );
        }

        venue.setName(name);
        venue.setLocation(input.getLocation());
        venue.setCapacity(input.getCapacity());
        venue.setAvailable(input.isAvailable());

        return venueRepository.save(venue);
    }

    /*
     * A venue cannot be deleted while bookings still refer to it.
     * Mark it unavailable instead to keep booking history valid.
     */
    @DeleteMapping("/venues/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    @PreAuthorize("hasAnyRole('EVENT_MANAGER', 'ADMIN')")
    public void deleteVenue(@PathVariable Long id) {

        if (!venueRepository.existsById(id)) {
            throw new IllegalArgumentException(
                    "Venue not found: " + id
            );
        }

        if (bookingRepository.existsByVenueId(id)) {
            throw new IllegalArgumentException(
                    "This venue is used by existing bookings. Mark it unavailable instead"
            );
        }

        venueRepository.deleteById(id);
    }
}
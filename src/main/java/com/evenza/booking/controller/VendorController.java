package com.evenza.booking.controller;

import com.evenza.booking.dto.VendorResponse;
import com.evenza.booking.service.VendorService;

import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.List;

@RestController
@RequestMapping("/api/bookings/vendors")
public class VendorController {

    private final VendorService vendorService;

    public VendorController(
            VendorService vendorService) {

        this.vendorService = vendorService;
    }

    @GetMapping
    public List<VendorResponse> search(

            @RequestParam(required = false)
            String category,

            @RequestParam(required = false)
            BigDecimal maxPrice) {

        return vendorService.search(
                category,
                maxPrice
        );
    }
}

package com.evenza.inquiry.controller;

import com.evenza.inquiry.dto.InquiryRequest;
import com.evenza.inquiry.model.Inquiry;
import com.evenza.inquiry.service.InquiryService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/inquiries")
public class InquiryController {

    private final InquiryService inquiryService;

    public InquiryController(InquiryService inquiryService) {
        this.inquiryService = inquiryService;
    }

    @PostMapping
    public ResponseEntity<Inquiry> submitInquiry(@Valid @RequestBody InquiryRequest request) {
        return ResponseEntity.ok(inquiryService.submitInquiry(request));
    }

    @GetMapping("/{id}")
    public ResponseEntity<Inquiry> getInquiry(@PathVariable Long id) {
        return ResponseEntity.ok(inquiryService.getInquiry(id));
    }

    @GetMapping
    public ResponseEntity<List<Inquiry>> getAllInquiries() {
        return ResponseEntity.ok(inquiryService.getAllInquiries());
    }

    @GetMapping("/customer/{customerId}")
    public ResponseEntity<List<Inquiry>> getCustomerInquiries(@PathVariable Long customerId) {
        return ResponseEntity.ok(inquiryService.getCustomerInquiries(customerId));
    }

    @PutMapping("/{id}/forward")
    public ResponseEntity<Inquiry> forwardInquiry(@PathVariable Long id) {
        return ResponseEntity.ok(inquiryService.forwardToEventManager(id));
    }

    @PutMapping("/{id}/review")
    public ResponseEntity<Inquiry> reviewInquiry(@PathVariable Long id) {
        return ResponseEntity.ok(inquiryService.markUnderReview(id));
    }

    @PutMapping("/{id}/approve")
    public ResponseEntity<Inquiry> approveInquiry(@PathVariable Long id) {
        return ResponseEntity.ok(inquiryService.approveInquiry(id));
    }

    @PutMapping("/{id}/reject")
    public ResponseEntity<Inquiry> rejectInquiry(@PathVariable Long id) {
        return ResponseEntity.ok(inquiryService.rejectInquiry(id));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Inquiry> update(@PathVariable Long id,
                                          @Valid @RequestBody InquiryRequest request) {
        return ResponseEntity.ok(inquiryService.updateInquiry(id, request));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        inquiryService.deleteInquiry(id);
        return ResponseEntity.noContent().build();
    }
}

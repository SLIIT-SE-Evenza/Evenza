package com.evenza.inquiry.controller;

import com.evenza.common.auth.AuthService;
import com.evenza.common.user.User;
import com.evenza.inquiry.dto.InquiryRequest;
import com.evenza.inquiry.model.Inquiry;
import com.evenza.inquiry.service.InquiryService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/inquiries")
@PreAuthorize("isAuthenticated()")
public class InquiryController {

    private final InquiryService inquiryService;
    private final AuthService authService;

    public InquiryController(InquiryService inquiryService, AuthService authService) {
        this.inquiryService = inquiryService;
        this.authService = authService;
    }

    @PostMapping
    @PreAuthorize("hasRole('CUSTOMER')")
    public ResponseEntity<Inquiry> submitInquiry(
            @Valid @RequestBody InquiryRequest request,
            Authentication authentication) {

        return ResponseEntity.status(HttpStatus.CREATED)
                .body(inquiryService.submitInquiry(request, currentUser(authentication)));
    }

    @GetMapping
    @PreAuthorize("hasAnyRole('CUSTOMER', 'EVENT_MANAGER', 'ADMIN')")
    public List<Inquiry> getInquiries(Authentication authentication) {
        return inquiryService.getVisibleInquiries(currentUser(authentication));
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('CUSTOMER', 'EVENT_MANAGER', 'ADMIN')")
    public Inquiry getInquiry(@PathVariable Long id, Authentication authentication) {
        return inquiryService.getVisibleInquiry(id, currentUser(authentication));
    }

    @GetMapping("/customer/{customerId}")
    @PreAuthorize("hasAnyRole('CUSTOMER', 'EVENT_MANAGER', 'ADMIN')")
    public List<Inquiry> getCustomerInquiries(
            @PathVariable Long customerId,
            Authentication authentication) {

        return inquiryService.getCustomerInquiries(customerId, currentUser(authentication));
    }

    @PutMapping("/{id}/forward")
    @PreAuthorize("hasAnyRole('EVENT_MANAGER', 'ADMIN')")
    public Inquiry forwardInquiry(@PathVariable Long id) {
        return inquiryService.forwardToEventManager(id);
    }

    @PutMapping("/{id}/review")
    @PreAuthorize("hasAnyRole('EVENT_MANAGER', 'ADMIN')")
    public Inquiry reviewInquiry(@PathVariable Long id) {
        return inquiryService.markUnderReview(id);
    }

    @PutMapping("/{id}/approve")
    @PreAuthorize("hasAnyRole('EVENT_MANAGER', 'ADMIN')")
    public Inquiry approveInquiry(@PathVariable Long id) {
        return inquiryService.approveInquiry(id);
    }

    @PutMapping("/{id}/reject")
    @PreAuthorize("hasAnyRole('EVENT_MANAGER', 'ADMIN')")
    public Inquiry rejectInquiry(@PathVariable Long id) {
        return inquiryService.rejectInquiry(id);
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('CUSTOMER')")
    public Inquiry update(
            @PathVariable Long id,
            @Valid @RequestBody InquiryRequest request,
            Authentication authentication) {

        return inquiryService.updateInquiry(id, request, currentUser(authentication));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAnyRole('CUSTOMER', 'ADMIN')")
    public ResponseEntity<Void> delete(
            @PathVariable Long id,
            Authentication authentication) {

        inquiryService.deleteInquiry(id, currentUser(authentication));
        return ResponseEntity.noContent().build();
    }

    private User currentUser(Authentication authentication) {
        return authService.findByEmailOrThrow(authentication.getName());
    }
}

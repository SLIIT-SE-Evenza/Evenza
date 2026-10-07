package com.evenza.inquiry.service;

import com.evenza.common.user.User;
import com.evenza.common.user.UserRole;
import com.evenza.inquiry.dto.InquiryRequest;
import com.evenza.inquiry.model.Inquiry;
import com.evenza.inquiry.model.InquiryStatus;
import com.evenza.inquiry.repository.InquiryRepository;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class InquiryService {

    private final InquiryRepository inquiryRepository;

    public InquiryService(InquiryRepository inquiryRepository) {
        this.inquiryRepository = inquiryRepository;
    }

    @Transactional
    public Inquiry submitInquiry(InquiryRequest request, User currentUser) {
        Inquiry inquiry = new Inquiry();

        // Never trust a customer ID sent by the browser. The authenticated
        // session decides who owns the inquiry.
        inquiry.setCustomerId(currentUser.getId());
        copyEditableFields(inquiry, request);
        inquiry.setStatus(InquiryStatus.SUBMITTED);
        return inquiryRepository.save(inquiry);
    }

    @Transactional(readOnly = true)
    public List<Inquiry> getVisibleInquiries(User currentUser) {
        if (isManagement(currentUser)) {
            return inquiryRepository.findAll();
        }
        return inquiryRepository.findByCustomerIdOrderByCreatedAtDesc(currentUser.getId());
    }

    @Transactional(readOnly = true)
    public Inquiry getVisibleInquiry(Long id, User currentUser) {
        Inquiry inquiry = getInquiryOrThrow(id);
        verifyOwnerOrManagement(inquiry, currentUser);
        return inquiry;
    }

    @Transactional(readOnly = true)
    public List<Inquiry> getCustomerInquiries(Long customerId, User currentUser) {
        if (!isManagement(currentUser) && !currentUser.getId().equals(customerId)) {
            throw new AccessDeniedException("You can only view your own inquiries");
        }
        return inquiryRepository.findByCustomerIdOrderByCreatedAtDesc(customerId);
    }

    @Transactional
    public Inquiry forwardToEventManager(Long id) {
        return changeStatus(id, InquiryStatus.SUBMITTED, InquiryStatus.FORWARDED);
    }

    @Transactional
    public Inquiry markUnderReview(Long id) {
        return changeStatus(id, InquiryStatus.FORWARDED, InquiryStatus.UNDER_REVIEW);
    }

    @Transactional
    public Inquiry approveInquiry(Long id) {
        return changeStatus(id, InquiryStatus.UNDER_REVIEW, InquiryStatus.APPROVED);
    }

    @Transactional
    public Inquiry rejectInquiry(Long id) {
        return changeStatus(id, InquiryStatus.UNDER_REVIEW, InquiryStatus.REJECTED);
    }

    @Transactional
    public Inquiry updateInquiry(Long id, InquiryRequest request, User currentUser) {
        Inquiry inquiry = getInquiryOrThrow(id);
        verifyOwner(inquiry, currentUser);

        if (inquiry.getStatus() != InquiryStatus.SUBMITTED) {
            throw new IllegalArgumentException("Only submitted inquiries can be edited");
        }

        copyEditableFields(inquiry, request);
        return inquiryRepository.save(inquiry);
    }

    @Transactional
    public void deleteInquiry(Long id, User currentUser) {
        Inquiry inquiry = getInquiryOrThrow(id);

        if (currentUser.getRole() != UserRole.ADMIN) {
            verifyOwner(inquiry, currentUser);
            if (inquiry.getStatus() != InquiryStatus.SUBMITTED) {
                throw new IllegalArgumentException("Only submitted inquiries can be deleted");
            }
        }

        inquiryRepository.delete(inquiry);
    }

    private Inquiry changeStatus(
            Long id,
            InquiryStatus expected,
            InquiryStatus target) {

        Inquiry inquiry = getInquiryOrThrow(id);
        if (inquiry.getStatus() != expected) {
            throw new IllegalArgumentException(
                    "Cannot change inquiry from " + inquiry.getStatus() + " to " + target
            );
        }
        inquiry.setStatus(target);
        return inquiryRepository.save(inquiry);
    }

    private Inquiry getInquiryOrThrow(Long id) {
        return inquiryRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Inquiry not found: " + id));
    }

    private void copyEditableFields(Inquiry inquiry, InquiryRequest request) {
        inquiry.setEventType(request.getEventType().trim());
        inquiry.setEventDetails(request.getEventDetails().trim());
        inquiry.setAttachmentPath(cleanOptional(request.getAttachmentPath()));
    }

    private String cleanOptional(String value) {
        return value == null || value.isBlank() ? null : value.trim();
    }

    private void verifyOwner(Inquiry inquiry, User currentUser) {
        if (!inquiry.getCustomerId().equals(currentUser.getId())) {
            throw new AccessDeniedException("This inquiry belongs to another customer");
        }
    }

    private void verifyOwnerOrManagement(Inquiry inquiry, User currentUser) {
        if (!isManagement(currentUser)) {
            verifyOwner(inquiry, currentUser);
        }
    }

    private boolean isManagement(User user) {
        return user.getRole() == UserRole.EVENT_MANAGER
                || user.getRole() == UserRole.ADMIN;
    }
}

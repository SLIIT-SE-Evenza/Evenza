package com.evenza.inquiry.service;

import com.evenza.inquiry.dto.InquiryRequest;
import com.evenza.inquiry.model.Inquiry;
import com.evenza.inquiry.model.InquiryStatus;
import com.evenza.inquiry.repository.InquiryRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class InquiryService {

    private final InquiryRepository inquiryRepository;

    public InquiryService(InquiryRepository inquiryRepository) {
        this.inquiryRepository = inquiryRepository;
    }

    public Inquiry submitInquiry(InquiryRequest request) {
        Inquiry inquiry = new Inquiry();
        inquiry.setCustomerId(request.getCustomerId());
        inquiry.setEventType(request.getEventType());
        inquiry.setEventDetails(request.getEventDetails());
        inquiry.setAttachmentPath(request.getAttachmentPath());
        inquiry.setStatus(InquiryStatus.SUBMITTED);

        return inquiryRepository.save(inquiry);
    }

    public Inquiry getInquiry(Long id) {
        return inquiryRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Inquiry not found"));
    }

    public List<Inquiry> getCustomerInquiries(Long customerId) {
        return inquiryRepository.findByCustomerId(customerId);
    }

    public List<Inquiry> getAllInquiries() {
        return inquiryRepository.findAll();
    }

    public Inquiry forwardToEventManager(Long id) {
        Inquiry inquiry = getInquiry(id);
        inquiry.setStatus(InquiryStatus.FORWARDED);
        return inquiryRepository.save(inquiry);
    }

    public Inquiry markUnderReview(Long id) {
        Inquiry inquiry = getInquiry(id);
        inquiry.setStatus(InquiryStatus.UNDER_REVIEW);
        return inquiryRepository.save(inquiry);
    }

    public Inquiry approveInquiry(Long id) {
        Inquiry inquiry = getInquiry(id);
        inquiry.setStatus(InquiryStatus.APPROVED);
        return inquiryRepository.save(inquiry);
    }

    public Inquiry rejectInquiry(Long id) {
        Inquiry inquiry = getInquiry(id);
        inquiry.setStatus(InquiryStatus.REJECTED);
        return inquiryRepository.save(inquiry);
    }

    public Inquiry updateInquiry(Long id, InquiryRequest request) {
        Inquiry inquiry = getInquiry(id);
        inquiry.setCustomerId(request.getCustomerId());
        inquiry.setEventType(request.getEventType());
        inquiry.setEventDetails(request.getEventDetails());
        inquiry.setAttachmentPath(request.getAttachmentPath());
        return inquiryRepository.save(inquiry);
    }

    public void deleteInquiry(Long id) {
        inquiryRepository.delete(getInquiry(id));
    }
}

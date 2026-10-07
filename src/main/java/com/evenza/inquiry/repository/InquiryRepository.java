package com.evenza.inquiry.repository;

import com.evenza.inquiry.model.Inquiry;
import com.evenza.inquiry.model.InquiryStatus;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface InquiryRepository extends JpaRepository<Inquiry, Long> {

    List<Inquiry> findByCustomerIdOrderByCreatedAtDesc(Long customerId);

    List<Inquiry> findByStatus(InquiryStatus status);
}

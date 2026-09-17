package com.evenza.booking.model;

import jakarta.persistence.*;

import java.time.LocalDate;
import java.time.LocalTime;

@Entity
@Table(name = "bookings")
public class Booking {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Long customerId;

    private Long eventId;

    private Long vendorId;

    private Long venueId;

    @Column(nullable = false)
    private LocalDate bookingDate;

    @Column(nullable = false)
    private LocalTime startTime;

    @Column(nullable = false)
    private LocalTime endTime;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private BookingStatus status = BookingStatus.PENDING;

    public Booking() {
    }

    public Long getId() {
        return id;
    }

    public Long getCustomerId() {
        return customerId;
    }

    public Long getEventId() {
        return eventId;
    }

    public Long getVendorId() {
        return vendorId;
    }

    public Long getVenueId() {
        return venueId;
    }

    public LocalDate getBookingDate() {
        return bookingDate;
    }

    public LocalTime getStartTime() {
        return startTime;
    }

    public LocalTime getEndTime() {
        return endTime;
    }

    public BookingStatus getStatus() {
        return status;
    }

    public void setCustomerId(Long customerId) {
        this.customerId = customerId;
    }

    public void setEventId(Long eventId) {
        this.eventId = eventId;
    }

    public void setVendorId(Long vendorId) {
        this.vendorId = vendorId;
    }

    public void setVenueId(Long venueId) {
        this.venueId = venueId;
    }

    public void setBookingDate(LocalDate bookingDate) {
        this.bookingDate = bookingDate;
    }

    public void setStartTime(LocalTime startTime) {
        this.startTime = startTime;
    }

    public void setEndTime(LocalTime endTime) {
        this.endTime = endTime;
    }

    public void setStatus(BookingStatus status) {
        this.status = status;
    }
}

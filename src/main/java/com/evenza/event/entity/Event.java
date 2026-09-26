package com.evenza.event.entity;

import com.evenza.common.user.User;
import jakarta.persistence.*;
import java.time.LocalDateTime;


// all carry an event_id foreign key pointing back to this table.
@Entity
@Table(name = "events")
public class Event {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // The customer who created this event. Called "organiser" per the
    // ERD naming in the Build Guide (organiser_id).
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "organiser_id", nullable = false)
    private User organiser;

    @Column(nullable = false, length = 150)
    private String name;

    @Column(name = "event_date", nullable = false)
    private LocalDateTime eventDate;

    private int guestCount;

    @Column(length = 1000)
    private String requirements;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private EventStatus status = EventStatus.DRAFT;

    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    protected Event() {

    }

    public Event(User organiser, String name, LocalDateTime eventDate, int guestCount) {
        this.organiser = organiser;
        this.name = name;
        this.eventDate = eventDate;
        this.guestCount = guestCount;
    }

    @PrePersist
    void onCreate() {
        this.createdAt = LocalDateTime.now();
    }

    // Encapsulation
    public void submitForApproval() {
        requireStatus(EventStatus.DRAFT, "Only a draft event can be submitted for approval");
        this.status = EventStatus.PENDING_APPROVAL;
    }

    public void approve() {
        requireStatus(EventStatus.PENDING_APPROVAL, "Only a pending event can be approved");
        this.status = EventStatus.APPROVED;
    }

    public void markCompleted() {
        requireStatus(EventStatus.APPROVED, "Only an approved event can be completed");
        this.status = EventStatus.COMPLETED;
    }

    public void cancel() {
        if (status == EventStatus.COMPLETED || status == EventStatus.CANCELLED) {
            throw new IllegalArgumentException("Completed or cancelled events cannot be cancelled again");
        }
        this.status = EventStatus.CANCELLED;
    }

    /** Changes event details while keeping validation rules in the service layer. */
    public void updateDetails(
            User organiser,
            String name,
            LocalDateTime eventDate,
            int guestCount,
            String requirements) {
        this.organiser = organiser;
        this.name = name;
        this.eventDate = eventDate;
        this.guestCount = guestCount;
        this.requirements = requirements;
    }

    private void requireStatus(EventStatus expected, String message) {
        if (status != expected) {
            throw new IllegalArgumentException(message);
        }
    }

    public Long getId() {
        return id;
    }

    public User getOrganiser() {
        return organiser;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public LocalDateTime getEventDate() {
        return eventDate;
    }

    public void setEventDate(LocalDateTime eventDate) {
        this.eventDate = eventDate;
    }

    public int getGuestCount() {
        return guestCount;
    }

    public void setGuestCount(int guestCount) {
        this.guestCount = guestCount;
    }

    public String getRequirements() {
        return requirements;
    }

    public void setRequirements(String requirements) {
        this.requirements = requirements;
    }

    public EventStatus getStatus() {
        return status;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }
}

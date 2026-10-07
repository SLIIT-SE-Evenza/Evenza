package com.evenza.schedule.entity;

import com.evenza.common.user.User;
import com.evenza.event.entity.Event;
import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name ="tasks")

public class Task {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "event_id", nullable = false)
    private Event event;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "milestone_id")
    private Milestone milestone;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "assigned_staff_id")
    private User assignedStaff;

    @Column(nullable = false, length = 150)
    private String title;

    @Column(length = 1000)
    private String description;

    @Column(name = "start_time", nullable = false)
    private LocalDateTime startTime;

    @Column(name = "end_time", nullable = false)
    private LocalDateTime endTime;

    @Column(name = "deadline", nullable = false)
    private LocalDateTime deadline;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private TaskStatus status = TaskStatus.PENDING;

    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    protected Task() {
    }

    //Constructor
    public Task (Event event,String title, String description,LocalDateTime startTime, LocalDateTime endTime, LocalDateTime deadline){
        this.event = event;
        this.title = title;
        this.description = description;
        this.startTime = startTime;
        this.endTime = endTime;
        this.deadline = deadline;
    }

    @PrePersist
    void onCreate() {
        this.createdAt = LocalDateTime.now();
        this.updatedAt = this.createdAt;
    }

    @PreUpdate
    void onUpdate() {
        this.updatedAt = LocalDateTime.now();
    }

    //Functions
    public void assignTo(User staff){
        this.assignedStaff = staff;

    }
    public void markInProgress() {
        if (status != TaskStatus.PENDING && status != TaskStatus.OVERDUE) {
            throw new IllegalArgumentException("Only pending or overdue tasks can be started");
        }
        this.status = TaskStatus.IN_PROGRESS;
    }

    public void markCompleted() {
        if (status != TaskStatus.IN_PROGRESS && status != TaskStatus.OVERDUE) {
            throw new IllegalArgumentException("Only in-progress or overdue tasks can be completed");
        }
        this.status = TaskStatus.COMPLETED;
    }

    //Functions
    public void markOverdue(){
        if (this.status != TaskStatus.COMPLETED && this.status != TaskStatus.CANCELLED) {
            this.status = TaskStatus.OVERDUE;}

    }

    public  void cancel() {
        if (status == TaskStatus.COMPLETED || status == TaskStatus.CANCELLED) {
            throw new IllegalArgumentException("Completed or cancelled tasks cannot be cancelled again");
        }
        this.status = TaskStatus.CANCELLED;
    }

    public void assignToMilestone(Milestone milestone) {
        this.milestone = milestone;
    }

    /** Updates every editable scheduling field in one consistent operation. */
    public void updateDetails(
            String title,
            String description,
            LocalDateTime startTime,
            LocalDateTime endTime,
            LocalDateTime deadline) {
        this.title = title;
        this.description = description;
        this.startTime = startTime;
        this.endTime = endTime;
        this.deadline = deadline;
    }

    public Long getId() {
        return id;
    }

    public Event getEvent() {
        return event;
    }

    public Milestone getMilestone() {
        return milestone;
    }

    public User getAssignedStaff() {
        return assignedStaff;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public LocalDateTime getStartTime() {
        return startTime;
    }

    public LocalDateTime getEndTime() {
        return endTime;
    }

    public LocalDateTime getDeadline() {
        return deadline;
    }

    public TaskStatus getStatus() {
        return status;
    }

    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }


}

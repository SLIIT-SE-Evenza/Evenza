package com.evenza.schedule.entity;

import com.evenza.event.entity.Event;// owned by Suriyage O. W. (Function 2)
import jakarta.persistence.*;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "milestones")


public class Milestone {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "event_id",nullable = false)
    private Event event;

    @Column(nullable = false, length = 150)
    private String name;

    @Column(name ="target_date", nullable = false)
    private LocalDate targetDate;


    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private MilestoneStatus status = MilestoneStatus.NOT_STARTED;

    @OneToMany(mappedBy = "milestone", cascade = CascadeType.ALL, orphanRemoval = false)
    private List<Task> task= new ArrayList<>();

    protected Milestone(){
    }

    //Constructor
    public Milestone (Event event, String name, LocalDate targetDate){
        this.event = event;
        this.name = name;
        this.targetDate =targetDate;
    }

    //Getters and Setters


    public Long getId() {
        return id;
    }

    public Event getEvent() {
        return event;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public LocalDate getTargetDate() {
        return targetDate;
    }

    public void setTargetDate(LocalDate targetDate) {
        this.targetDate = targetDate;
    }

    public MilestoneStatus getStatus() {
        return status;
    }

    //functions
    public void markAchieved(){
        this.status = MilestoneStatus.ACHIEVED;
    }
    public void markAtRisk(){
        this.status = MilestoneStatus.AT_RISK;
    }
    public List<Task> getTask(){
        return tasks;
    }
}

package com.evenza.schedule.service;

import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

/** Automatically marks expired, unfinished tasks as overdue. */
@Component
public class DeadlineAutomationJob {

    private final TaskService taskService;

    public DeadlineAutomationJob(TaskService taskService) {
        this.taskService = taskService;
    }

    @Scheduled(
            initialDelayString = "${evenza.schedule.overdue-initial-delay-ms:15000}",
            fixedDelayString = "${evenza.schedule.overdue-check-ms:60000}")
    public void updateOverdueTasks() {
        taskService.markOverdueTasks();
    }
}

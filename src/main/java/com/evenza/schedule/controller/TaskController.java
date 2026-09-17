package com.evenza.schedule.controller;

import com.evenza.schedule.dto.CreateTaskRequest;
import com.evenza.schedule.dto.TaskResponse;
import com.evenza.schedule.dto.UpdateTaskRequest;
import com.evenza.schedule.service.TaskService;
import jakarta.validation.Valid;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;

/*
 * @RestController tells Spring that this class receives HTTP requests
 * and returns response data, normally as JSON.
 */
@RestController
/*
 * Every endpoint inside this controller starts with /api/tasks.
 * Example: GET /api/tasks/5
 */
@RequestMapping("/api/tasks")
public class TaskController{
    // The controller sends requests to the service layer.
    private final TaskService taskService;

    //constuctor injection
    public TaskController(TaskService taskService){
        this.taskService=taskService;
    }

    /*
     * POST /api/tasks
     * @RequestBody converts incoming JSON into CreateTaskRequest.
     * @Valid checks the validation annotations in the DTO.
     */
    @PostMapping
    public ResponseEntity<TaskResponse> createTask(
            @Valid @RequestBody CreateTaskRequest request){

        TaskResponse createdTask = taskService.createTask(request);
        // HTTP 201 CREATED means a new database record was created.

        return ResponseEntity.status(HttpStatus.CREATED).body(createdTask);
    }
    /*
     * GET /api/tasks/{taskId}
     * @PathVariable reads taskId from the URL.
     * Example: GET /api/tasks/10
     */
    @GetMapping("/{taskId}")
    public ResponseEntity<TaskResponse> getTaskById(
            @PathVariable Long taskId) {

        return ResponseEntity.ok(
                taskService.getTaskById(taskId)
        );
    }
    /*
     * GET /api/tasks/event/{eventId}
     *
     * Returns every task belonging to a selected event.
     */
    @GetMapping("/event/{eventId}")
    public ResponseEntity<List<TaskResponse>> getTasksByEvent(
            @PathVariable Long eventId) {

        return ResponseEntity.ok(
                taskService.getTasksByEvent(eventId)
        );
    }
    /*
     * GET /api/tasks/staff/{staffId}
     *
     * Returns every task assigned to a selected staff member.
     */
    @GetMapping("/staff/{staffId}")
    public ResponseEntity<List<TaskResponse>> getTasksByStaff(
            @PathVariable Long staffId) {

        return ResponseEntity.ok(
                taskService.getTasksByStaff(staffId)
        );
    }
    /*
     * GET /api/tasks/calendar?start=...&end=...
     *
     * @RequestParam reads values from the URL query parameters.
     * @DateTimeFormat converts ISO date-time text into LocalDateTime.
     */
    @GetMapping("/calendar")
    public ResponseEntity<List<TaskResponse>> getCalendarTasks(

            @RequestParam
            @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME)
            LocalDateTime start,

            @RequestParam
            @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME)
            LocalDateTime end) {
        return ResponseEntity.ok(
                taskService.getCalendarTasks(start, end)
        );
    }
    /*
     * PUT /api/tasks/{taskId}
     *
     * PUT is used to update the main editable task information.
     */
    @PutMapping("/{taskId}")
    public ResponseEntity<TaskResponse> updateTask(
            @PathVariable Long taskId,
            @Valid @RequestBody UpdateTaskRequest request) {

        return ResponseEntity.ok(
                taskService.updateTask(taskId, request)
        );
    }
    /*
     * PATCH changes only one part of an existing resource.
     * This endpoint assigns or reassigns a staff member.
     *
     * Example:
     * PATCH /api/tasks/10/assign-staff/5
     */
    @PatchMapping("/{taskId}/assign-staff/{staffId}")
    public ResponseEntity<TaskResponse> assignStaff(
            @PathVariable Long taskId,
            @PathVariable Long staffId) {

        return ResponseEntity.ok(
                taskService.assignStaff(taskId, staffId)
        );
    }
    /*
     * Connect an existing task to an existing milestone.
     *
     * Example:
     * PATCH /api/tasks/10/assign-milestone/3
     */
    @PatchMapping("/{taskId}/assign-milestone/{milestoneId}")
    public ResponseEntity<TaskResponse> assignMilestone(
            @PathVariable Long taskId,
            @PathVariable Long milestoneId) {

        return ResponseEntity.ok(
                taskService.assignMilestone(taskId, milestoneId)
        );
    }
    // Change the task status to IN_PROGRESS.
    @PatchMapping("/{taskId}/start")
    public ResponseEntity<TaskResponse> markInProgress(
            @PathVariable Long taskId) {

        return ResponseEntity.ok(
                taskService.markInProgress(taskId)
        );
    }

    // Change the task status to COMPLETED.
    @PatchMapping("/{taskId}/complete")
    public ResponseEntity<TaskResponse> markCompleted(
            @PathVariable Long taskId) {

        return ResponseEntity.ok(
                taskService.markCompleted(taskId)
        );
    }
    // Change the task status to CANCELLED.
    @PatchMapping("/{taskId}/cancel")
    public ResponseEntity<TaskResponse> cancelTask(
            @PathVariable Long taskId) {

        return ResponseEntity.ok(
                taskService.cancelTask(taskId)
        );
    }

    /*
     * POST /api/tasks/mark-overdue
     *
     * Finds expired tasks and changes their statuses to OVERDUE.
     * The returned integer is the number of tasks updated.
     */
    @PostMapping("/mark-overdue")
    public ResponseEntity<Integer> markOverdueTasks() {

        int updatedTaskCount =
                taskService.markOverdueTasks();

        return ResponseEntity.ok(updatedTaskCount);
    }

    /*
     * DELETE /api/tasks/{taskId}
     *
     * HTTP 204 NO CONTENT means deletion succeeded,
     * and there is no response body.
     */
    @DeleteMapping("/{taskId}")
    public ResponseEntity<Void> deleteTask(
            @PathVariable Long taskId) {

        taskService.deleteTask(taskId);

        return ResponseEntity.noContent().build();
    }

}


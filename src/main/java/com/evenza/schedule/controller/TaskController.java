package com.evenza.schedule.controller;

import com.evenza.common.auth.AuthService;
import com.evenza.common.user.User;
import com.evenza.common.user.UserRole;
import com.evenza.schedule.dto.CreateTaskRequest;
import com.evenza.schedule.dto.TaskResponse;
import com.evenza.schedule.dto.UpdateTaskRequest;
import com.evenza.schedule.service.TaskService;
import jakarta.validation.Valid;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Objects;
import com.evenza.event.repository.EventRepository;
import java.util.Set;

/**
 * Handles task CRUD operations and protects them using user roles.
 */
@RestController
@RequestMapping("/api/tasks")
public class TaskController {

    private final TaskService taskService;
    private final AuthService authService;
    private final EventRepository eventRepository;

    public TaskController(
            TaskService taskService,
            AuthService authService,
            EventRepository eventRepository) {

        this.taskService = taskService;
        this.authService = authService;
        this.eventRepository = eventRepository;
    }

    /**
     * Only Event Managers and Administrators can create tasks.
     */
    @PostMapping
    @PreAuthorize("hasAnyRole('EVENT_MANAGER', 'ADMIN')")
    public ResponseEntity<TaskResponse> createTask(
            @Valid @RequestBody CreateTaskRequest request) {

        TaskResponse createdTask = taskService.createTask(request);

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(createdTask);
    }

    /**
     * Managers and Administrators can view any task.
     * Inventory Staff can view only tasks assigned to themselves.
     */
    @GetMapping("/{taskId}")
    @PreAuthorize("hasAnyRole('EVENT_MANAGER', 'INVENTORY_STAFF', 'ADMIN')")
    public ResponseEntity<TaskResponse> getTaskById(
            @PathVariable Long taskId,
            Authentication authentication) {

        TaskResponse task = taskService.getTaskById(taskId);

        checkTaskAccess(task, authentication);

        return ResponseEntity.ok(task);
    }

    /**
     * Only Managers and Administrators can load all tasks of an event.
     */
    @GetMapping("/event/{eventId}")
    @PreAuthorize("hasAnyRole('EVENT_MANAGER', 'ADMIN')")
    public ResponseEntity<List<TaskResponse>> getTasksByEvent(
            @PathVariable Long eventId) {

        return ResponseEntity.ok(
                taskService.getTasksByEvent(eventId)
        );
    }

    /**
     * Managers and Administrators can load any staff member's tasks.
     * Inventory Staff can load only their own assigned tasks.
     */
    @GetMapping("/staff/{staffId}")
    @PreAuthorize("hasAnyRole('EVENT_MANAGER', 'INVENTORY_STAFF', 'ADMIN')")
    public ResponseEntity<List<TaskResponse>> getTasksByStaff(
            @PathVariable Long staffId,
            Authentication authentication) {

        User currentUser = getCurrentUser(authentication);

        if (currentUser.getRole() == UserRole.INVENTORY_STAFF
                && !Objects.equals(currentUser.getId(), staffId)) {

            throw new AccessDeniedException(
                    "You can view only tasks assigned to your account"
            );
        }

        return ResponseEntity.ok(
                taskService.getTasksByStaff(staffId)
        );
    }

    /**
     * Customers have read-only calendar access.
     * Managers, staff and administrators can also view the calendar.
     */
    @GetMapping("/calendar")
    @PreAuthorize("""
        hasAnyRole(
            'CUSTOMER',
            'EVENT_MANAGER',
            'INVENTORY_STAFF',
            'ADMIN'
        )
        """)
    public ResponseEntity<List<TaskResponse>> getCalendarTasks(
            @RequestParam
            @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME)
            LocalDateTime start,

            @RequestParam
            @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME)
            LocalDateTime end,

            Authentication authentication) {

        User currentUser = getCurrentUser(authentication);

        List<TaskResponse> calendarTasks =
                taskService.getCalendarTasks(start, end);

        // Customers can see calendar tasks only from their own events.
        if (currentUser.getRole() == UserRole.CUSTOMER) {

            Set<Long> customerEventIds =
                    eventRepository
                            .findByOrganiserId(currentUser.getId())
                            .stream()
                            .map(event -> event.getId())
                            .collect(java.util.stream.Collectors.toSet());

            calendarTasks = calendarTasks.stream()
                    .filter(task ->
                            customerEventIds.contains(task.eventId())
                    )
                    .toList();
        }

        // Operational staff can see only tasks assigned to themselves.
        if (currentUser.getRole() == UserRole.INVENTORY_STAFF) {

            calendarTasks = calendarTasks.stream()
                    .filter(task -> Objects.equals(
                            task.assignedStaffId(),
                            currentUser.getId()
                    ))
                    .toList();
        }

        return ResponseEntity.ok(calendarTasks);
    }

    /**
     * Only Managers and Administrators can edit task details.
     */
    @PutMapping("/{taskId}")
    @PreAuthorize("hasAnyRole('EVENT_MANAGER', 'ADMIN')")
    public ResponseEntity<TaskResponse> updateTask(
            @PathVariable Long taskId,
            @Valid @RequestBody UpdateTaskRequest request) {

        return ResponseEntity.ok(
                taskService.updateTask(taskId, request)
        );
    }

    /**
     * Only Managers and Administrators can assign staff.
     */
    @PatchMapping("/{taskId}/assign-staff/{staffId}")
    @PreAuthorize("hasAnyRole('EVENT_MANAGER', 'ADMIN')")
    public ResponseEntity<TaskResponse> assignStaff(
            @PathVariable Long taskId,
            @PathVariable Long staffId) {

        return ResponseEntity.ok(
                taskService.assignStaff(taskId, staffId)
        );
    }

    /**
     * Only Managers and Administrators can assign milestones.
     */
    @PatchMapping("/{taskId}/assign-milestone/{milestoneId}")
    @PreAuthorize("hasAnyRole('EVENT_MANAGER', 'ADMIN')")
    public ResponseEntity<TaskResponse> assignMilestone(
            @PathVariable Long taskId,
            @PathVariable Long milestoneId) {

        return ResponseEntity.ok(
                taskService.assignMilestone(taskId, milestoneId)
        );
    }

    /**
     * Inventory Staff can start only their own assigned task.
     * Managers and Administrators can start any task.
     */
    @PatchMapping("/{taskId}/start")
    @PreAuthorize("hasAnyRole('EVENT_MANAGER', 'INVENTORY_STAFF', 'ADMIN')")
    public ResponseEntity<TaskResponse> markInProgress(
            @PathVariable Long taskId,
            Authentication authentication) {

        TaskResponse task = taskService.getTaskById(taskId);

        checkTaskAccess(task, authentication);

        return ResponseEntity.ok(
                taskService.markInProgress(taskId)
        );
    }

    /**
     * Inventory Staff can complete only their own assigned task.
     * Managers and Administrators can complete any task.
     */
    @PatchMapping("/{taskId}/complete")
    @PreAuthorize("hasAnyRole('EVENT_MANAGER', 'INVENTORY_STAFF', 'ADMIN')")
    public ResponseEntity<TaskResponse> markCompleted(
            @PathVariable Long taskId,
            Authentication authentication) {

        TaskResponse task = taskService.getTaskById(taskId);

        checkTaskAccess(task, authentication);

        return ResponseEntity.ok(
                taskService.markCompleted(taskId)
        );
    }

    /**
     * Only Managers and Administrators can cancel tasks.
     */
    @PatchMapping("/{taskId}/cancel")
    @PreAuthorize("hasAnyRole('EVENT_MANAGER', 'ADMIN')")
    public ResponseEntity<TaskResponse> cancelTask(
            @PathVariable Long taskId) {

        return ResponseEntity.ok(
                taskService.cancelTask(taskId)
        );
    }

    /**
     * Only Managers and Administrators can manually check overdue tasks.
     */
    @PostMapping("/mark-overdue")
    @PreAuthorize("hasAnyRole('EVENT_MANAGER', 'ADMIN')")
    public ResponseEntity<Integer> markOverdueTasks() {

        int updatedTaskCount = taskService.markOverdueTasks();

        return ResponseEntity.ok(updatedTaskCount);
    }

    /**
     * Only Managers and Administrators can delete tasks.
     */
    @DeleteMapping("/{taskId}")
    @PreAuthorize("hasAnyRole('EVENT_MANAGER', 'ADMIN')")
    public ResponseEntity<Void> deleteTask(
            @PathVariable Long taskId) {

        taskService.deleteTask(taskId);

        return ResponseEntity.noContent().build();
    }

    /**
     * Gets the currently logged-in database user from their email address.
     */
    private User getCurrentUser(Authentication authentication) {
        return authService.findByEmailOrThrow(
                authentication.getName()
        );
    }

    /**
     * Managers and Administrators can access every task.
     * Inventory Staff can access only tasks assigned to their own account.
     */
    private void checkTaskAccess(
            TaskResponse task,
            Authentication authentication) {

        User currentUser = getCurrentUser(authentication);

        if (currentUser.getRole() == UserRole.EVENT_MANAGER
                || currentUser.getRole() == UserRole.ADMIN) {
            return;
        }

        boolean isAssignedStaff =
                currentUser.getRole() == UserRole.INVENTORY_STAFF
                        && Objects.equals(
                        task.assignedStaffId(),
                        currentUser.getId()
                );

        if (!isAssignedStaff) {
            throw new AccessDeniedException(
                    "You do not have permission to access this task"
            );
        }
    }
}
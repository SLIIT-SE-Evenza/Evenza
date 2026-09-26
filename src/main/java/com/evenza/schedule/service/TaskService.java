package com.evenza.schedule.service;

import com.evenza.common.user.User;
import com.evenza.common.user.UserRepository;
import com.evenza.common.user.UserRole;
import com.evenza.event.entity.Event;
import com.evenza.event.service.EventService;
import com.evenza.schedule.dto.CreateTaskRequest;
import com.evenza.schedule.dto.TaskResponse;
import com.evenza.schedule.dto.UpdateTaskRequest;
import com.evenza.schedule.entity.Milestone;
import com.evenza.schedule.entity.Task;
import com.evenza.schedule.entity.TaskStatus;
import com.evenza.schedule.repository.MilestoneRepository;
import com.evenza.schedule.repository.TaskRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
@Service
public class TaskService {

    //allow the service to communicate with the database.

    private final TaskRepository taskRepository;
    private final MilestoneRepository milestoneRepository;
    private final UserRepository userRepository;

    private final EventService eventService;

    //Constructor Injection

    public TaskService(
            TaskRepository taskRepository,
            MilestoneRepository milestoneRepository,
            UserRepository userRepository,
            EventService eventService) {

        this.taskRepository = taskRepository;
        this.milestoneRepository = milestoneRepository;
        this.userRepository = userRepository;
        this.eventService = eventService;
    }

    //@Transactional creates a database transaction
    @Transactional
    public TaskResponse createTask(CreateTaskRequest request) {


        validateTaskSchedule(request.startTime(), request.endTime(), request.deadline());

        // Find the event. EventService throws an error if it does not exist.
        Event event = eventService.getEventByIdOrThrow(request.eventId());

        // Create the Task entity using your existing constructor.
        Task task = new Task(
                event,
                request.title().trim(),
                cleanDescription(request.description()),
                request.startTime(),
                request.endTime(),
                request.deadline()
        );

        if (request.milestoneId() != null) {
            Milestone milestone = getMilestoneByIdOrThrow(
                    request.milestoneId()
            );

            // Prevent assigning a task to a milestone from another event.
            if (!milestone.getEvent().getId().equals(event.getId())) {
                throw new IllegalArgumentException(
                        "The milestone does not belong to this event"
                );
            }

            task.assignToMilestone(milestone);
        }

        if (request.assignedStaffId() != null) {
            User staff = getAssignableStaffByIdOrThrow(request.assignedStaffId());
            task.assignTo(staff);
        }

        Task savedTask = taskRepository.save(task);

        return convertToResponse(savedTask);
    }

    @Transactional(readOnly = true)
    public TaskResponse getTaskById(Long taskId) {
        Task task = getTaskByIdOrThrow(taskId);
        return convertToResponse(task);
    }

    @Transactional(readOnly = true)
    public List<TaskResponse> getTasksByEvent(Long eventId) {
        eventService.getEventByIdOrThrow(eventId);
        return taskRepository.findByEventIdOrderByStartTimeAsc(eventId)
                .stream()
                .map(this::convertToResponse)
                .toList();
    }

    @Transactional(readOnly = true)
    public List<TaskResponse> getTasksByStaff(Long staffId) {
        getAssignableStaffByIdOrThrow(staffId);
        return taskRepository.findByAssignedStaffId(staffId)
                .stream()
                .map(this::convertToResponse)
                .toList();
    }
    @Transactional(readOnly = true)
    public List<TaskResponse> getCalendarTasks(
            LocalDateTime rangeStart,
            LocalDateTime rangeEnd) {

        validateRange(rangeStart, rangeEnd);

        return taskRepository.findCalendarTasks(rangeStart, rangeEnd)
                .stream()
                .map(this::convertToResponse)
                .toList();
    }

    @Transactional
    public TaskResponse updateTask(
            Long taskId,
            UpdateTaskRequest request) {

        Task task = getTaskByIdOrThrow(taskId);

        validateTaskSchedule(request.startTime(), request.endTime(), request.deadline());

        Milestone milestone = null;
        if (request.milestoneId() != null) {
            milestone = getMilestoneByIdOrThrow(request.milestoneId());
            validateSameEvent(task, milestone);
        }

        User staff = request.assignedStaffId() == null
                ? null
                : getAssignableStaffByIdOrThrow(request.assignedStaffId());

        task.updateDetails(
                request.title().trim(),
                cleanDescription(request.description()),
                request.startTime(),
                request.endTime(),
                request.deadline()
        );
        task.assignToMilestone(milestone);
        task.assignTo(staff);

        Task updatedTask = taskRepository.save(task);

        return convertToResponse(updatedTask);
    }

    @Transactional
    public TaskResponse assignStaff(Long taskId, Long staffId) {
        Task task = getTaskByIdOrThrow(taskId);
        User staff = getAssignableStaffByIdOrThrow(staffId);

        task.assignTo(staff);

        return convertToResponse(taskRepository.save(task));
    }


    @Transactional
    public TaskResponse assignMilestone(
            Long taskId,
            Long milestoneId) {

        Task task = getTaskByIdOrThrow(taskId);
        Milestone milestone = getMilestoneByIdOrThrow(milestoneId);

        // The task and milestone must belong to the same event.
        validateSameEvent(task, milestone);

        task.assignToMilestone(milestone);

        return convertToResponse(taskRepository.save(task));
    }
    @Transactional
    public TaskResponse markInProgress(Long taskId) {
        Task task = getTaskByIdOrThrow(taskId);
        task.markInProgress();

        return convertToResponse(taskRepository.save(task));
    }

    // Mark the task as successfully completed.
    @Transactional
    public TaskResponse markCompleted(Long taskId) {
        Task task = getTaskByIdOrThrow(taskId);
        task.markCompleted();

        return convertToResponse(taskRepository.save(task));
    }

    // Cancel a task that is no longer required.
    @Transactional
    public TaskResponse cancelTask(Long taskId) {
        Task task = getTaskByIdOrThrow(taskId);
        task.cancel();

        return convertToResponse(taskRepository.save(task));
    }

    @Transactional
    public int markOverdueTasks() {

        List<TaskStatus> excludedStatuses = List.of(
                TaskStatus.COMPLETED,
                TaskStatus.CANCELLED,
                TaskStatus.OVERDUE
        );

        List<Task> overdueTasks =
                taskRepository.findByDeadlineBeforeAndStatusNotIn(
                        LocalDateTime.now(),
                        excludedStatuses
                );
        // Update every expired task to OVERDUE.
        overdueTasks.forEach(Task::markOverdue);

        // Save all changed tasks using one repository operation.
        taskRepository.saveAll(overdueTasks);

        // Return the number of tasks that were updated.
        return overdueTasks.size();
    }
    // Permanently delete a task using its ID.
    @Transactional
    public void deleteTask(Long taskId) {
        Task task = getTaskByIdOrThrow(taskId);
        taskRepository.delete(task);
    }

    // A helper method used whenever we need to find one task.
    private Task getTaskByIdOrThrow(Long taskId) {
        return taskRepository.findById(taskId)
                .orElseThrow(() -> new IllegalArgumentException(
                        "Task not found: " + taskId
                ));
    }

    // A helper method used whenever we need to find one milestone.
    private Milestone getMilestoneByIdOrThrow(Long milestoneId) {
        return milestoneRepository.findById(milestoneId)
                .orElseThrow(() -> new IllegalArgumentException(
                        "Milestone not found: " + milestoneId
                ));
    }

    // A helper method used whenever we need to find a user.
    private User getAssignableStaffByIdOrThrow(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException(
                        "User not found: " + userId
                ));

        if (user.getRole() != UserRole.ADMIN
                && user.getRole() != UserRole.EVENT_MANAGER
                && user.getRole() != UserRole.INVENTORY_STAFF) {
            throw new IllegalArgumentException(
                    "Selected user is not allowed to receive operational tasks"
            );
        }
        return user;
    }

    private void validateTaskSchedule(
            LocalDateTime startTime,
            LocalDateTime endTime,
            LocalDateTime deadline) {

        if (startTime == null || endTime == null || deadline == null) {
            throw new IllegalArgumentException(
                    "Start time, end time and deadline are required"
            );
        }
        // Backend validation prevents users from bypassing the browser validation.
        LocalDateTime currentMinute = LocalDateTime.now()
                .withSecond(0)
                .withNano(0);

        if (startTime.isBefore(currentMinute)) {
            throw new IllegalArgumentException(
                    "Task start time cannot be in the past"
            );
        }

        if (!endTime.isAfter(startTime)) {
            throw new IllegalArgumentException(
                    "End time must be after start time"
            );
        }

        if (deadline.isBefore(startTime) || deadline.isAfter(endTime)) {
            throw new IllegalArgumentException(
                    "Deadline must be between the task start and end time"
            );
        }
    }

    private void validateRange(LocalDateTime startTime, LocalDateTime endTime) {
        if (startTime == null || endTime == null || !endTime.isAfter(startTime)) {
            throw new IllegalArgumentException("Calendar end must be after calendar start");
        }
    }

    private void validateSameEvent(Task task, Milestone milestone) {
        if (!task.getEvent().getId().equals(milestone.getEvent().getId())) {
            throw new IllegalArgumentException(
                    "Task and milestone must belong to the same event"
            );
        }
    }

    private String cleanDescription(String description) {
        if (description == null || description.isBlank()) return null;
        return description.trim();
    }

    private TaskResponse convertToResponse(Task task) {

        Long milestoneId = task.getMilestone() != null
                ? task.getMilestone().getId()
                : null;

        Long assignedStaffId = task.getAssignedStaff() != null
                ? task.getAssignedStaff().getId()
                : null;

        return new TaskResponse(
                task.getId(),
                task.getEvent().getId(),
                milestoneId,
                assignedStaffId,
                task.getTitle(),
                task.getDescription(),
                task.getStartTime(),
                task.getEndTime(),
                task.getDeadline(),
                task.getStatus(),
                task.getUpdatedAt()
        );
    }



}

package com.evenza.schedule.repository;

import com.evenza.schedule.entity.Task;
import com.evenza.schedule.entity.TaskStatus;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDateTime;
import java.util.List;

public interface TaskRepository extends JpaRepository<Task, Long>{


    List<Task> findByEventId(Long eventId);

    // "SELECT * FROM tasks WHERE assigned_staff_id = ?"
    List<Task> findByAssignedStaffId(Long staffId);

    List<Task> findByMilestoneId(Long milestoneId);

    // Powers the calendar view (FR4): get all tasks starting within a date range.
    List<Task> findByStartTimeBetween(LocalDateTime rangeStart, LocalDateTime rangeEnd);

    // Powers the deadline-reminder job: find tasks whose deadline has passed
    List<Task> findByDeadlineBeforeAndStatusNotIn(LocalDateTime cutoff, List<TaskStatus> excludedStatuses);


}

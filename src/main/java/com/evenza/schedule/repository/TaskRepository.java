package com.evenza.schedule.repository;

import com.evenza.schedule.entity.Task;
import com.evenza.schedule.entity.TaskStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDateTime;
import java.util.List;

public interface TaskRepository extends JpaRepository<Task, Long>{


    List<Task> findByEventIdOrderByStartTimeAsc(Long eventId);

    // "SELECT * FROM tasks WHERE assigned_staff_id = ?"
    List<Task> findByAssignedStaffId(Long staffId);

    List<Task> findByMilestoneId(Long milestoneId);

    // Powers the calendar view (FR4): get all tasks starting within a date range.
    @Query("""
            SELECT t FROM Task t
            WHERE t.startTime < :rangeEnd
              AND t.endTime > :rangeStart
            ORDER BY t.startTime ASC
            """)
    List<Task> findCalendarTasks(
            @Param("rangeStart") LocalDateTime rangeStart,
            @Param("rangeEnd") LocalDateTime rangeEnd);

    // Powers the deadline-reminder job: find tasks whose deadline has passed
    List<Task> findByDeadlineBeforeAndStatusNotIn(LocalDateTime cutoff, List<TaskStatus> excludedStatuses);

    boolean existsByMilestoneId(Long milestoneId);


}

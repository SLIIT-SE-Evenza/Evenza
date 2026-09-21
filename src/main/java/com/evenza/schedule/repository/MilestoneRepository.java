package com.evenza.schedule.repository;

import com.evenza.schedule.entity.Milestone;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface MilestoneRepository extends JpaRepository<Milestone, Long> {

    List<Milestone> findByEventId(Long eventId);


}

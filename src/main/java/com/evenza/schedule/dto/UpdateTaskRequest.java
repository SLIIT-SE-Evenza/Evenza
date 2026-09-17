package com.evenza.schedule.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record UpdateTaskRequest(

    @NotBlank(message = "Task title is required")
    @Size(max = 150, message = "Title cannot exceed 150 characters")
    String title,

    @Size(max = 1000, message = "Description cannot exceed 1000 characters")
    String description
){

}

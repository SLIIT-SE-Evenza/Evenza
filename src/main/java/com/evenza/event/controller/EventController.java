package com.evenza.event.controller;

import com.evenza.event.dto.EventRequest;
import com.evenza.event.dto.EventResponse;
import com.evenza.event.service.EventService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/** REST controller: each annotation maps one HTTP CRUD operation to Java. */
@RestController
@RequestMapping("/api/events")
public class EventController {
    private final EventService service;

    public EventController(EventService service) {
        this.service = service; // Constructor injection makes the dependency testable.
    }

    @PostMapping
    public ResponseEntity<EventResponse> create(@Valid @RequestBody EventRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(service.create(request));
    }

    @GetMapping
    public List<EventResponse> all() { return service.findAll(); }

    @GetMapping("/{id}")
    public EventResponse one(@PathVariable Long id) { return service.findOne(id); }

    @PutMapping("/{id}")
    public EventResponse update(@PathVariable Long id, @Valid @RequestBody EventRequest request) {
        return service.update(id, request);
    }

    @PatchMapping("/{id}/{action}")
    public EventResponse status(@PathVariable Long id, @PathVariable String action) {
        return service.changeStatus(id, action);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        service.delete(id);
        return ResponseEntity.noContent().build();
    }
}

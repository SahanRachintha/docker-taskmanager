package com.example.auth.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.example.auth.model.Task;
import com.example.auth.repository.TaskRepository;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/tasks")
public class TaskController {

    @Autowired
    private TaskRepository taskRepository;

    // List all tasks
    @GetMapping
    public ResponseEntity<List<Task>> getAll() {
        List<Task> tasks = taskRepository.findAll();
        return ResponseEntity.ok(tasks);
    }

    // Get single task
    @GetMapping("/{id}")
    public ResponseEntity<?> getById(@PathVariable String id) {
        Optional<Task> t = taskRepository.findById(id);
        return t.<ResponseEntity<?>>map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.status(404).body("Task not found"));
    }


    // Create task
    @PostMapping
    public ResponseEntity<?> create(@RequestBody Task task) {
        if (task.getTitle() == null || task.getTitle().trim().isEmpty()) {
            return ResponseEntity.badRequest().body("Title is required");
        }
        Task saved = taskRepository.save(new Task(task.getTitle(), task.getDescription()));
        return ResponseEntity.ok(saved);
    }

    // Update task
    @PutMapping("/{id}")
    public ResponseEntity<?> update(@PathVariable String id, @RequestBody Task updates) {
        Optional<Task> existing = taskRepository.findById(id);
        if (!existing.isPresent()) {
            return ResponseEntity.status(404).body("Task not found");
        }
        Task task = existing.get();
        if (updates.getTitle() != null) task.setTitle(updates.getTitle());
        if (updates.getDescription() != null) task.setDescription(updates.getDescription());
        task.setDone(updates.isDone());
        taskRepository.save(task);
        return ResponseEntity.ok(task);
    }

    // Delete task
    @DeleteMapping("/{id}")
    public ResponseEntity<?> delete(@PathVariable String id) {
        Optional<Task> existing = taskRepository.findById(id);
        if (!existing.isPresent()) {
            return ResponseEntity.status(404).body("Task not found");
        }
        taskRepository.deleteById(id);
        return ResponseEntity.ok().body("Task deleted");
    }
}

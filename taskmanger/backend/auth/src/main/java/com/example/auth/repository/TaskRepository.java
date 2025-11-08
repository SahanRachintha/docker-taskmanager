package com.example.auth.repository;

import org.springframework.data.mongodb.repository.MongoRepository;
import com.example.auth.model.Task;

public interface TaskRepository extends MongoRepository<Task, String> {
    // add custom queries here if needed later
}

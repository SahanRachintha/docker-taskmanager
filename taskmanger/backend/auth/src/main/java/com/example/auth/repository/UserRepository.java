package com.example.auth.repository;

import org.springframework.data.mongodb.repository.MongoRepository;
import com.example.auth.model.User;

public interface UserRepository extends MongoRepository<User, String> {
    User findByEmail(String email);
}


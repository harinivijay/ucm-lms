package com.adbproject.librarymanagementsystem.repository;

import com.adbproject.librarymanagementsystem.model.User;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface UserRepository extends MongoRepository<User, String> {
    // Custom query methods (if needed) can be added here
    Optional<User> findByUsername(String username);
    List<User> findByCreatedDateAfter(LocalDateTime createdAt);

}

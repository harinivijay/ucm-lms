package com.adbproject.librarymanagementsystem.repository;

import com.adbproject.librarymanagementsystem.model.Admin;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface AdminRepository extends MongoRepository<Admin, String> {
    // Custom query methods (if needed) can be added here
    Optional<Admin> findByUsername(String username);
}

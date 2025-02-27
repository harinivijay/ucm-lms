package com.adbproject.librarymanagementsystem.repository;

import com.adbproject.librarymanagementsystem.model.Librarian;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface LibrarianRepository extends MongoRepository<Librarian, String> {
    // Custom query methods (if needed) can be added here
    Optional<Librarian> findByUsername(String username);
}

package com.adbproject.librarymanagementsystem.repository;

import com.adbproject.librarymanagementsystem.model.Book;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface BookRepository extends MongoRepository<Book, String> {
    // Custom query methods (if needed) can be added here
    Book findByBookId(String bookId);
    List<Book> findByCategory(String categoryName);
    List<Book> findByAvailable(boolean isAvailable);
    List<Book> findByLocation(String location);
    List<Book> findByBookName(String bookName);

}

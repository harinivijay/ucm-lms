package com.adbproject.librarymanagementsystem.controller;

import com.adbproject.librarymanagementsystem.dto.AddBookRequest;
import com.adbproject.librarymanagementsystem.dto.BookDTO;
import com.adbproject.librarymanagementsystem.model.Book;
import com.adbproject.librarymanagementsystem.model.Category;
import com.adbproject.librarymanagementsystem.model.Location;
import com.adbproject.librarymanagementsystem.service.BookDetailsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/lms/books")
public class BookManagementController {

    @Autowired
    private BookDetailsService bookDetailsService;
    @GetMapping("/grouped")
    public Map<String, Object> getAllBooks(@RequestParam(defaultValue = "0") int pageNumber,
                                        @RequestParam(defaultValue = "10") int size, @RequestParam(defaultValue = "All") String locationFilter,
                                        @RequestParam(defaultValue = "All") String categoryFilter, @RequestParam(defaultValue = "") String search) {
        return bookDetailsService.getGroupedBooksWithCounts(pageNumber, size, locationFilter, categoryFilter, search);
    }

//    @GetMapping("/grouped/user")
//    public Map<String, Object> getAllBooksForUser(@RequestParam(defaultValue = "0") int pageNumber,
//                                           @RequestParam(defaultValue = "10") int size, @RequestParam(defaultValue = "All") String locationFilter,
//                                           @RequestParam(defaultValue = "All") String categoryFilter, @RequestParam(defaultValue = "") String search,
//                                                  @RequestParam(defaultValue = "") String user) {
//        return bookDetailsService.getGroupedBooksForUser(pageNumber, size, locationFilter, categoryFilter, search, user);
//    }

//
//    @GetMapping("/list")
//    public Book getBookByBookIdAndLocation(
//            @RequestParam("bookId") String bookId,
//            @RequestParam("location") String location) {
//        return bookDetailsService.getBookByBookIdAndLocation(bookId, location);
//    }

    @GetMapping("/details/id/{bookId}")
    public Book getBookDetailsByBookId(@PathVariable String bookId) {
        // Fetch the list of books using the service layer
       return bookDetailsService.getBookDetailsByBookId(bookId);
    }
    @PostMapping("/addBooks")
    public ResponseEntity<?> addBooks(@RequestBody AddBookRequest bookRequest) {
        try {
            bookDetailsService.addBooks(bookRequest);
            return ResponseEntity.ok("Books added successfully!");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error adding books");
        }
    }


    @PutMapping("/details/bookId/{bookId}")
    public ResponseEntity<String> updateBookDetailsById(
            @PathVariable String bookId,
            @RequestBody Book updatedBook) {
        try {
            bookDetailsService.updateBookDetailsById(bookId, updatedBook);
            return ResponseEntity.ok("Book updated successfully.");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body("Error updating book: " + e.getMessage());
        }
    }

    @DeleteMapping("bookId/{bookId}")
    public ResponseEntity<String> deleteBook(@PathVariable String bookId) {
        try {
            bookDetailsService.deleteBook(bookId);
            return ResponseEntity.ok("Book deleted successfully.");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body("Error deleting book: " + e.getMessage());
        }
    }

    @GetMapping("/locations")
    public List<Location> getAllLocations() {
        return bookDetailsService.getAllLocations();
    }

    @GetMapping("/categories")
    public List<Category> getAllCategories() {
        return bookDetailsService.getAllCategories();
    }

}

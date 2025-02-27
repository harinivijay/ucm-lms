package com.adbproject.librarymanagementsystem.service;

import com.adbproject.librarymanagementsystem.dto.AddBookRequest;
import com.adbproject.librarymanagementsystem.model.*;
import com.adbproject.librarymanagementsystem.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

import java.util.*;
import java.util.stream.Collectors;

@Service
public class BookDetailsService {

    @Autowired
    private BookRepository bookRepository;
    @Autowired
    private LocationRepository locationRepository;
    @Autowired
    private CategoryRepository categoryRepository;
    @Autowired
    private BookLoanDetailRepository bookLoanDetailRepository;
    @Autowired
    private BookReservationDetailRepository bookReservationDetailRepository;


    public Map<String, Object> getGroupedBooksWithCounts(int pageNumber, int pageSize, String location, String category, String searchQuery) {
        // Fetch books based on provided filters
        List<Book> filteredBooks;

        // Handle search query
        if (!searchQuery.isEmpty()) {
            filteredBooks = bookRepository.findByBookName(searchQuery); // Fetch books by search query
        } else {
            // If no search query, fetch all books
            filteredBooks = bookRepository.findAll();
        }

        // Handle location filter
        if (location != null && !location.isEmpty() && !"All".equals(location)) {
            filteredBooks = filteredBooks.stream()
                    .filter(book -> book.getLocation().equals(location))
                    .collect(Collectors.toList());
        }

        // Handle category filter
        if (category != null && !category.isEmpty() && !"All".equals(category)) {
            filteredBooks = filteredBooks.stream()
                    .filter(book -> book.getCategory().equals(category))
                    .collect(Collectors.toList());
        }



        filteredBooks.sort(Comparator.comparing(Book::getBookName));
        // Sort books by book name

        // Implement pagination
        int start = Math.min(pageNumber * pageSize, filteredBooks.size());
        int end = Math.min((pageNumber + 1) * pageSize, filteredBooks.size());
        List<Book> paginatedBooks = filteredBooks.subList(start, end);

        // Prepare response with pagination info
        Map<String, Object> response = new HashMap<>();
        response.put("books", paginatedBooks);
        response.put("totalBooks", filteredBooks.size());
        response.put("totalPages", (int) Math.ceil((double) filteredBooks.size() / pageSize));

        return response;
    }

//    public Map<String, Object> getGroupedBooksForUser(int pageNumber, int pageSize, String location, String category, String searchQuery, String userId) {
//        // Fetch grouped books with counts (including metadata like totalBooks, totalPages)
//        Map<String, Object> bookList = getGroupedBooksWithCounts(pageNumber, pageSize, location, category, searchQuery);
//        List<Book> books = (List<Book>) bookList.get("books");
//
//        // Fetch loan and reservation data for the user
//        List<BookLoanDetail> userBookingList =  bookLoanDetailRepository.findByUserId(userId);
//        List<BookReservationDetail> reserveBookResponseList = bookReservationDetailRepository.findByUserId(userId);
//        System.out.println(userId);
//
//        System.out.println(userBookingList);
//        System.out.println(reserveBookResponseList);
//
//        // Create sets for quick lookup
//        Set<String> loanedBooks = new HashSet<>();
//        for (BookLoanDetail loanDetail : userBookingList) {
//            Book book = bookRepository.findByBookId(loanDetail.getBookId());
//            // Fetch the book by bookId
//            if (loanDetail.getCheckedOutBy() != null && loanDetail.getReturnDate() == null) {
//
//                loanedBooks.add(book.getBookId());
//            }
//            if((Arrays.asList("Delivered Online", "Preparing for Pickup", "Ready for Pickup").contains(loanDetail.getStatus()))) {
//                loanedBooks.add(book.getBookId());
//            }
//        }
//
//        Set<String> reservedBooks = new HashSet<>();
//        Map<String, BookReservationDetail> latestReservationsMap = reserveBookResponseList.stream()
//                .collect(Collectors.toMap(
//                        BookReservationDetail::getBookId,  // Group by bookid
//                        reservation -> reservation,  // Use reservation as value
//                        (existing, replacement) -> existing.getRequestedDate().isAfter(replacement.getRequestedDate()) ? existing : replacement // Keep the latest one
//                ));
//        for (BookReservationDetail reservationDetail : latestReservationsMap.values()) {
//            // Check reservation status
//            if (!(Arrays.asList("Reservation Denied", "Cancelled", "Order Issued")
//                    .contains(reservationDetail.getReservationStatus()))) {
//                reservedBooks.add(reservationDetail.getBookId());
//            }
//        }
//
//
//        // Since books are directly modified, bookList will automatically reflect these changes.
//        return bookList;
//    }


    public Book getBookDetailsByBookId(String bookId) {
        return bookRepository.findByBookId(bookId);
    }

    public void addBooks(AddBookRequest bookRequest) {
        if(bookRequest.getCategory().equals("E-Book")){
            bookRequest.setBookId(bookRequest.getBookId()+"-M");
            bookRequest.setLocation("MIC Campus");
            addBook(bookRequest);
            bookRequest.setBookId(bookRequest.getBookId()+"-U");
            bookRequest.setLocation("UCM Campus");
            addBook(bookRequest);
        }
        else {
                addBook(bookRequest);
            }

    }

    private void addBook(AddBookRequest bookRequest) {
        Book newBook = new Book();
        newBook.setBookId(bookRequest.getBookId());
        newBook.setBookName(bookRequest.getBookName());
        newBook.setDescription(bookRequest.getDescription());
        newBook.setAuthorName(bookRequest.getAuthorName());
        newBook.setEdition(bookRequest.getEdition());
        newBook.setCategory(bookRequest.getCategory());
        newBook.setLocation(bookRequest.getLocation());
        newBook.setAvailable(true); // Mark the new copy as available

        // Save the new book copy
        bookRepository.save(newBook);
    }
    public void updateBookDetailsById(String bookId, Book updateBookRequest) {
       Book book = bookRepository.findByBookId(bookId);

        // Apply updated fields to all books
        book.setBookName(updateBookRequest.getBookName());
        book.setDescription(updateBookRequest.getDescription());
        book.setAuthorName(updateBookRequest.getAuthorName());
        book.setEdition(updateBookRequest.getEdition());
        book.setCategory(updateBookRequest.getCategory());
        book.setLocation(updateBookRequest.getLocation());
        book.setAvailable(true);
        // Save all updated books
        bookRepository.save(book);
    }

    public void deleteBook(String bookId) {
        Optional<Book> book = bookRepository.findById(bookId);
        if (book.isPresent()) {
            bookRepository.delete(book.get());
        } else {
            throw new IllegalArgumentException("Book not found");
        }
    }

    public List<Location> getAllLocations() {
        return locationRepository.findAll();
    }

    public List<Category> getAllCategories() {
        return categoryRepository.findAll();
    }


}

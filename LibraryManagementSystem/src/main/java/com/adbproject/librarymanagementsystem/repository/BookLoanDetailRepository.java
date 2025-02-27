package com.adbproject.librarymanagementsystem.repository;

import com.adbproject.librarymanagementsystem.model.BookLoanDetail;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.Date;
import java.util.List;
import java.util.Optional;

@Repository
public interface BookLoanDetailRepository extends MongoRepository<BookLoanDetail, String> {
    // Custom query methods (if needed) can be added here
    List<BookLoanDetail> findByUserId(String userId);
    List<BookLoanDetail> findByBookId(String bookId);
    List<BookLoanDetail> findByLibrarianId(String librarianId);
    List<BookLoanDetail> findByStatus(String status);
    List<BookLoanDetail> findByStatusIn(List<String> statuses);
    List<BookLoanDetail> findByRenewalCountGreaterThan(int count);
    List<BookLoanDetail> findByBookIdAndStatusAndReturnDateIsNullAndCheckoutDateIsNotNull(String bookId, String status);
    long countByReturnDateIsNullAndCheckoutDateIsNotNull();
    long countByStatus(String statuses);
    long countByStatusIn(List<String> statuses);
    @Query("{ 'dueDate': { $lt: ?0 }, 'returnDate': { $eq: null } }")
    Long countOverdueBooks(java.util.Date currentDate);
    @Query("{'checkoutDate': { $gte: ?0, $lte: ?1 }, 'returnDate': null}")
    List<BookLoanDetail> findByLoanedBooksBetweenDates(Date startDate, Date endDate);

}

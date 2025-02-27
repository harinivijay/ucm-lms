package com.adbproject.librarymanagementsystem.repository;

import com.adbproject.librarymanagementsystem.model.BookReservationDetail;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.Date;
import java.util.List;

@Repository
public interface BookReservationDetailRepository extends MongoRepository<BookReservationDetail, String> {
    // Custom query methods (if needed) can be added here
    List<BookReservationDetail> findByUserId(String userId);
    List<BookReservationDetail> findByBookId(String bookId);
     BookReservationDetail findByBookIdAndReservationStatus(String bookId, String reservationStatus);
    List<BookReservationDetail> findByReservationStatus(String reservationStatus);
    List<BookReservationDetail> findByReservationStatusIn(List<String> reservationStatus);
    long countByReservationStatus(String reservationStatus);
    @Query("{'requestedDate': { $gte: ?0, $lte: ?1 }, 'reservationStatus': { $in: ['Reserved', 'Order Issued'] }}")
    List<BookReservationDetail> findByReservedBooksBetweenDates(Date startDate, Date endDate);
}

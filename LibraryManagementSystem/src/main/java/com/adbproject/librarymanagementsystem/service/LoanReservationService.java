package com.adbproject.librarymanagementsystem.service;

import com.adbproject.librarymanagementsystem.dto.BookStatistics;
import com.adbproject.librarymanagementsystem.dto.LoanBookResponse;
import com.adbproject.librarymanagementsystem.dto.ReservationRequest;
import com.adbproject.librarymanagementsystem.dto.ReserveBookResponse;
import com.adbproject.librarymanagementsystem.model.Book;
import com.adbproject.librarymanagementsystem.model.BookLoanDetail;
import com.adbproject.librarymanagementsystem.model.BookReservationDetail;
import com.adbproject.librarymanagementsystem.repository.BookLoanDetailRepository;
import com.adbproject.librarymanagementsystem.repository.BookRepository;
import com.adbproject.librarymanagementsystem.repository.BookReservationDetailRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;
import java.util.*;

@Service
public class LoanReservationService {

    @Autowired
    private BookLoanDetailRepository bookLoanDetailRepository;
    @Autowired
    private BookReservationDetailRepository reservationDetailRepository;
    @Autowired
    private BookRepository bookRepository;
    @Autowired
    private AuthService authService;
    @Autowired
    private BookReservationDetailRepository bookReservationDetailRepository;

    // Get all loan requests (for dashboard or librarian view)
    public List<LoanBookResponse> getAllLoanRequests() {
        List<BookLoanDetail> loanDetailList = bookLoanDetailRepository.findAll();
        return getBookLoanDetails(loanDetailList);
    }

    public List<LoanBookResponse> getPendingLoanRequestsByStatus(String status) {
        List<BookLoanDetail> PendingLoanDetailList = bookLoanDetailRepository.findByStatus(status);
        return getBookLoanDetails(PendingLoanDetailList);
    }

    public List<LoanBookResponse> getLoanRequestsByStatuses(List<String> statuses) {
        List<BookLoanDetail> loanDetails = bookLoanDetailRepository.findByStatusIn(statuses);
        return getBookLoanDetails(loanDetails);
    }

    // Get loan requests by user (for customer to see their bookings)
    public List<LoanBookResponse> getLoanRequestsByUser(String userId) {
        List<BookLoanDetail> UserBookingList =  bookLoanDetailRepository.findByUserId(userId);
        return getBookLoanDetails(UserBookingList);
    }

    private List<LoanBookResponse> getBookLoanDetails(List<BookLoanDetail> bookingList) {
        List<LoanBookResponse> loanBookResponseList = new ArrayList<>();
        for (BookLoanDetail bookLoanDetail : bookingList) {
            LoanBookResponse loanBookResponse = new LoanBookResponse();
            loanBookResponse.setLoanId(bookLoanDetail.getLoanId());
            loanBookResponse.setLocation(bookLoanDetail.getLocation());
            loanBookResponse.setUserName(authService.getUserNameFromId(bookLoanDetail.getUserId()));
            loanBookResponse.setRequestedDate(bookLoanDetail.getLastUpdatedDate());
            loanBookResponse.setCheckoutDate(bookLoanDetail.getCheckoutDate());
            loanBookResponse.setDueDate(bookLoanDetail.getDueDate());
            loanBookResponse.setReturnDate(bookLoanDetail.getReturnDate());
            loanBookResponse.setRenewalCount(bookLoanDetail.getRenewalCount());
            loanBookResponse.setFineAmount(bookLoanDetail.getFineAmount());
            loanBookResponse.setStatus(bookLoanDetail.getStatus());
            Book book = bookRepository.findByBookId(bookLoanDetail.getBookId());
            if (book != null) {
                loanBookResponse.setBookId(book.getBookId());
                loanBookResponse.setBookName(book.getBookName());
                loanBookResponse.setDescription(book.getDescription());
                loanBookResponse.setAuthorName(book.getAuthorName());
                loanBookResponse.setEdition(book.getEdition());
                loanBookResponse.setCategory(book.getCategory());
                loanBookResponse.setAvailable(book.isAvailable());
                if(bookLoanDetail.getStatus().equals("Pending Renewal")){
                    loanBookResponse.setReserved(!bookReservationDetailRepository.findByBookId(book.getBookId()).isEmpty());
                }
            }
            loanBookResponseList.add(loanBookResponse);
        }
        loanBookResponseList.sort(Comparator.comparing(LoanBookResponse::getRequestedDate).reversed());
        return  loanBookResponseList;
    }

    private List<ReserveBookResponse> getBookReservationDetails(List<BookReservationDetail> bookingList) {
        List<ReserveBookResponse> reserveBookResponseList = new ArrayList<>();
        for (BookReservationDetail bookReservationDetail : bookingList) {
            ReserveBookResponse reserveBookResponse = new ReserveBookResponse();
            reserveBookResponse.setReservationId(bookReservationDetail.getReservationId());
            reserveBookResponse.setUserName(authService.getUserNameFromId(bookReservationDetail.getUserId()));
            reserveBookResponse.setRequestedDate(bookReservationDetail.getRequestedDate());
            reserveBookResponse.setReserveByDate(bookReservationDetail.getReserveByDate());;
            reserveBookResponse.setStatus(bookReservationDetail.getReservationStatus());
            Book book = bookRepository.findByBookId(bookReservationDetail.getBookId());
            LocalDateTime availabilityDate = null;
            List<BookLoanDetail> loanDetails = bookLoanDetailRepository.findByBookIdAndStatusAndReturnDateIsNullAndCheckoutDateIsNotNull(bookReservationDetail.getBookId(), "Loaned");
            if (!loanDetails.isEmpty()) {
                BookLoanDetail bookLoanDetail = loanDetails.get(0);
                availabilityDate = bookLoanDetail.getDueDate();
            }

            if (availabilityDate == null) {
                // Set availabilityDate to a default value, e.g., the current date-time
                availabilityDate = LocalDateTime.now();
            }
            reserveBookResponse.setExpectedAvailabilityDate(availabilityDate);
            if (book != null) {
                reserveBookResponse.setBookName(book.getBookName());
                reserveBookResponse.setDescription(book.getDescription());
                reserveBookResponse.setAuthorName(book.getAuthorName());
                reserveBookResponse.setEdition(book.getEdition());
                reserveBookResponse.setCategory(book.getCategory());
                reserveBookResponse.setLocation(book.getLocation());
            }
            reserveBookResponseList.add(reserveBookResponse);
        }
        reserveBookResponseList.sort(Comparator.comparing(ReserveBookResponse::getRequestedDate).reversed());

        return reserveBookResponseList;
    }

    // Get loan request by its ID
    public Optional<BookLoanDetail> getLoanRequestById(String loanId) {
        return bookLoanDetailRepository.findById(loanId);
    }

    // Get reservation details (for dashboard, librarian view)
    public List<ReserveBookResponse> getReservations() {
        return getBookReservationDetails(reservationDetailRepository.findAll());
    }

    public List<ReserveBookResponse> getReservationsByStatuses(List<String> status) {
        return getBookReservationDetails(reservationDetailRepository.findByReservationStatusIn(status));
    }

    public List<ReserveBookResponse> getReservationsByUser(String userId) {
        return getBookReservationDetails(reservationDetailRepository.findByUserId(userId));
    }

    // Get all renewals (for tracking renewals)
    public List<BookLoanDetail> getRenewals() {
        return bookLoanDetailRepository.findByRenewalCountGreaterThan(0);  // Only books with renewals
    }

    // Get all requests (loans, reservations, and renewals) for the booking list
    public List<BookLoanDetail> getBookingList() {
        return bookLoanDetailRepository.findAll();
    }

    // Customer initiates a checkout request (sets it to 'Pending')
    public void requestCheckout(String bookId, String userId, String location) {

        Book book =bookRepository.findByBookId(bookId);
        if (!book.isAvailable()) {
            throw new RuntimeException("Book is not available for checkout");
        }

        // Create a new loan entry with 'Pending' status
        BookLoanDetail loanDetail = new BookLoanDetail();
        loanDetail.setBookId(book.getBookId());
        loanDetail.setUserId(userId);
        loanDetail.setStatus("Preparing for Pickup");  // Request is pending librarian approval
        loanDetail.setCheckoutDate(null);  // No checkout date yet
        loanDetail.setDueDate(null);  // No due date yet
        loanDetail.setFineAmount(0.0);
        loanDetail.setRenewalCount(0);
        loanDetail.setLocation(location);
        loanDetail.setLastUpdatedDate(LocalDateTime.now());

        // Save the loan detail in 'Pending' status
        if(book.getCategory().equals("E-Book")) {
            loanDetail.setStatus("Delivered Online");
            loanDetail.setCheckoutDate(LocalDateTime.now());  // No checkout date yet
            loanDetail.setDueDate(null);
            book.setAvailable(true);
        }else{
            book.setAvailable(false);
        }
        bookLoanDetailRepository.save(loanDetail);
        bookRepository.save(book);


    }

    // Librarian approves or denies checkout request
    public void updateCheckoutRequest(String loanId, String status, String librarianId, String location) {
        Optional<BookLoanDetail> loanOpt = bookLoanDetailRepository.findById(loanId);

        if (loanOpt.isEmpty()) {
            throw new RuntimeException("Loan request not found");
        }
        BookLoanDetail loanDetail = loanOpt.get();
        Book book = bookRepository.findByBookId(loanDetail.getBookId());

        BookReservationDetail bookReservationDetail = reservationDetailRepository.findByBookIdAndReservationStatus(book.getBookId(),"Reserved");
        loanDetail.setStatus(status);

        if (Objects.equals(status, "Loaned")) {
            // Update loan details if approved
            loanDetail.setCheckoutDate(LocalDateTime.now());  // Set checkout date
            loanDetail.setCheckedOutBy(librarianId);
            loanDetail.setDueDate(LocalDateTime.now().plusWeeks(2));  // Set due date
            // Mark the book as unavailable since it's checked out
            book.setAvailable(false);
        } else if (Objects.equals(status, "Returned")) {
           loanDetail.setStatus("Returned");
           loanDetail.setReturnDate(LocalDateTime.now());
           loanDetail.setCheckedInBy(librarianId);
           book.setAvailable(true);
           bookRepository.save(book);
            if (!(bookReservationDetail == null)) {
                requestCheckout(loanDetail.getBookId(), bookReservationDetail.getUserId(),bookReservationDetail.getLocation());
                bookReservationDetail.setReservationStatus("Order Issued");
                bookReservationDetail.setReserveByDate(LocalDateTime.now().plusDays(1));
                book.setReserved(false);
                reservationDetailRepository.save(bookReservationDetail);
            }
        } else if (Objects.equals(status, "Canceled")) {
            book.setAvailable(true);
            }
        loanDetail.setLastUpdatedDate(LocalDateTime.now());
        loanDetail.setLibrarianId(librarianId);
       if(!(location == null)) {
           book.setLocation(location);
       }
        // Save the updated loan details
        bookRepository.save(book);
        bookLoanDetailRepository.save(loanDetail);
    }



    // Request for a renewal (by user)
    public void requestRenewal(String loanId) {
        Optional<BookLoanDetail> loanDetailOpt = bookLoanDetailRepository.findById(loanId);
        System.out.println(loanDetailOpt.isPresent());

        if (loanDetailOpt.isPresent()) {
            System.out.println("loan present");
            BookLoanDetail loanDetail = loanDetailOpt.get();
            BookReservationDetail bookReservationDetail = reservationDetailRepository.findByBookIdAndReservationStatus(loanDetail.getBookId(),"Reserved");
            if(loanDetail.getRenewalCount()<3 && (bookReservationDetail == null)) {
                loanDetail.setDueDate(loanDetail.getDueDate().plusWeeks(2));
                loanDetail.setRenewalCount(loanDetail.getRenewalCount()+1);
                loanDetail.setStatus("Renewed");

            }else{
                loanDetail.setStatus("Renewal Denied");
            }
            bookLoanDetailRepository.save(loanDetail);
        } else {
            throw new IllegalArgumentException("Loan ID not found.");
        }
    }

    // Request for a reservation (by user)
    public String requestReservation(ReservationRequest reservationRequest) {
        BookReservationDetail reservationDetail = new BookReservationDetail();
        LocalDateTime availabilityDate = null;
        List<BookLoanDetail> latestLoanDetail = bookLoanDetailRepository.findByStatusIn(Arrays.asList("Loaned","Preparing for Pickup","Preparing for Pickup","Renewed","Renewal Denied"));
        BookLoanDetail bookLoanDetail = latestLoanDetail.get(0);

        if(bookLoanDetail != null) {
            availabilityDate = bookLoanDetail.getDueDate();
        }
        if (availabilityDate == null) {
            availabilityDate = LocalDateTime.now();
        }
         String message;
        reservationDetail.setReservationStatus("Reserved");
        bookRepository.findByBookId(reservationRequest.getBookId()).setReserved(true);
        message = "Reservation Successful";
//        if(availabilityDate.isBefore(reservationRequest.getReservationDate()))
//        {
//            reservationDetail.setReservationStatus("Reserved");
//            bookRepository.findByBookId(reservationRequest.getBookId()).setReserved(true);
//            message = "Reservation Successful";
//        }else{
//            reservationDetail.setReservationStatus("Reservation Denied");
//            message = "Reservation Denied as the Book is not available before requested date";
//        }
        reservationDetail.setBookId(reservationRequest.getBookId());
        reservationDetail.setUserId(reservationRequest.getUserId());
        reservationDetail.setReserveByDate(availabilityDate.plusDays(1));
        reservationDetail.setRequestedDate(LocalDateTime.now());
        reservationDetail.setLocation(reservationRequest.getLocation());
        reservationDetailRepository.save(reservationDetail);

        return message;
    }

    // Librarian approves or denies checkout request
    public void updateReservation(String reservationId, String status) {
        BookReservationDetail reservationDetail = reservationDetailRepository.findById(reservationId).orElseThrow(() -> new RuntimeException("Reservation ID not found"));
        reservationDetail.setReservationStatus(status);
        reservationDetailRepository.save(reservationDetail);
    }


    public BookStatistics getBookStatistics() {
        BookStatistics stats = new BookStatistics();

        // Total Books
        long totalBooks = bookRepository.count();
        stats.setTotalBooks((int) totalBooks);

        // Loaned Books (Books that are loaned but not yet returned)
        long loanedBooks = bookLoanDetailRepository.countByReturnDateIsNullAndCheckoutDateIsNotNull();
        stats.setLoanedBooks((int) (loanedBooks));

        // Reserved Books (Books that are reserved)
        long reservedBooks = bookReservationDetailRepository.countByReservationStatus("Reserved");
        long reserveIssuedBooks = bookReservationDetailRepository.countByReservationStatus("Order Issued");

        stats.setReservedBooks((int) (reservedBooks+reserveIssuedBooks));

        // Overdue Books (Books that are overdue - you might need a query that checks if the return date is past)
        Long overdueCount = bookLoanDetailRepository.countOverdueBooks(new Date());
        stats.setOverdueBooks((int)((overdueCount != null) ? overdueCount : 0));

        // Pending Requests (Books with pending loan requests)
        long pendingRequests = bookLoanDetailRepository.countByStatusIn(Arrays.asList("Pending Renewal","Preparing for Pickup"));
        stats.setPendingRequests((int) pendingRequests);

        return stats;
    }

    public Map<String, List<Integer>> getBookChartStatistics() {
        Map<String, List<Integer>> statistics = new HashMap<>();

        // Get current date (today)
        Date currentDate = new Date();

        // Calculate the start and end dates for the last 7 days
        Calendar calendar = Calendar.getInstance();
        calendar.setTime(currentDate);

        List<Integer> booksLoanedPerDay = new ArrayList<>();
        List<Integer> booksReservedPerDay = new ArrayList<>();

        // Loop through the last 7 days
        for (int i = 0; i < 7; i++) {
            // Set start of day (00:00)
            calendar.set(Calendar.HOUR_OF_DAY, 0);
            calendar.set(Calendar.MINUTE, 0);
            calendar.set(Calendar.SECOND, 0);
            calendar.set(Calendar.MILLISECOND, 0);
            Date startOfDay = calendar.getTime();

            // Set end of day (23:59)
            calendar.set(Calendar.HOUR_OF_DAY, 23);
            calendar.set(Calendar.MINUTE, 59);
            calendar.set(Calendar.SECOND, 59);
            Date endOfDay = calendar.getTime();

            // Get loaned and reserved books for this day
            int loanedBooks = bookLoanDetailRepository.findByLoanedBooksBetweenDates(startOfDay, endOfDay).size();
            int reservedBooks = reservationDetailRepository.findByReservedBooksBetweenDates(startOfDay, endOfDay).size();

            booksLoanedPerDay.add(loanedBooks);
            booksReservedPerDay.add(reservedBooks);

            // Move to the previous day
            calendar.add(Calendar.DAY_OF_YEAR, -1);
        }

        statistics.put("Books Loaned", booksLoanedPerDay);
        statistics.put("Books Reserved", booksReservedPerDay);

        // Reverse lists to have chronological order (oldest to newest)
        Collections.reverse(booksLoanedPerDay);
        Collections.reverse(booksReservedPerDay);

        return statistics;
    }
}

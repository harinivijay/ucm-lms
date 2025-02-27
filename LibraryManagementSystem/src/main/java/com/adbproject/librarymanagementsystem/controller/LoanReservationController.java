package com.adbproject.librarymanagementsystem.controller;

import com.adbproject.librarymanagementsystem.dto.BookStatistics;
import com.adbproject.librarymanagementsystem.dto.LoanBookResponse;
import com.adbproject.librarymanagementsystem.dto.ReservationRequest;
import com.adbproject.librarymanagementsystem.dto.ReserveBookResponse;
import com.adbproject.librarymanagementsystem.model.BookLoanDetail;
import com.adbproject.librarymanagementsystem.service.LoanReservationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/lms/loan-reservation")
public class LoanReservationController {

    @Autowired
    private LoanReservationService loanReservationService;

    @GetMapping("/loan-requests")
    public ResponseEntity<List<LoanBookResponse>> getAllLoanRequests() {
        List<LoanBookResponse> loanRequests = loanReservationService.getAllLoanRequests();
        return ResponseEntity.ok(loanRequests);
    }

    // Get all loan requests (for dashboard or librarian view)
    @GetMapping("/loan-requests/status/{status}")
    public ResponseEntity<List<LoanBookResponse>> getPendingLoanRequests(@PathVariable String status) {
        List<LoanBookResponse> loanRequests = loanReservationService.getPendingLoanRequestsByStatus(status);
        return ResponseEntity.ok(loanRequests);
    }
    @GetMapping("/loan-requests/statuses")
    public ResponseEntity<List<LoanBookResponse>> getLoanRequestsByStatuses(@RequestParam List<String> statuses) {
        List<LoanBookResponse> loanRequests = loanReservationService.getLoanRequestsByStatuses(statuses);
        return ResponseEntity.ok(loanRequests);
    }

    // Get loan requests by user (for customer to see their bookings)
    @GetMapping("/loan-requests/user/{userId}")
    public ResponseEntity<List<LoanBookResponse>> getLoanRequestsByUser(@PathVariable String userId) {
        List<LoanBookResponse> loanRequests = loanReservationService.getLoanRequestsByUser(userId);
        return ResponseEntity.ok(loanRequests);
    }

    // Get loan request by its ID
    @GetMapping("/loan-requests/{loanId}")
    public ResponseEntity<BookLoanDetail> getLoanRequestById(@PathVariable String loanId) {
        Optional<BookLoanDetail> loanRequest = loanReservationService.getLoanRequestById(loanId);
        return loanRequest.map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.status(HttpStatus.NOT_FOUND).build());
    }

    // Get all reservations that need approval (for dashboard, librarian view)
    @GetMapping("/reservations")
    public ResponseEntity<List<ReserveBookResponse>> getReservations() {
        List<ReserveBookResponse> reservations = loanReservationService.getReservations();
        return ResponseEntity.ok(reservations);
    }

    @GetMapping("/reservations/statuses")
    public ResponseEntity<List<ReserveBookResponse>> getReservationsByStatus(@RequestParam List<String> statuses) {
        List<ReserveBookResponse> reservations = loanReservationService.getReservationsByStatuses(statuses);
        return ResponseEntity.ok(reservations);
    }
    @GetMapping("/reservation-requests/user/{userId}")
    public ResponseEntity<List<ReserveBookResponse>> getReservationRequestsByUser(@PathVariable String userId) {
        List<ReserveBookResponse> reservations = loanReservationService.getReservationsByUser(userId);
        return ResponseEntity.ok(reservations);
    }


    // Get all requests (loans, reservations, and renewals) for the booking list
    @GetMapping("/booking-list")
    public ResponseEntity<List<BookLoanDetail>> getBookingList() {
        List<BookLoanDetail> bookingList = loanReservationService.getBookingList();
        return ResponseEntity.ok(bookingList);
    }

    // Customer initiates a checkout request
    @PostMapping("/requestCheckout")
    public ResponseEntity<String> requestCheckout(@RequestParam String bookId, @RequestParam String userId, @RequestParam String location) {
        try {
            loanReservationService.requestCheckout(bookId, userId, location);
            return ResponseEntity.ok("Checkout request submitted. Await for the order ready to be picked up.");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body("Error processing checkout request: " + e.getMessage());
        }
    }

    // Librarian approves or denies checkout request
    @PutMapping("/updateCheckout/{loanId}")
    public ResponseEntity<String> updateCheckoutRequest(@PathVariable String loanId,
                                                        @RequestParam String status,
                                                        @RequestParam String librarianId) {
        try {
            loanReservationService.updateCheckoutRequest(loanId, status, librarianId, null);
            return ResponseEntity.ok( "Checkout request updated.");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body("Error processing checkout approval: " + e.getMessage());
        }
    }

    @PutMapping("/updateCheckoutWithLocation/{loanId}")
    public ResponseEntity<String> updateCheckoutRequestWithLocation(@PathVariable String loanId,
                                                        @RequestParam String status,
                                                        @RequestParam String librarianId,
                                                                    @RequestParam String location
                                                                    ) {
        try {
            loanReservationService.updateCheckoutRequest(loanId, status, librarianId,location);
            return ResponseEntity.ok( "Checkout request updated.");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body("Error processing checkout approval: " + e.getMessage());
        }
    }

    @PostMapping("/requestRenewal")
    public ResponseEntity<String> requestRenewal(@RequestParam String loanId) {
        try {
            loanReservationService.requestRenewal(loanId);
            return ResponseEntity.ok("Renewal request submitted. Await librarian approval.");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body("Error processing renewal request: " + e.getMessage());
        }
    }


    @PostMapping("/requestReservation")
    public ResponseEntity<String> requestReservation(@RequestBody ReservationRequest reservationRequest) {
        try {

            return ResponseEntity.ok( loanReservationService.requestReservation(reservationRequest));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body("Error processing reservation request: " + e.getMessage());
        }
    }

    @PutMapping("/updateReservation/{reservationId}/status/{status}")
    public ResponseEntity<String> updateReservation(@PathVariable String reservationId, @PathVariable String status) {
        try {
            loanReservationService.updateReservation(reservationId,status);
            return ResponseEntity.ok( "Reservation request updated.");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body("Error processing reservation update: " + e.getMessage());
        }
    }

    @GetMapping("/book-statistics")
    public BookStatistics getBookStatistics() {
       return  loanReservationService.getBookStatistics();
    }

    @GetMapping("/book-chart-statistics")
    public Map<String, List<Integer>> getBookChartStatistics() {
        return  loanReservationService.getBookChartStatistics();
    }

}

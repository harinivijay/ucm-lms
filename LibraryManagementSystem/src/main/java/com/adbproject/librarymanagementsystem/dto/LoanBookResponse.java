package com.adbproject.librarymanagementsystem.dto;

import lombok.Data;

import java.time.LocalDateTime;

@Data
public class LoanBookResponse {
    private String loanId;
    private String location;
    private String userName;
    private LocalDateTime requestedDate;
    private LocalDateTime checkoutDate;
    private LocalDateTime dueDate;
    private LocalDateTime returnDate;
    private double fineAmount;
    private int renewalCount;
    private String status;
    private String bookId;
    private String bookName;
    private String description;
    private String authorName;
    private int edition;
    private String category;
    private boolean isAvailable;
    private boolean isReserved;

}

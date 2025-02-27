package com.adbproject.librarymanagementsystem.dto;
import lombok.Data;

@Data
public class BookStatistics {

    private int totalBooks;
    private int loanedBooks;
    private int reservedBooks;
    private int overdueBooks;
    private int pendingRequests;
}

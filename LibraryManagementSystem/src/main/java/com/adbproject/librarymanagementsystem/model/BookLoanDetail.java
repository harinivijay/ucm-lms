package com.adbproject.librarymanagementsystem.model;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;

@Data
@Document(collection = "BookLoanDetails")
public class BookLoanDetail {

    @Id
    private String loanId;
    private String bookId;
    private String librarianId;
    private String userId;
    private LocalDateTime checkoutDate;
    private LocalDateTime dueDate;
    private LocalDateTime returnDate;
    private double fineAmount;
    private int renewalCount;
    private String location;
    private String checkedOutBy;
    private String checkedInBy;
    private String status;
    private LocalDateTime lastUpdatedDate;
}

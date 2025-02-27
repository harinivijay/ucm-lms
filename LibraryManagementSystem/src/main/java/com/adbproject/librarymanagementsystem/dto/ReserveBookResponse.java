package com.adbproject.librarymanagementsystem.dto;

import lombok.Data;

import java.time.LocalDateTime;

@Data
public class ReserveBookResponse {
    private String reservationId;
    private String location;
    private String userName;
    private LocalDateTime requestedDate;
    private LocalDateTime reserveByDate;
    private LocalDateTime expectedAvailabilityDate;
    private String status;
    private String bookName;
    private String description;
    private String authorName;
    private int edition;
    private String category;

}

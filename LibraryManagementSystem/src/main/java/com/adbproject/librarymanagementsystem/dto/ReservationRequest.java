package com.adbproject.librarymanagementsystem.dto;

import lombok.Data;

import java.time.LocalDateTime;

@Data
public class ReservationRequest {
    private String bookId;
    private String userId;
    private LocalDateTime reservationDate;
    private String location;

}

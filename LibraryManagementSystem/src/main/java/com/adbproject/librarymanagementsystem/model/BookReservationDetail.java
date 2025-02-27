package com.adbproject.librarymanagementsystem.model;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;

@Data
@Document(collection = "BookReservationDetails")
public class BookReservationDetail {

    @Id
    private String reservationId;
    private String bookId;
    private String userId;
    private LocalDateTime reserveByDate;
    private LocalDateTime requestedDate;
    private String reservationStatus;
    private String location;


}

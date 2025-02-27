package com.adbproject.librarymanagementsystem.model;

import lombok.Data;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.Instant;
import java.time.LocalDateTime;


@Data
@Document(collection = "Librarians")
public class Librarian {
    @Id
    private String id;
    private String username;
    private String password;
    private String firstName;
    private String lastName;
    private String email;
    private String address;
    private String city;
    private String state;
    private String postalCode;
    private String ssn;
    private String phoneNumber;
    private String dateOfBirth;
    private String workLocation;
    private LocalDateTime createdDate;

}

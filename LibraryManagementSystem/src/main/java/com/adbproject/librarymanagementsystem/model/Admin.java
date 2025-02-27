package com.adbproject.librarymanagementsystem.model;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;

@Data
@Document(collection = "Admins")
public class Admin {

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
    private String phoneNumber;
    private String dateOfBirth;
    private LocalDateTime createdDate;

}

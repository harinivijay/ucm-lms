package com.adbproject.librarymanagementsystem.dto;

import lombok.Data;

@Data
public class UserDTO {
    private String username;
    private String password;
    private String firstName;
    private String lastName;
    private String email;
    private String type; // user, librarian, or admin
    private String dateOfBirth;
    private String phoneNumber;
    private String address;
    private String city;
    private String state;
    private String postalCode;
    private String ssn; // Only for librarians
    private String workLocation; // Only for librarians
}


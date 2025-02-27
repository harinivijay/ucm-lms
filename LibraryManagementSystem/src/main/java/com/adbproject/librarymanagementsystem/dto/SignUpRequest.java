package com.adbproject.librarymanagementsystem.dto;

import lombok.Data;

@Data
public class SignUpRequest {
    private String username;
    private String password;
    private String firstName;
    private String lastName;
    private String email;
    private String type;

}

package com.adbproject.librarymanagementsystem.dto;

import lombok.Data;

@Data
public class UserIdResponse {
    private String userId;

    public UserIdResponse(String userId) {
        this.userId = userId;
    }

}

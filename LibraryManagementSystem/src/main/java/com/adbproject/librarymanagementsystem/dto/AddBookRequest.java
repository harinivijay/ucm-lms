package com.adbproject.librarymanagementsystem.dto;

import lombok.Data;

@Data
public class AddBookRequest {
    private String bookName;
    private String description;
    private String authorName;
    private int edition;
    private String category;
    private String location;
    private String bookId;
}

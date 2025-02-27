package com.adbproject.librarymanagementsystem.dto;

import lombok.Data;

@Data
public class BookDTO {
    private String bookName;
    private String description;
    private String authorName;
    private String bookId;
    private int edition;
    private String category;
}

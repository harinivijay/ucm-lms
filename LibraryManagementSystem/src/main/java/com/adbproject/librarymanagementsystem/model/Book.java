package com.adbproject.librarymanagementsystem.model;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;

@Data
@Document(collection = "Books")
public class Book {
    @Id
    private String id;
    private String bookId;
    private String bookName;
    private String description;
    private String authorName;
    private int edition;
    private String category;
    private boolean isAvailable;
    private boolean reserved;
    private String location;
}

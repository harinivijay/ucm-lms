package com.adbproject.librarymanagementsystem.dto;

import com.adbproject.librarymanagementsystem.model.Book;

public class BookListResponse {
    private final java.util.List<Book> books;
    private final int totalPages;
    private final long totalBooks;

    public BookListResponse(java.util.List<Book> books, int totalPages, long totalBooks) {
        this.books = books;
        this.totalPages = totalPages;
        this.totalBooks = totalBooks;
    }

    public java.util.List<Book> getBooks() {
        return books;
    }

    public int getTotalPages() {
        return totalPages;
    }

    public long getTotalBooks() {
        return totalBooks;
    }
}

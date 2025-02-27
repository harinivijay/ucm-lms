package com.adbproject.librarymanagementsystem.model;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;

@Data
@Document(collection = "Locations")
public class Location {

    @Id
    private String locationId;
    private String name;
    private String address;
    private String contactNumber;
}

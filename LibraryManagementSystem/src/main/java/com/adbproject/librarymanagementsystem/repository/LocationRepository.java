package com.adbproject.librarymanagementsystem.repository;

import com.adbproject.librarymanagementsystem.model.Location;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface LocationRepository extends MongoRepository<Location, String> {
    Location findByLocationId(String locationId);
    Location findByName(String name);
}

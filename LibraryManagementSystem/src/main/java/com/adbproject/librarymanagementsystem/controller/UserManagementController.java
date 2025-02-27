package com.adbproject.librarymanagementsystem.controller;

import com.adbproject.librarymanagementsystem.model.User;
import com.adbproject.librarymanagementsystem.model.Admin;
import com.adbproject.librarymanagementsystem.model.Librarian;
import com.adbproject.librarymanagementsystem.service.UserManagementService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/lms/members")
public class UserManagementController {

    @Autowired
    private UserManagementService userManagementService;
    @GetMapping("/users")
    public ResponseEntity<List<User>> getAllUsers() {
        List<User> users = userManagementService.getAllUsers();
        return ResponseEntity.ok(users);
    }

    // Get all Admins
    @GetMapping("/admins")
    public ResponseEntity<List<Admin>> getAllAdmins() {
        List<Admin> admins = userManagementService.getAllAdmins();
        return ResponseEntity.ok(admins);
    }

    // Get all Librarians
    @GetMapping("/librarians")
    public ResponseEntity<List<Librarian>> getAllLibrarians() {
        List<Librarian> librarians = userManagementService.getAllLibrarians();
        return ResponseEntity.ok(librarians);
    }

    // Get User by Username
    @GetMapping("/details/user/{userId}")
    public ResponseEntity<?> getUserByUserId(@PathVariable String userId) {
        try {
            User user = userManagementService.getUserByUsername(userId);
            return ResponseEntity.ok(user);
        } catch (Exception e) {
           return  ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body("User Not Found: " + e.getMessage());     }
    }

    // Get Admin by Username
    @GetMapping("/details/admin/{username}")
    public ResponseEntity<?> getAdminByUsername(@PathVariable String username) {
        try {
            Admin admin = userManagementService.getAdminByUsername(username);
            return ResponseEntity.ok(admin);
        } catch (Exception e) {
            return  ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body("Admin Not Found: " + e.getMessage());     }
    }

    // Get Librarian by Username
    @GetMapping("/details/librarian/{username}")
    public ResponseEntity<?> getLibrarianByUsername(@PathVariable String username) {
        try {
            Librarian librarian = userManagementService.getLibrarianByUsername(username);
            return ResponseEntity.ok(librarian);
        } catch (Exception e) {
            return  ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body("Librarian Not Found: " + e.getMessage());     }
    }

    // Delete User
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteUser(@PathVariable String id) {
        try {
            userManagementService.deleteUser(id);
            return ResponseEntity.noContent().build();
        } catch (Exception e) {
            return  ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body("User Not Found: " + e.getMessage());     }
    }

    // Delete Admin
    @DeleteMapping("/admin/{id}")
    public ResponseEntity<?> deleteAdmin(@PathVariable String id) {
        try {
            userManagementService.deleteAdmin(id);
            return ResponseEntity.noContent().build();
        } catch (Exception e) {
            return  ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body("Admin Not Found: " + e.getMessage());     }
    }

    // Delete Librarian
    @DeleteMapping("/librarian/{id}")
    public ResponseEntity<?> deleteLibrarian(@PathVariable String id) {
        try {
            userManagementService.deleteLibrarian(id);
            return ResponseEntity.noContent().build();
        } catch (Exception e) {
            return  ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body("Librarian Not Found: " + e.getMessage());     }
    }

    @GetMapping("/statistics")
    public Map<String, Long> getStatistics() {
        long newUsers = userManagementService.getNewUsersCount();
        long totalUsers = userManagementService.getTotalUsersCount();
        long totalLibrarians = userManagementService.getTotalLibrariansCount();

        // Prepare the statistics map
        Map<String, Long> statistics = new HashMap<>();
        statistics.put("newUsers", newUsers);
        statistics.put("totalUsers", totalUsers);
        statistics.put("totalLibrarians", totalLibrarians);

        return statistics;
    }
}

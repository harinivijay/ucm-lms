package com.adbproject.librarymanagementsystem.service;

import com.adbproject.librarymanagementsystem.model.User;
import com.adbproject.librarymanagementsystem.model.Admin;
import com.adbproject.librarymanagementsystem.model.Librarian;
import com.adbproject.librarymanagementsystem.repository.UserRepository;
import com.adbproject.librarymanagementsystem.repository.AdminRepository;
import com.adbproject.librarymanagementsystem.repository.LibrarianRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.modelmapper.ModelMapper;

import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;
import java.util.List;

@Service
public class UserManagementService {

    @Autowired
    private UserRepository userRepository;
    @Autowired
    private AdminRepository adminRepository;
    @Autowired
    private LibrarianRepository librarianRepository;
    @Autowired
    private ModelMapper modelMapper;

    // Get all Users
    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    // Get all Admins
    public List<Admin> getAllAdmins() {
        return adminRepository.findAll();
    }

    // Get all Librarians
    public List<Librarian> getAllLibrarians() {
        return librarianRepository.findAll();
    }

    // Get User by Username
    public User getUserByUsername(String username) {
        return userRepository.findByUsername(username).orElseThrow(RuntimeException::new);
    }

    // Get Admin by Username
    public Admin getAdminByUsername(String username) {
       return adminRepository.findByUsername(username).orElseThrow(RuntimeException::new);
    }

    // Get Librarian by Username
    public Librarian getLibrarianByUsername(String username) {
       return librarianRepository.findByUsername(username).orElseThrow(RuntimeException::new);
    }

    // Delete User
    public void deleteUser(String id) {
        userRepository.deleteById(id);
    }

    // Delete Admin
    public void deleteAdmin(String id) {
        adminRepository.deleteById(id);
    }

    // Delete Librarian
    public void deleteLibrarian(String id) {
        librarianRepository.deleteById(id);
    }

    public long getNewUsersCount() {

        List<User> newUsers = userRepository.findByCreatedDateAfter(LocalDateTime.now().minus(1, ChronoUnit.DAYS));
        return newUsers.size();
    }

    // Get Total Users
    public long getTotalUsersCount() {
        return userRepository.count();
    }

    // Get Total Librarians
    public long getTotalLibrariansCount() {
        return librarianRepository.count();
    }
}

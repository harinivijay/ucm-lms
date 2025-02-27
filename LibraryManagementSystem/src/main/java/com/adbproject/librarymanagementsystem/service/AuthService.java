package com.adbproject.librarymanagementsystem.service;

import com.adbproject.librarymanagementsystem.dto.AuthResponse;
import com.adbproject.librarymanagementsystem.dto.LoginRequest;
import com.adbproject.librarymanagementsystem.dto.UserDTO;
import com.adbproject.librarymanagementsystem.dto.UserIdResponse;
import com.adbproject.librarymanagementsystem.model.Admin;
import com.adbproject.librarymanagementsystem.model.Librarian;
import com.adbproject.librarymanagementsystem.model.User;
import com.adbproject.librarymanagementsystem.repository.AdminRepository;
import com.adbproject.librarymanagementsystem.repository.LibrarianRepository;
import com.adbproject.librarymanagementsystem.repository.UserRepository;
import org.apache.coyote.BadRequestException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import javax.security.auth.login.AccountNotFoundException;
import java.time.LocalDateTime;
import java.util.Date;
import java.util.Optional;

@Service
public class AuthService {

    @Autowired
    private AdminRepository adminRepository;

    @Autowired
    private LibrarianRepository librarianRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    // Login method
    public AuthResponse login(LoginRequest loginRequest) {
        String username = loginRequest.getUsername();
        String password = loginRequest.getPassword();

        // Check if the user is an Admin
        Optional<Admin> admin = adminRepository.findByUsername(username);
        if (admin.isPresent() && passwordEncoder.matches(password, admin.get().getPassword())) {
            return new AuthResponse(admin.get().getUsername(), "Admin");
        }

        // Check if the user is a Librarian
        Optional<Librarian> librarian = librarianRepository.findByUsername(username);
        if (librarian.isPresent() && passwordEncoder.matches(password, librarian.get().getPassword())) {
            return new AuthResponse(librarian.get().getUsername(), "Librarian");
        }

        // Check if the user is a regular User
        Optional<User> user = userRepository.findByUsername(username);
        if (user.isPresent() && passwordEncoder.matches(password, user.get().getPassword())) {
            return new AuthResponse(user.get().getUsername(), "User");
        }

        // If none of the above conditions match, authentication failed
        throw new RuntimeException("Invalid username or password");
    }

    // Sign-up method
    public ResponseEntity<String> signUp(UserDTO userDTO) {
        String username = userDTO.getUsername();
        String password = userDTO.getPassword();
        String firstName = userDTO.getFirstName();
        String lastName = userDTO.getLastName();
        String email = userDTO.getEmail();
        String type = userDTO.getType(); // user, librarian, or admin
        String dateOfBirth = userDTO.getDateOfBirth();
        String phoneNumber = userDTO.getPhoneNumber();
        String address = userDTO.getAddress();
        String city = userDTO.getCity();
        String state = userDTO.getState();
        String postalCode = userDTO.getPostalCode();
        String ssn = userDTO.getSsn(); // Only for librarians
        String workLocation = userDTO.getWorkLocation(); // Only for librarians

        // Encode the password before saving
        String encodedPassword = passwordEncoder.encode(password);

        switch (type.toLowerCase()) {
            case "admin":
                Optional<Admin> existingAdmin = adminRepository.findByUsername(username);
                if (existingAdmin.isEmpty()) {
                    Admin admin = new Admin();
                    admin.setUsername(username);
                    admin.setPassword(encodedPassword);
                    admin.setFirstName(firstName);
                    admin.setLastName(lastName);
                    admin.setEmail(email);
                    admin.setDateOfBirth(dateOfBirth);
                    admin.setPhoneNumber(phoneNumber);
                    admin.setAddress(address);
                    admin.setCity(city);
                    admin.setState(state);
                    admin.setPostalCode(postalCode);
                    admin.setCreatedDate(LocalDateTime.now());
                    adminRepository.save(admin);
                } else {
                    return new ResponseEntity<>("Username already exists", HttpStatus.BAD_REQUEST);
                }
                break;

            case "librarian":
                Optional<Librarian> existingLibrarian = librarianRepository.findByUsername(username);
                if (existingLibrarian.isEmpty()) {
                    Librarian librarian = new Librarian();
                    librarian.setUsername(username);
                    librarian.setPassword(encodedPassword);
                    librarian.setFirstName(firstName);
                    librarian.setLastName(lastName);
                    librarian.setEmail(email);
                    librarian.setDateOfBirth(dateOfBirth);
                    librarian.setPhoneNumber(phoneNumber);
                    librarian.setAddress(address);
                    librarian.setCity(city);
                    librarian.setState(state);
                    librarian.setPostalCode(postalCode);
                    librarian.setSsn(ssn); // Librarian-specific field
                    librarian.setWorkLocation(workLocation); // Librarian-specific field
                    librarian.setCreatedDate(LocalDateTime.now());
                    librarianRepository.save(librarian);
                } else {
                    return new ResponseEntity<>("Username already exists", HttpStatus.BAD_REQUEST);
                }
                break;

            case "user":
                Optional<User> existingUser = userRepository.findByUsername(username);
                if (existingUser.isEmpty()) {
                    User user = new User();
                    user.setUsername(username);
                    user.setPassword(encodedPassword);
                    user.setFirstName(firstName);
                    user.setLastName(lastName);
                    user.setEmail(email);
                    user.setDateOfBirth(dateOfBirth);
                    user.setPhoneNumber(phoneNumber);
                    user.setAddress(address);
                    user.setCity(city);
                    user.setState(state);
                    user.setPostalCode(postalCode);
                    user.setCreatedDate(LocalDateTime.now());
                    userRepository.save(user);
                } else {
                    return new ResponseEntity<>("Username already exists", HttpStatus.BAD_REQUEST);
                }
                break;

            default:
                throw new IllegalArgumentException("Invalid user type: " + type);
        }

        return new ResponseEntity<>("User registered successfully!", HttpStatus.CREATED);
    }


    // Login method
    public UserIdResponse getUserId(String username, String  type) throws AccountNotFoundException {
        if ("user".equalsIgnoreCase(type)) {
            User user = userRepository.findByUsername(username).orElse(null);
            if (user != null) {
                return new UserIdResponse(user.getId());
            }
        } else if ("librarian".equalsIgnoreCase(type)) {
            Librarian librarian = librarianRepository.findByUsername(username).orElse(null);
            if (librarian != null) {
                return new UserIdResponse(librarian.getId());
            }
        } else if ("admin".equalsIgnoreCase(type)) {
            Admin admin = adminRepository.findByUsername(username).orElse(null);
            if (admin != null) {
                return new UserIdResponse(admin.getId());
            }
        }
        throw new AccountNotFoundException("User Not Found" + username);
    }

    public String getUserNameFromId(String userId) {
        return userRepository.findById(userId).get().getUsername();
    }

}

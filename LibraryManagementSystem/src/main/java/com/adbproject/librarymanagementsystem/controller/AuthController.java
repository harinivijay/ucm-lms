package com.adbproject.librarymanagementsystem.controller;

import com.adbproject.librarymanagementsystem.dto.*;
import com.adbproject.librarymanagementsystem.service.AuthService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/lms/auth")
public class AuthController {

    @Autowired
    private AuthService authService;

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest loginRequest) {
        try {
            AuthResponse response = authService.login(loginRequest);
            return ResponseEntity.ok(response);
        }catch (RuntimeException e){
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());

        }
    }

    @PostMapping("/signup")
    public ResponseEntity<String> signUp(@RequestBody UserDTO userDTO) {
        ResponseEntity<String> response = authService.signUp(userDTO);
        return response;
    }

    @GetMapping("/getUserId")
    public ResponseEntity<?> getUserId(@RequestParam String username, @RequestParam String type) {
        try {
            UserIdResponse response = authService.getUserId(username, type);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("User ID not found");
        }
    }
}

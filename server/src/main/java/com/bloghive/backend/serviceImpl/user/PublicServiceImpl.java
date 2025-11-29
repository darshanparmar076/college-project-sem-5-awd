package com.bloghive.backend.serviceImpl.user;

import com.bloghive.backend.model.user.User;
import com.bloghive.backend.repository.user.UsersRepository;
import com.bloghive.backend.DTOs.response.ApiResponse;
import com.bloghive.backend.service.user.OtpService;
import com.bloghive.backend.service.user.PublicService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
public class PublicServiceImpl implements PublicService {
    @Autowired
    private UsersRepository usersRepository;

    @Autowired
    private OtpService otpService;

    private static final PasswordEncoder passwordEncoder = new BCryptPasswordEncoder();

    @Override
    public ResponseEntity<?> signup(User user) {
        try {
            User dbUser = usersRepository.findByUserName(user.getUserName());
            if (dbUser != null) {
                return ResponseEntity.status(HttpStatus.FOUND).body("Username already exists");
            }
            dbUser = usersRepository.findByEmail(user.getEmail());

            if (dbUser != null) {
                return ResponseEntity.status(HttpStatus.FOUND).body("Email already exists");
            }

            user.setPassword(passwordEncoder.encode(user.getPassword()));
            user.setCreatedAt(LocalDateTime.now());
            user.setUpdatedAt(LocalDateTime.now());
            user.setActive(false);
            user.setRole("USER");
            user.setAvtar("https://res.cloudinary.com/dpw1lvfiw/image/upload/v1764246775/Untitled_design_ruzuck.png");
            otpService.generateOtp(user);
            User save = usersRepository.save(user);

            ApiResponse apiResponse = new ApiResponse<>(
                    200,
                    "Mail sent successfully to " + save.getEmail() + " with OTP",
                    null
            );
            return ResponseEntity.ok(apiResponse);
        }
        catch (Exception e) {
            ApiResponse apiResponse = new ApiResponse<>(
                    500,
                    "Error while adding user" + e.getMessage(),
                    null
            );
            return ResponseEntity.internalServerError().body(apiResponse);
        }
    }

    @Override
    public ResponseEntity<?> login(User users) {
        try {
            User dbuser = usersRepository.findByEmail(users.getEmail());
            if (dbuser == null) {
                ApiResponse<String> apiResponse = new ApiResponse<>(
                        404,
                        "Email not found",
                        null
                );
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body(apiResponse);
            }

            // If password is empty or null, treat as resend OTP request
            if (users.getPassword() == null || users.getPassword().isEmpty()) {
                otpService.generateOtp(dbuser);
                ApiResponse<String> apiResponse = new ApiResponse<>(
                        200,
                        "OTP resent to " + dbuser.getEmail(),
                        null
                );
                return ResponseEntity.ok(apiResponse);
            }

            // Check if password matches
            if (!passwordEncoder.matches(users.getPassword(), dbuser.getPassword())) {
                ApiResponse<String> apiResponse = new ApiResponse<>(
                        401,
                        "Invalid password",
                        null
                );
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(apiResponse);
            }

            // Password is correct, proceed with OTP generation
            otpService.generateOtp(dbuser);
            ApiResponse<String> apiResponse = new ApiResponse<>(
                    200,
                    "OTP sent to " + dbuser.getEmail(),
                    null
            );
            return ResponseEntity.ok(apiResponse);
        }
        catch (Exception e) {
            ApiResponse apiResponse = new ApiResponse<>(
                    500,
                    "Error while sending OTP: " + e.getMessage(),
                    null
            );
            return ResponseEntity.internalServerError().body(apiResponse);
        }
    }
}

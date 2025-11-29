package com.bloghive.backend.serviceImpl.user;

import com.bloghive.backend.configuration.UserServiceImpls;
import com.bloghive.backend.model.user.OtpDetails;
import com.bloghive.backend.model.user.User;
import com.bloghive.backend.repository.user.OtpRepository;
import com.bloghive.backend.repository.user.UsersRepository;
import com.bloghive.backend.DTOs.response.ApiResponse;
import com.bloghive.backend.service.user.OtpService;
import com.bloghive.backend.utils.EmailService;
import com.bloghive.backend.utils.JWTUtil;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.*;

import jakarta.servlet.http.Cookie;

@Service
public class OtpServiceImpl implements OtpService {
    @Autowired
    private EmailService emailService;

    @Autowired
    private OtpRepository otpRepository;

    @Autowired
    private UsersRepository usersRepository;

    @Autowired
    private UserServiceImpls userServiceImpls;

    @Autowired
    private JWTUtil jwtUtil;

    @Override
    public ResponseEntity<?> generateOtp(User user){
        try {
            Random rnd = new Random();
            int number = rnd.nextInt(999999-111111+1) + 111111;

            String otp = String.format("%06d", number);
            storeOtp(user.getEmail(), otp);
            emailService.otpSenderMail(user, otp);

            ApiResponse apiResponse = new ApiResponse<>(
                    200,
                    "Email sent to " + user.getEmail() + " with OTP: " + otp,
                    null
            );
            return ResponseEntity.ok(apiResponse);
        }
        catch (Exception e){
            ApiResponse apiResponse = new ApiResponse<>(
                    500,
                    "Error while generating OTP: " + e.getMessage(),
                    null
            );
            return ResponseEntity.internalServerError().body(apiResponse);
        }
    }

    //    @Override
    private void storeOtp(String email, String otp) {
        OtpDetails dbOtpDetails = otpRepository.findByEmail(email);

        if (dbOtpDetails != null){
            dbOtpDetails.setOtp(otp);
            dbOtpDetails.setLocalTime(LocalTime.now());
            otpRepository.save(dbOtpDetails);
        }
        else {
            OtpDetails otpDetails = new OtpDetails();
            otpDetails.setOtp(otp);
            otpDetails.setEmail(email);
            otpRepository.save(otpDetails);
        }
//        return new ResponseEntity<>("Stored in db", HttpStatus.OK);
    }

    @Scheduled(fixedRate = 5000) // Every 5 seconds
    public void deleteExpiredOtps() {
        LocalDateTime expiryTime = LocalDateTime.now().minusSeconds(300);
        otpRepository.deleteByLocalTimeBefore(expiryTime);
    }

    @Scheduled(cron = "0 0 0 * * *")
    public void setInActiveUsers(){
        LocalDateTime expiryTime = LocalDateTime.now().minusDays(30);
        List<User> unverifyUsers = usersRepository.findByTime(expiryTime);
        unverifyUsers.stream().forEach(user -> {
            user.setActive(false);
            user.setLastVerifiedAt(LocalDateTime.now());
        });
        usersRepository.saveAll(unverifyUsers);
    }

    @Override
    public ResponseEntity<?> compareOtp(OtpDetails otpDetails, HttpServletResponse response) {
        try {
            OtpDetails dbOtp = otpRepository.findByEmail(otpDetails.getEmail());
            if (dbOtp == null){
                ApiResponse apiResponse = new ApiResponse<>(
                        404,
                        "OTP not found",
                        null
                );
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response);
            }

            if (!otpDetails.getEmail().equals(dbOtp.getEmail()) || !otpDetails.getOtp().equals(dbOtp.getOtp())){
                ApiResponse apiResponse = new ApiResponse<>(
                        400,
                        "Invalid OTP",
                        null
                );
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(apiResponse);
            }

            User user = usersRepository.findByEmail(otpDetails.getEmail());
            user.setActive(true);
            user.setLastVerifiedAt(LocalDateTime.now());
            User save = usersRepository.save(user);

//            UserDetails userDetails = userServiceImpls.loadUserByUsername(user.getId().toHexString());
            String jwt = jwtUtil.generateToken(user.getId().toHexString());
            otpRepository.delete(dbOtp);
            Cookie cookie = new Cookie("token", jwt);

//                cookie.setMaxAge(7 * 24 * 60 * 60);
//                cookie.setSecure(true);
            cookie.setDomain("localhost");
            cookie.setHttpOnly(true);
            cookie.setPath("/");

            String userId = user.getId().toHexString();

            Map<String, Object> responseData = new HashMap<>();
            responseData.put("user", save);
            responseData.put("userId", userId);
            responseData.put("jwt", jwt);

            // Add the cookie to the response
            response.addCookie(cookie);
            ApiResponse apiResponse = new ApiResponse<>(
                    200,
                    "OTP verified successfully",
                    responseData
            );
            return ResponseEntity.ok(apiResponse);
        }
        catch (Exception e){
            ApiResponse apiResponse = new ApiResponse<>(
                    500,
                    "Error while comparing OTP: " + e.getMessage(),
                    null
            );
            return ResponseEntity.internalServerError().body(apiResponse);
        }
    }
}

package com.bloghive.backend.service.user;

import com.bloghive.backend.model.user.OtpDetails;
import com.bloghive.backend.model.user.User;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.http.ResponseEntity;

public interface OtpService {
    ResponseEntity<?> generateOtp(User user);

    ResponseEntity<?> compareOtp(OtpDetails otpDetails, HttpServletResponse response);
}

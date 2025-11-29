package com.bloghive.backend.service.user;

import com.bloghive.backend.DTOs.request.ChangePasswordRequestDTO;
import com.bloghive.backend.DTOs.request.UpdateProfileRequestDTO;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.http.ResponseEntity;
import org.springframework.web.multipart.MultipartFile;

public interface UserService {
    ResponseEntity<?> updateProfilePic(MultipartFile file);

    ResponseEntity<?> updateProfile(UpdateProfileRequestDTO updateProfileRequestDTO);

    ResponseEntity<?> getCurrentUser(HttpServletRequest request);

    ResponseEntity<?> logOutUser(HttpServletResponse response);

    ResponseEntity<?> getUserProfile(String userName);

    ResponseEntity<?> changePassword(ChangePasswordRequestDTO changePasswordRequestDTO);
}

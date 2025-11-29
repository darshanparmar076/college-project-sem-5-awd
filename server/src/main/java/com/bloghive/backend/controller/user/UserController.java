package com.bloghive.backend.controller.user;

import com.bloghive.backend.DTOs.request.ChangePasswordRequestDTO;
import com.bloghive.backend.DTOs.request.UpdateProfileRequestDTO;
import com.bloghive.backend.service.user.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

@RestController
@RequestMapping("user")
public class UserController {
    @Autowired
    private UserService userService;

    @GetMapping("me")  //check
    public ResponseEntity<?> getCurrentUser(HttpServletRequest request){
            return userService.getCurrentUser(request);
    }

    @PutMapping("update-profile-pic") // check // baki che
    public ResponseEntity<?> updateProfilePic(@RequestParam("file") MultipartFile file){
        return userService.updateProfilePic(file);
    }

    @PutMapping("update-profile") //check
    public ResponseEntity<?> updateProfile(@RequestBody UpdateProfileRequestDTO updateProfileRequestDTO){
        return userService.updateProfile(updateProfileRequestDTO);
    }

    @PostMapping("logout") //check
    public ResponseEntity<?> logoutUser(HttpServletResponse response){
        return userService.logOutUser(response);
    }

    @PutMapping("change-password")
    public ResponseEntity<?> changePassword(@RequestBody ChangePasswordRequestDTO changePasswordRequestDTO){
        return userService.changePassword(changePasswordRequestDTO);
    }
}

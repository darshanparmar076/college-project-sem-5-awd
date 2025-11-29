package com.bloghive.backend.controller.upload;

import com.bloghive.backend.DTOs.response.ApiResponse;
import com.bloghive.backend.utils.CloudinaryService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("upload")
public class UploadController {
    
    @Autowired
    private CloudinaryService cloudinaryService;
    
    @PostMapping
    public ResponseEntity<?> uploadImage(@RequestParam("image") MultipartFile file) {
        try {
            if (file == null || file.isEmpty()) {
                ApiResponse<Object> apiResponse = new ApiResponse<>(
                        400,
                        "File is required",
                        null
                );
                return ResponseEntity.badRequest().body(apiResponse);
            }
            
            Map<String, Object> uploadResult = cloudinaryService.uploadImage(file);
            String secureUrl = (String) uploadResult.get("secure_url");
            
            Map<String, String> data = new HashMap<>();
            data.put("imageUrl", secureUrl);
            
            ApiResponse<Map<String, String>> apiResponse = new ApiResponse<>(
                    200,
                    "Image uploaded successfully",
                    data
            );
            
            return ResponseEntity.ok(apiResponse);
        } catch (Exception e) {
            ApiResponse<Object> apiResponse = new ApiResponse<>(
                    500,
                    "Error while uploading image: " + e.getMessage(),
                    null
            );
            return ResponseEntity.internalServerError().body(apiResponse);
        }
    }
}

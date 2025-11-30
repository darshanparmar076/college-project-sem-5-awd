package com.bloghive.backend.serviceImpl.user;

import com.bloghive.backend.DTOs.request.UpdateProfileRequestDTO;
import com.bloghive.backend.DTOs.request.ChangePasswordRequestDTO;
import com.bloghive.backend.DTOs.response.UserProfileResponseDTO;
import com.bloghive.backend.model.user.User;
import com.bloghive.backend.repository.blog.BlogRepository;
import com.bloghive.backend.repository.follow.FollowRepository;
import com.bloghive.backend.repository.user.UsersRepository;
import com.bloghive.backend.DTOs.response.ApiResponse;
import com.bloghive.backend.service.user.UserService;
import com.bloghive.backend.utils.CloudinaryService;
import com.bloghive.backend.utils.JWTUtil;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.bson.types.ObjectId;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.time.LocalDateTime;
import java.util.Map;

@Service
public class UserServiceImpl implements UserService {

    @Autowired
    private UsersRepository usersRepository;

    @Autowired
    private FollowRepository followRepository;

    @Autowired
    private BlogRepository blogRepository;

    @Autowired
    private CloudinaryService cloudinaryService;

    @Autowired
    private JWTUtil jwtUtil;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Override
    public ResponseEntity<?> updateProfilePic(MultipartFile file) {
        try {
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

            String userId = authentication.getName();
            if (userId == null || userId.trim().isEmpty()) {
                ApiResponse<String> apiResponse = new ApiResponse<>(
                        401,
                        "User not authenticated",
                        null
                );
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(apiResponse);
            }
            
            ObjectId objectId = new ObjectId(userId);
            User user = usersRepository.findById(objectId).orElse(null);

            if (user == null) {
                ApiResponse apiResponse = new ApiResponse<>(
                        404,
                        "User not found",
                        null
                );
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body(apiResponse);
            }

            if (file == null){
                ApiResponse apiResponse = new ApiResponse<>(
                        400,
                        "File is required",
                        null
                );

                return ResponseEntity.status(HttpStatus.NO_CONTENT).body(apiResponse);
            }

            // If old avatar exists, delete it
            if (user.getAvtar() != null && !user.getAvtar().isEmpty()) {
                String oldUrl = user.getAvtar();
                String publicId = oldUrl.substring(oldUrl.lastIndexOf("/") + 1).split("\\.")[0];
                cloudinaryService.deleteImage(publicId);
            }

            Map<String, Object> uploadResult = cloudinaryService.uploadImage(file);
            String secureUrl = (String) uploadResult.get("secure_url");

            user.setAvtar(secureUrl);
            user.setUpdatedAt(LocalDateTime.now());
            usersRepository.save(user);

            ApiResponse apiResponse = new ApiResponse<>(
                    200,
                    "Profile picture updated successfully",
                    user
            );

            return ResponseEntity.ok(apiResponse);
        } catch (Exception e) {
            ApiResponse apiResponse = new ApiResponse<>(
                    500,
                    "Error while updating profile picture: " + e.getMessage(),
                    null
            );
            return ResponseEntity.internalServerError().body(apiResponse);
        }
    }

    @Override
    public ResponseEntity<?> updateProfile(UpdateProfileRequestDTO updateProfileRequestDTO) {
        try {
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

            String userId = authentication.getName();
            if (userId == null || userId.trim().isEmpty()) {
                ApiResponse<String> apiResponse = new ApiResponse<>(
                        401,
                        "User not authenticated",
                        null
                );
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(apiResponse);
            }
            
            ObjectId objectId = new ObjectId(userId);
            User user = usersRepository.findById(objectId).orElse(null);

            if (user == null) {
                ApiResponse<String> apiResponse = new ApiResponse<>(
                        404,
                        "User not found",
                        null
                );
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body(apiResponse);
            }

            // Update fields only if they are provided (avoid overwriting with null)
            if (updateProfileRequestDTO.getName() != null && !updateProfileRequestDTO.getName().isBlank()) {
                user.setName(updateProfileRequestDTO.getName());
            }

            if (updateProfileRequestDTO.getUserName() != null && !updateProfileRequestDTO.getUserName().isBlank()) {
                // Check if username already exists in DB
                if (!updateProfileRequestDTO.getUserName().equals(user.getUserName()) &&
                        usersRepository.existsByUserName(updateProfileRequestDTO.getUserName())) {
                    return ResponseEntity.status(HttpStatus.CONFLICT).body("Username already taken");
                }
                user.setUserName(updateProfileRequestDTO.getUserName());
            }

            if (updateProfileRequestDTO.getEmail() != null && !updateProfileRequestDTO.getEmail().isBlank()) {
                user.setEmail(updateProfileRequestDTO.getEmail());
            }

            if (updateProfileRequestDTO.getGender() != null && !updateProfileRequestDTO.getGender().isBlank()) {
                user.setGender(updateProfileRequestDTO.getGender());
            }

            // Save updated user
            User save = usersRepository.save(user);

            ApiResponse apiResponse = new ApiResponse<>(
                    200,
                    "Profile updated successfully",
                    save
            );

            return ResponseEntity.ok(apiResponse);
        } catch (Exception e) {
            ApiResponse apiResponse = new ApiResponse<>(
                    500,
                    "Error while updating profile: " + e.getMessage(),
                    null
            );
            return ResponseEntity.internalServerError().body(apiResponse);
        }
    }

    @Override
    public ResponseEntity<?> getCurrentUser(HttpServletRequest request) {
        try {
            // Extract token from Authorization header or cookies
            String token = null;
            
            // First, try to get token from Authorization header
            String authorizationHeader = request.getHeader("Authorization");
            if (authorizationHeader != null && authorizationHeader.startsWith("Bearer ")) {
                token = authorizationHeader.substring(7);
            }
            
            // If no Authorization header, try to get token from cookies
            if (token == null || token.isEmpty()) {
                Cookie[] cookies = request.getCookies();
                if (cookies != null) {
                    for (Cookie cookie : cookies) {
                        if ("token".equals(cookie.getName())) {
                            token = cookie.getValue();
                            break;
                        }
                    }
                }
            }
            
            if (token == null || token.isEmpty()) {
                ApiResponse<String> apiResponse = new ApiResponse<>(
                        401,
                        "No authentication token found",
                        null
                );
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(apiResponse);
            }
            
            // Extract user ID from JWT token
            String userId;
            try {
                userId = jwtUtil.extractUsername(token);
            } catch (Exception e) {
                ApiResponse<String> apiResponse = new ApiResponse<>(
                        401,
                        "Invalid authentication token",
                        null
                );
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(apiResponse);
            }
            
            ObjectId objectId = new ObjectId(userId);
            User user = usersRepository.findById(objectId).orElse(null);

            if (user == null) {
                ApiResponse<String> apiResponse = new ApiResponse<>(
                        404,
                        "User not found",
                        null
                );
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body(apiResponse);
            }

            ApiResponse<User> apiResponse = new ApiResponse<>(
                    200,
                    "Current user fetched successfully",
                    user
            );
            return ResponseEntity.ok(apiResponse);
        } catch (Exception e) {
            ApiResponse<String> apiResponse = new ApiResponse<>(
                    500,
                    "Error while fetching current user: " + e.getMessage(),
                    null
            );
            return ResponseEntity.internalServerError().body(apiResponse);
        }
    }

    @Override
    public ResponseEntity<?> logOutUser(HttpServletResponse response) {
        try {
            Cookie cookie = new Cookie("token", null);
            cookie.setHttpOnly(true);
            cookie.setSecure(true);
            cookie.setPath("/");
            cookie.setMaxAge(0);

            response.addCookie(cookie);

            ApiResponse apiResponse = new ApiResponse<>(
                    200,
                    "User logged out successfully",
                    null
            );

            return ResponseEntity.ok(apiResponse);

        } catch (Exception e) {
            ApiResponse apiResponse = new ApiResponse<>(
                    500,
                    "Error while logging out user: " + e.getMessage(),
                    null
            );
            return ResponseEntity.internalServerError().body(apiResponse);
        }
    }

    @Override
    public ResponseEntity<?> getUserProfile(String userName) {
        try {
            User targetUser = usersRepository.findByUserName(userName);

            if (targetUser == null){
                ApiResponse apiResponse = new ApiResponse<>(
                        404,
                        "User not found",
                        null
                );

                return ResponseEntity.status(HttpStatus.NOT_FOUND).body(apiResponse);
            }

            long followersCount = followRepository.countByFollowing(targetUser.getId());
            long followingCount = followRepository.countByFollower(targetUser.getId());

            long posts = blogRepository.countByUserId(targetUser.getId());

            boolean isFollowing = false;
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
            if (authentication != null
                    && authentication.isAuthenticated()
                    && !"anonymousUser".equals(authentication.getPrincipal())) {

                ObjectId loggedInUserId = new ObjectId(authentication.getName());
                User loggedInUser = usersRepository.findById(loggedInUserId)
                        .orElseThrow(() -> new UsernameNotFoundException("User not found with id: " + loggedInUserId));
                if(loggedInUser != null) {
                    boolean isFollow = followRepository.existsByFollowerAndFollowing(loggedInUser.getId(), targetUser.getId());
                    if (isFollow){
                        isFollowing = true;
                    }
                }
            }

            System.out.println(isFollowing);

            UserProfileResponseDTO userProfileResponseDTO = new UserProfileResponseDTO();

            userProfileResponseDTO.setUserId(targetUser.getId());
            userProfileResponseDTO.setName(targetUser.getName());
            userProfileResponseDTO.setUserName(targetUser.getUserName());
            userProfileResponseDTO.setEmail(targetUser.getEmail());
            userProfileResponseDTO.setGender(targetUser.getGender());
            userProfileResponseDTO.setAvtar(targetUser.getAvtar());
            userProfileResponseDTO.setCreatedAt(targetUser.getCreatedAt());
            userProfileResponseDTO.setUpdatedAt(targetUser.getUpdatedAt());
            userProfileResponseDTO.setFollowers(followersCount);
            userProfileResponseDTO.setFollowing(followingCount);
            userProfileResponseDTO.setFollowing(isFollowing);
            userProfileResponseDTO.setPosts(posts);

            ApiResponse apiResponse = new ApiResponse<>(
                    200,
                    "User profile fetched successfully",
                    userProfileResponseDTO
            );

            return ResponseEntity.ok(apiResponse);
        } catch (Exception e) {
            ApiResponse apiResponse = new ApiResponse<>(
                    500,
                    "Error while fetching user profile: " + e.getMessage(),
                    null
            );

            return ResponseEntity.internalServerError().body(apiResponse);
        }
    }

    @Override
    public ResponseEntity<?> changePassword(ChangePasswordRequestDTO changePasswordRequestDTO) {
        try {
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
            ObjectId userId = new ObjectId(authentication.getName());
            User user = usersRepository.findById(userId).orElse(null);

            if (user == null) {
                ApiResponse<String> apiResponse = new ApiResponse<>(
                        404,
                        "User not found",
                        null
                );
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body(apiResponse);
            }

            // Verify current password
            if (!passwordEncoder.matches(changePasswordRequestDTO.getCurrentPassword(), user.getPassword())) {
                ApiResponse<String> apiResponse = new ApiResponse<>(
                        400,
                        "Current password is incorrect",
                        null
                );
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(apiResponse);
            }

            // Update password
            user.setPassword(passwordEncoder.encode(changePasswordRequestDTO.getNewPasssword()));
            usersRepository.save(user);

            ApiResponse<String> apiResponse = new ApiResponse<>(
                    200,
                    "Password changed successfully",
                    null
            );
            return ResponseEntity.ok(apiResponse);
        } catch (Exception e) {
            ApiResponse<String> apiResponse = new ApiResponse<>(
                    500,
                    "Internal server error: " + e.getMessage(),
                    null
            );
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(apiResponse);
        }
    }
}

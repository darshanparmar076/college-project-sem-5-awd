package com.bloghive.backend.serviceImpl.follow;

import com.bloghive.backend.DTOs.response.ApiResponse;
import com.bloghive.backend.model.follow.FollowDetails;
import com.bloghive.backend.model.user.User;
import com.bloghive.backend.repository.follow.FollowRepository;
import com.bloghive.backend.repository.user.UsersRepository;
import com.bloghive.backend.service.follow.FollowService;
import org.bson.types.ObjectId;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

@Service
public class FollowServiceImpl implements FollowService {

    @Autowired
    private FollowRepository followRepository;

    @Autowired
    private UsersRepository usersRepository;

    @Override
    public ResponseEntity<?> followUser(String userName) {
        try {
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

            String userId = authentication.getName();
            ObjectId currentUserObjectId = new ObjectId(userId);
            User currentUser = usersRepository.findById(currentUserObjectId).orElseThrow(() -> new UsernameNotFoundException("User not found with id: " + userId));

            if (currentUser == null){
                ApiResponse apiResponse = new ApiResponse<>(
                        404,
                        "Current user not found",
                        null
                );

                return ResponseEntity.status(HttpStatus.NOT_FOUND).body(apiResponse);
            }

            User targetUser = usersRepository.findByUserName(userName);
            if (targetUser == null){
                ApiResponse apiResponse = new ApiResponse<>(
                        404,
                        "User to follow not found",
                        null
                );

                return ResponseEntity.status(HttpStatus.NOT_FOUND).body(apiResponse);
            }

            boolean isAlreadyFollowing = followRepository.existsByFollowerAndFollowing(currentUser.getId(), targetUser.getId());

            if (isAlreadyFollowing){
                ApiResponse apiResponse = new ApiResponse<>(
                        400,
                        "You are already following this user",
                        null
                );

                return ResponseEntity.badRequest().body(apiResponse);
            }

            FollowDetails followDetails = new FollowDetails();
            followDetails.setFollower(currentUser.getId());
            followDetails.setFollowing(targetUser.getId());
            followRepository.save(followDetails);

            ApiResponse apiResponse = new ApiResponse<>(
                    200,
                    "Successfully followed the user",
                    followDetails
            );

            return ResponseEntity.ok(apiResponse);
        }
        catch (Exception e){
            ApiResponse apiResponse = new ApiResponse<>(
                    500,
                    "An error occurred while trying to follow the user." + e.getMessage(),
                    null
            );

            return ResponseEntity.internalServerError().body(apiResponse);
        }
    }

    @Override
    public ResponseEntity<?> unFollowUser(String userName) {
        try {
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

            if (authentication == null || !authentication.isAuthenticated() || "anonymousUser".equals(authentication.getPrincipal())) {
                ApiResponse apiResponse = new ApiResponse<>(
                        401,
                        "Unauthorized",
                        null
                );
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(apiResponse);
            }

            // Logged-in user from JWT
            String currentUserId = authentication.getName();
            ObjectId currentUserObjectId = new ObjectId(currentUserId);
            User currentUser = usersRepository.findById(currentUserObjectId).orElseThrow(() -> new UsernameNotFoundException("User not found with id: " + currentUserId));
            String currentUserName = currentUser.getUserName();
            User loggedInUser = usersRepository.findByUserName(currentUserName);

            if (loggedInUser == null){
                ApiResponse apiResponse = new ApiResponse<>(
                        404,
                        "Current user not found",
                        null
                );

                return ResponseEntity.status(HttpStatus.NOT_FOUND).body(apiResponse);
            }

            // Target user to unfollow
            User followedUser = usersRepository.findByUserName(userName);

            if (followedUser == null){
                ApiResponse apiResponse = new ApiResponse<>(
                        404,
                        "User to unfollow not found",
                        null
                );

                return ResponseEntity.status(HttpStatus.NOT_FOUND).body(apiResponse);
            }

            if (followedUser.getUserName().equals(loggedInUser.getUserName())){
                ApiResponse apiResponse = new ApiResponse<>(
                        400,
                        "You cannot unfollow yourself",
                        null
                );

                return ResponseEntity.badRequest().body(apiResponse);
            }

            FollowDetails followDetails = followRepository.findByFollowerAndFollowing(loggedInUser.getId(), followedUser.getId());

            if (followDetails == null){
                ApiResponse apiResponse = new ApiResponse<>(
                        400,
                        "You are not following this user",
                        null
                );

                return ResponseEntity.badRequest().body(apiResponse);
            }

            followRepository.delete(followDetails);

            ApiResponse apiResponse = new ApiResponse<>(
                    200,
                    "Successfully unfollowed the user",
                    null
            );

            return ResponseEntity.ok(apiResponse);
        }
        catch (Exception e){
            ApiResponse apiResponse = new ApiResponse<>(
                    500,
                    "An error occurred while trying to unfollow the user." + e.getMessage(),
                    null
            );

            return ResponseEntity.internalServerError().body(apiResponse);
        }
    }
}

package com.bloghive.backend.serviceImpl.like;

import com.bloghive.backend.model.blog.BlogDetails;
import com.bloghive.backend.model.like.LikeDetails;
import com.bloghive.backend.model.user.User;
import com.bloghive.backend.repository.blog.BlogRepository;
import com.bloghive.backend.repository.like.LikeRepository;
import com.bloghive.backend.repository.user.UsersRepository;
import com.bloghive.backend.DTOs.response.ApiResponse;
import com.bloghive.backend.service.like.LikeService;
import org.bson.types.ObjectId;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Optional;

@Service
public class LikeServiceImpl implements LikeService {
    @Autowired
    private LikeRepository likeRepository;

    @Autowired
    private UsersRepository usersRepository;

    @Autowired
    private BlogRepository blogRepository;

    @Override
    public ResponseEntity<?> likeBlogPost(ObjectId blogId) {
        try {
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
            // Ensure user is logged in
            if (authentication == null || !authentication.isAuthenticated()
                    || "anonymousUser".equals(authentication.getPrincipal())) {
                ApiResponse response = new ApiResponse<>(
                        401,
                        "Unauthorized: Please log in",
                        null
                );
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(response);
            }
            String userId = authentication.getName();
            ObjectId objectId = new ObjectId(userId);

            User user = usersRepository.findById(objectId)
                    .orElseThrow(() -> new UsernameNotFoundException("User not found with id: " + userId));
            ObjectId userObjectId = user.getId();

            // Verify blog exists
            BlogDetails blogDetails = blogRepository.findById(blogId)
                    .orElseThrow(() -> new RuntimeException("Blog not found with id: " + blogId));

            Optional<LikeDetails> alreadyLiked = likeRepository.findByUserIdAndBlogId(userObjectId, blogDetails.getBlogId());
            if (alreadyLiked.isPresent()) {
                ApiResponse apiResponse = new ApiResponse<>(
                        400,
                        "Blog already liked by user",
                        null
                );
                return ResponseEntity.status(400).body(apiResponse);
            }

            LikeDetails likeDetails = new LikeDetails();
            likeDetails.setUserId(userObjectId);
            likeDetails.setBlogId(blogId);
            likeDetails.setCreatedAt(LocalDateTime.now());
            likeDetails.setUpdatedAt(LocalDateTime.now());
            likeRepository.save(likeDetails);

            ApiResponse apiResponse = new ApiResponse<>(
                    200,
                    "Blog liked successfully",
                    likeDetails
            );
            return ResponseEntity.ok(apiResponse);
        }
        catch (Exception e){
            ApiResponse apiResponse = new ApiResponse<>(
                    500,
                    "Error while liking blog: " + e.getMessage(),
                    null
            );
            return ResponseEntity.internalServerError().body(apiResponse);
        }
    }

    @Override
    public ResponseEntity<?> unlikeBlogPost(ObjectId blogId) {
        try {
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
            // Ensure user is logged in
            if (authentication == null || !authentication.isAuthenticated()
                    || "anonymousUser".equals(authentication.getPrincipal())) {
                ApiResponse response = new ApiResponse<>(
                        401,
                        "Unauthorized: Please log in",
                        null
                );
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(response);
            }
            String userId = authentication.getName();
            ObjectId objectId = new ObjectId(userId);

            User user = usersRepository.findById(objectId)
                    .orElseThrow(() -> new UsernameNotFoundException("User not found with id: " + userId));
            ObjectId userObjectId = user.getId();

            // Verify blog exists
            BlogDetails blogDetails = blogRepository.findById(blogId)
                    .orElseThrow(() -> new RuntimeException("Blog not found with id: " + blogId));

            Optional<LikeDetails> likeDetails = likeRepository.findByUserIdAndBlogId(userObjectId, blogDetails.getBlogId());

            if (likeDetails.isEmpty()){
                ApiResponse apiResponse = new ApiResponse<>(
                        400,
                        "Blog not liked by user",
                        null
                );
                return ResponseEntity.status(400).body(apiResponse);
            }

            likeRepository.delete(likeDetails.get());

            ApiResponse apiResponse = new ApiResponse<>(
                    200,
                    "Blog unliked successfully",
                    null
            );
            return ResponseEntity.ok(apiResponse);
        }
        catch (Exception e){
            ApiResponse apiResponse = new ApiResponse<>(
                    500,
                    "Error while unliking blog: " + e.getMessage(),
                    null
            );
            return ResponseEntity.internalServerError().body(apiResponse);
        }
    }
}

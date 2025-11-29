package com.bloghive.backend.serviceImpl.comment;

import com.bloghive.backend.DTOs.response.CommentResponseDTO;
import com.bloghive.backend.model.blog.BlogDetails;
import com.bloghive.backend.model.comment.CommentDetails;
import com.bloghive.backend.model.user.User;
import com.bloghive.backend.repository.blog.BlogRepository;
import com.bloghive.backend.repository.comment.CommentRepository;
import com.bloghive.backend.repository.user.UsersRepository;
import com.bloghive.backend.DTOs.response.ApiResponse;
import com.bloghive.backend.service.comment.CommentService;
import org.bson.types.ObjectId;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Sort;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.stream.Collectors;

@Service
public class CommentServiceImpl implements CommentService {
    @Autowired
    private CommentRepository commentRepository;

    @Autowired
    private UsersRepository usersRepository;

    @Autowired
    private BlogRepository blogRepository;

    @Autowired
    private MongoTemplate mongoTemplate;

    @Override
    public ResponseEntity<?> createComment(CommentDetails commentDetails, ObjectId blogId) {
        try {
            // 1. Get authenticated user
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
            String userId = authentication.getName();
            ObjectId userObjectId = new ObjectId(userId);

            User user = usersRepository.findById(userObjectId)
                    .orElseThrow(() -> new UsernameNotFoundException("User not found with id: " + userId));

            // 2. Validate blog exists
            BlogDetails blog = blogRepository.findById(blogId)
                    .orElseThrow(() -> new RuntimeException("Blog not found with id: " + commentDetails.getBlogId()));

            // 3. Create new comment
            CommentDetails newComment = new CommentDetails();
            newComment.setBlogId(blog.getBlogId());
            newComment.setUserId(user.getId());
            newComment.setContent(commentDetails.getContent());
            newComment.setCreatedAt(LocalDateTime.now());
            newComment.setUpdatedAt(LocalDateTime.now());


            // 4. Save comment
            CommentDetails savedComment = commentRepository.save(newComment);

            ApiResponse apiResponse = new ApiResponse(
                    200,
                    "Comment added successfully",
                    savedComment
            );

            return ResponseEntity.ok(apiResponse);

        } catch (Exception e) {
            ApiResponse apiResponse = new ApiResponse(
                    500,
                    "Error while adding comment: " + e.getMessage(),
                    null
            );
            return ResponseEntity.internalServerError().body(apiResponse);
        }
    }

    @Override
    public ResponseEntity<?> getBlogComments(ObjectId blogId) {
        try {
            // Step 1: Fetch comments by blogId (sorted by createdAt DESC)
            Query query = new Query(Criteria.where("blogId").is(blogId))
                    .with(Sort.by(Sort.Direction.DESC, "createdAt"));

            List<CommentDetails> comments = mongoTemplate.find(query, CommentDetails.class);

            if (comments.isEmpty()) {
                ApiResponse response = new ApiResponse<>(
                        200,
                        "No Comment found on this post",
                        null
                );
                return ResponseEntity.ok(response);
            }

            // Step 2: Collect userIds from comments
            Set<ObjectId> userIds = comments.stream()
                    .map(CommentDetails::getUserId)
                    .collect(Collectors.toSet());

            // Step 3: Fetch all users at once
            List<User> users = usersRepository.findAllById(userIds);
            Map<ObjectId, User> userMap = users.stream()
                    .collect(Collectors.toMap(User::getId, u -> u));

            // Step 4: Map comments → DTO
            List<CommentResponseDTO> commentDTOs = comments.stream().map(comment -> {
                CommentResponseDTO dto = new CommentResponseDTO();
                dto.setCommentId(comment.getCommentId());
                dto.setContent(comment.getContent());
                dto.setCreatedAt(comment.getCreatedAt());

                User author = userMap.get(comment.getUserId());
                if (author != null) {
                    dto.setUserName(author.getUserName());
                    dto.setAvtar(author.getAvtar());
                }
                return dto;
            }).toList();

            // Step 5: Success response
            ApiResponse response = new ApiResponse<>(
                    200,
                    "Comment found.",
                    commentDTOs
            );
            return ResponseEntity.ok(response);

        } catch (Exception e) {
            ApiResponse apiResponse = new ApiResponse<>(
                    500,
                    "Error while fetching comments: " + e.getMessage(),
                    null
            );
            return ResponseEntity.internalServerError().body(apiResponse);
        }
    }
}

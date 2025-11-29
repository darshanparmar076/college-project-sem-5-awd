package com.bloghive.backend.serviceImpl.blog;

import com.bloghive.backend.DTOs.request.UpdateBlogRequestDTO;
import com.bloghive.backend.DTOs.response.BlogSummaryResponse;
import com.bloghive.backend.DTOs.response.AuthorResponse;
import com.bloghive.backend.DTOs.response.BlogDetailsResponse;
import com.bloghive.backend.DTOs.response.CommentResponseDTO;
import com.bloghive.backend.model.blog.BlogDetails;
import com.bloghive.backend.model.comment.CommentDetails;
import com.bloghive.backend.model.like.LikeDetails;
import com.bloghive.backend.model.user.User;
import com.bloghive.backend.repository.blog.BlogRepository;
import com.bloghive.backend.repository.user.UsersRepository;
import com.bloghive.backend.DTOs.response.ApiResponse;
import com.bloghive.backend.service.blog.BlogService;
import com.bloghive.backend.utils.CloudinaryService;
import org.bson.types.ObjectId;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Sort;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.data.mongodb.core.query.Update;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class BlogServiceImpl implements BlogService {
    @Autowired
    private BlogRepository blogRepository;

    @Autowired
    private UsersRepository usersRepository;

    @Autowired
    private MongoTemplate mongoTemplate;

    @Autowired
    private CloudinaryService cloudinaryService;

    @Override
    public ResponseEntity<?> createBlog(BlogDetails blogDetails, MultipartFile featureImage) {
        try {
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
            String userId = authentication.getName();
            System.out.println(userId);
            ObjectId objectId = new ObjectId(userId);
            User user = usersRepository.findById(objectId)
                    .orElseThrow(() -> new RuntimeException("User not found with id: " + userId));

            // Upload feature image to Cloudinary
            if (featureImage != null && !featureImage.isEmpty()) {
                Map<String, Object> uploadBlogImage = cloudinaryService.uploadImage(featureImage);
                String secureUrl = uploadBlogImage.get("secure_url").toString();
                blogDetails.setFeatureImage(secureUrl);
            }

            blogDetails.setUserId(user.getId());
            blogDetails.setSlug(blogDetails.getSlug());
            blogDetails.setCreatedAt(LocalDateTime.now());
            blogDetails.setUpdatedAt(LocalDateTime.now());

            BlogDetails save = blogRepository.save(blogDetails);

            BlogSummaryResponse blogSummaryResponse = new BlogSummaryResponse();
            blogSummaryResponse.setBlogId(save.getBlogId().toHexString());
            blogSummaryResponse.setTitle(save.getTitle());
            blogSummaryResponse.setSlug(save.getSlug());
            blogSummaryResponse.setFeatureImage(save.getFeatureImage());
            blogSummaryResponse.setContent(save.getContent());
            blogSummaryResponse.setVisits(save.getVisits());
            blogSummaryResponse.setCreatedAt(save.getCreatedAt());
            blogSummaryResponse.setUpdatedAt(save.getUpdatedAt());

            AuthorResponse authorResponse = new AuthorResponse();
            authorResponse.setUserId(user.getId().toHexString());
            authorResponse.setName(user.getName());
            authorResponse.setUserName(user.getUserName());
            authorResponse.setEmail(user.getEmail());
            authorResponse.setAvtar(user.getAvtar());

            blogSummaryResponse.setBlogAuthorResponseDTO(authorResponse);

            ApiResponse<BlogSummaryResponse> apiResponse = new ApiResponse<>(
                    201,
                    "Blog created successfully",
                    blogSummaryResponse
            );

            return ResponseEntity.status(HttpStatus.CREATED).body(apiResponse);
        } catch (Exception e) {

            ApiResponse<Object> apiResponse = new ApiResponse<>(
                    500,
                    "Error while creating blog: " + e.getMessage(),
                    null
            );
            return ResponseEntity.internalServerError().body(apiResponse);
        }
    }

    @Override
    public ResponseEntity<?> updateBlog(UpdateBlogRequestDTO updateBlogRequestDTO, ObjectId blogId, MultipartFile featureImage) {
        try {
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
            String userId = authentication.getName();
            ObjectId objectId = new ObjectId(userId);
            User user = usersRepository.findById(objectId)
                    .orElseThrow(() -> new RuntimeException("User not found with id: " + userId));

            if (user == null) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body("User not found");
            }


            BlogDetails dbBlogDetails = blogRepository.findById(blogId)
                    .orElseThrow(() -> new RuntimeException("Blog not found with id: " + blogId));

            if (!dbBlogDetails.getUserId().equals(user.getId())) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN).body("You are not authorized to update this blog");
            }
            
            dbBlogDetails.setTitle(updateBlogRequestDTO.getTitle());
            dbBlogDetails.setContent(updateBlogRequestDTO.getContent());
            
            // Handle feature image upload if provided
            if (featureImage != null && !featureImage.isEmpty()) {
                // Delete old image if exists
                if (dbBlogDetails.getFeatureImage() != null && !dbBlogDetails.getFeatureImage().isEmpty()) {
                    String oldUrl = dbBlogDetails.getFeatureImage();
                    String publicId = oldUrl.substring(oldUrl.lastIndexOf("/") + 1).split("\\.")[0];
                    cloudinaryService.deleteImage(publicId);
                }
                
                // Upload new image
                Map<String, Object> uploadResult = cloudinaryService.uploadImage(featureImage);
                String secureUrl = uploadResult.get("secure_url").toString();
                dbBlogDetails.setFeatureImage(secureUrl);
            }
            
            dbBlogDetails.setUpdatedAt(LocalDateTime.now());

            blogRepository.save(dbBlogDetails);

            ApiResponse<Object> apiResponse = new ApiResponse<>(
                    200,
                    "Blog updated successfully",
                    null
            );

            return ResponseEntity.ok(apiResponse);
        } catch (Exception e) {
            ApiResponse<Object> apiResponse = new ApiResponse<>(
                    500,
                    "Error while updating blog: " + e.getMessage(),
                    null
            );
            return ResponseEntity.internalServerError().body(apiResponse);
        }
    }

    @Override
    public ResponseEntity<?> getBlogBySearchKeyword(String keyword) {
        try {
            // Step 1: Search blogs by title or content
            Query query = new Query();
            query.addCriteria(new Criteria().orOperator(
                    Criteria.where("title").regex(keyword, "i"),
                    Criteria.where("content").regex(keyword, "i")
            ));

            List<BlogDetails> blogs = mongoTemplate.find(query, BlogDetails.class);

            // Step 2: Collect all userIds from blogs
            Set<ObjectId> userIds = blogs.stream()
                    .map(BlogDetails::getUserId)
                    .filter(Objects::nonNull)
                    .collect(Collectors.toSet());

            // Step 3: Fetch users in one query
            Query userQuery = new Query(Criteria.where("_id").in(userIds));
            List<User> users = mongoTemplate.find(userQuery, User.class);

            // Map userId -> User for quick lookup
            Map<ObjectId, User> userMap = users.stream()
                    .collect(Collectors.toMap(User::getId, u -> u));

            // Step 4: Map BlogDetails + User -> BlogSummaryResponse
            List<BlogSummaryResponse> responseDTOList = blogs.stream().map(blog -> {
                BlogSummaryResponse dto = new BlogSummaryResponse();
                dto.setBlogId(blog.getBlogId().toHexString());
                dto.setTitle(blog.getTitle());
                dto.setSlug(blog.getSlug());
                dto.setFeatureImage(blog.getFeatureImage());
                dto.setContent(blog.getContent());
                dto.setVisits(blog.getVisits());
                dto.setCreatedAt(blog.getCreatedAt());
                dto.setUpdatedAt(blog.getUpdatedAt());

                // Attach author details
                User author = userMap.get(blog.getUserId());
                if (author != null) {
                    AuthorResponse authorResponse = new AuthorResponse();
                    authorResponse.setUserName(author.getUserName());
                    authorResponse.setName(author.getName());
                    authorResponse.setAvtar(author.getAvtar());
                    dto.setBlogAuthorResponseDTO(authorResponse);
                }

                return dto;
            }).toList();

            ApiResponse<List<BlogSummaryResponse>> apiResponse = new ApiResponse<>(
                    200,
                    "Blogs fetched successfully",
                    responseDTOList
            );
            return ResponseEntity.ok(apiResponse);

        } catch (Exception e) {
            ApiResponse<Object> apiResponse = new ApiResponse<>(
                    500,
                    "Error while fetching blogs: " + e.getMessage(),
                    null
            );
            return ResponseEntity.internalServerError().body(apiResponse);
        }
    }

    @Override
    public ResponseEntity<?> deleteBlog(ObjectId blogId) {
        try {
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
            String userUId = authentication.getName();
            ObjectId objectId = new ObjectId(userUId);
            User user = usersRepository.findById(objectId).orElseThrow(() -> new UsernameNotFoundException("User not found with id: " + userUId));

            BlogDetails blogDetails = blogRepository.findById(blogId).orElseThrow(() -> new RuntimeException("Blog not found with id: " + blogId));

            if (!blogDetails.getUserId().equals(user.getId())) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN).body("You are not authorized to delete this blog");
            }

            blogRepository.deleteById(blogId);

            ApiResponse<Object> apiResponse = new ApiResponse<>(
                    200,
                    "Blog deleted successfully",
                    null
            );

            return ResponseEntity.ok(apiResponse);
        } catch (Exception e) {
            ApiResponse<Object> apiResponse = new ApiResponse<>(
                    500,
                    "Error while deleting blog: " + e.getMessage(),
                    null
            );
            return ResponseEntity.internalServerError().body(apiResponse);
        }
    }

    @Override
    public ResponseEntity<?> getAllBlogPosts() {
        try {
            // Step 1: Fetch blogs sorted by createdAt desc
            Query blogQuery = new Query().with(Sort.by(Sort.Direction.DESC, "createdAt"));
            List<BlogDetails> blogs = mongoTemplate.find(blogQuery, BlogDetails.class);

            // Step 2: Collect all userIds
            Set<ObjectId> userIds = blogs.stream()
                    .map(BlogDetails::getUserId)
                    .filter(Objects::nonNull)
                    .collect(Collectors.toSet());

            // Step 3: Fetch all users in one go
            Query userQuery = new Query(Criteria.where("_id").in(userIds));
            List<User> users = mongoTemplate.find(userQuery, User.class);

            // Map userId -> User
            Map<ObjectId, User> userMap = users.stream()
                    .collect(Collectors.toMap(User::getId, u -> u));

            // Step 4: Map blogs + authors into DTOs
            List<BlogSummaryResponse> responseDTOList = blogs.stream().map(blog -> {
                BlogSummaryResponse dto = new BlogSummaryResponse();

                dto.setBlogId(blog.getBlogId().toHexString());
                dto.setTitle(blog.getTitle());
                dto.setSlug(blog.getSlug());
                dto.setFeatureImage(blog.getFeatureImage());
                dto.setContent(blog.getContent());
                dto.setVisits(blog.getVisits());
                dto.setCreatedAt(blog.getCreatedAt());
                dto.setUpdatedAt(blog.getUpdatedAt());

                User author = userMap.get(blog.getUserId());
                if (author != null) {
                    AuthorResponse authorResponse = new AuthorResponse();
                    authorResponse.setUserId(author.getId().toHexString());
                    authorResponse.setName(author.getName());
                    authorResponse.setUserName(author.getUserName());
                    authorResponse.setEmail(author.getEmail());
                    authorResponse.setAvtar(author.getAvtar());
                    dto.setBlogAuthorResponseDTO(authorResponse);
                }

                return dto;
            }).toList();

            ApiResponse<List<BlogSummaryResponse>> apiResponse = new ApiResponse<>(
                    200,
                    "Blogs fetched successfully",
                    responseDTOList
            );

            return ResponseEntity.ok(apiResponse);

        } catch (Exception e) {
            ApiResponse<Object> apiResponse = new ApiResponse<>(
                    500,
                    "Error while fetching blogs: " + e.getMessage(),
                    null
            );
            return ResponseEntity.internalServerError().body(apiResponse);
        }
    }

    @Override
    public ResponseEntity<?> getBlogPost(ObjectId blogId) {
        try {
            // 1. Fetch blog by ID
            BlogDetails blog = mongoTemplate.findById(blogId, BlogDetails.class);
            if (blog == null) {
                ApiResponse<Object> response = new ApiResponse<>(
                        404,
                        "Blog post not found",
                        null
                );
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response);
            }

            // 2. Increment visits
            mongoTemplate.updateFirst(
                    Query.query(Criteria.where("_id").is(blogId)),
                    new Update().inc("visits", 1),
                    BlogDetails.class
            );

            // 3. Check if logged-in user liked it
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
            boolean isLiked = false;
            if (authentication != null
                    && authentication.isAuthenticated()
                    && !"anonymousUser".equals(authentication.getPrincipal())) {
                ObjectId currentUserId = new ObjectId(authentication.getName());
                LikeDetails like = mongoTemplate.findOne(
                        Query.query(Criteria.where("userId").is(currentUserId).and("blogId").is(blogId)),
                        LikeDetails.class
                );
                isLiked = (like != null);
            }

            // 4. Count likes
            long likesCount = mongoTemplate.count(
                    Query.query(Criteria.where("blogId").is(blogId)),
                    LikeDetails.class
            );

            // 5. Fetch comments
            List<CommentDetails> comments = mongoTemplate.find(
                    Query.query(Criteria.where("blogId").is(blogId)),
                    CommentDetails.class
            );

            // Convert comments to DTOs
            List<CommentResponseDTO> commentDTOs = comments.stream().map(c -> {
                CommentResponseDTO dto = new CommentResponseDTO();
                dto.setCommentId(c.getCommentId());
                User user = usersRepository.findById(c.getUserId()).orElse(null);
                if (user != null) {
                    dto.setUserName(user.getUserName());
                    dto.setAvtar(user.getAvtar());
                } else {
                    dto.setUserName("Unknown");
                }
                dto.setContent(c.getContent());
                dto.setCreatedAt(c.getCreatedAt());
                return dto;
            }).toList();

            // 6. Build BlogSummaryResponse
            BlogSummaryResponse blogSummaryResponse = new BlogSummaryResponse();
            blogSummaryResponse.setBlogId(blog.getBlogId().toHexString());
            blogSummaryResponse.setTitle(blog.getTitle());
            blogSummaryResponse.setSlug(blog.getSlug());
            blogSummaryResponse.setFeatureImage(blog.getFeatureImage());
            blogSummaryResponse.setContent(blog.getContent());
            blogSummaryResponse.setVisits(blog.getVisits() + 1); // since we incremented above
            blogSummaryResponse.setCreatedAt(blog.getCreatedAt());
            blogSummaryResponse.setUpdatedAt(blog.getUpdatedAt());

            // Fetch author (user)
            User author = usersRepository.findById(blog.getUserId()).orElse(null);
            if (author != null) {
                AuthorResponse authorResponse = new AuthorResponse();
                authorResponse.setUserId(author.getId().toHexString());
                authorResponse.setUserName(author.getUserName());
                authorResponse.setName(author.getName());
                authorResponse.setEmail(author.getEmail());
                authorResponse.setAvtar(author.getAvtar());
                blogSummaryResponse.setBlogAuthorResponseDTO(authorResponse);
            }

            // 7. Build BlogDetailsResponse
            BlogDetailsResponse blogDTO = new BlogDetailsResponse();
            blogDTO.setBlogSummaryResponse(blogSummaryResponse);
            blogDTO.setLiked(isLiked);
            blogDTO.setLikes(likesCount);
            blogDTO.setComments(commentDTOs.size());

            ApiResponse<BlogDetailsResponse> response = new ApiResponse<>(
                    200,
                    "Blog fetched successfully",
                    blogDTO
            );
            return ResponseEntity.ok(response);

        } catch (Exception e) {
            ApiResponse<Object> response = new ApiResponse<>(
                    500,
                    "Error while fetching blog: " + e.getMessage(),
                    null
            );
            return ResponseEntity.internalServerError().body(response);
        }
    }

    @Override
    public ResponseEntity<?> getBlogsByUserName(String userName) {
        try {
            // Step 1 : Find user by userName
            User user = usersRepository.findByUserName(userName);

            if (user == null){
                ApiResponse<Object> apiResponse = new ApiResponse<>(
                        404,
                        "User not found",
                        null
                );

                return ResponseEntity.status(HttpStatus.NOT_FOUND).body(apiResponse);
            }

            // Step 2 : Fetch blogs by userId
            Query blogQuery = new Query(
                    Criteria.where("userId").is(user.getId())
            ).with(Sort.by(Sort.Direction.DESC, "createdAt"));

            List<BlogDetails> blogDetailsList = mongoTemplate.find(blogQuery, BlogDetails.class);

            // Step 3 : Map blogs + author
            List<BlogSummaryResponse> responseDTOList = blogDetailsList.stream().map(blog -> {
                BlogSummaryResponse dto = new BlogSummaryResponse();

                dto.setBlogId(blog.getBlogId().toHexString());
                dto.setTitle(blog.getTitle());
                dto.setSlug(blog.getSlug());
                dto.setFeatureImage(blog.getFeatureImage());
                dto.setContent(blog.getContent());
                dto.setVisits(blog.getVisits());
                dto.setCreatedAt(blog.getCreatedAt());
                dto.setUpdatedAt(blog.getUpdatedAt());

                AuthorResponse authorResponse = new AuthorResponse();
                authorResponse.setUserId(user.getId().toHexString());
                authorResponse.setUserName(user.getUserName());
                authorResponse.setName(user.getName());
                authorResponse.setAvtar(user.getAvtar());
                authorResponse.setEmail(user.getEmail());

                dto.setBlogAuthorResponseDTO(authorResponse);

                return dto;
            }).toList();

            ApiResponse<List<BlogSummaryResponse>> apiResponse = new ApiResponse<>(
                    200,
                    "Blogs fetched successfully",
                    responseDTOList
            );

            return ResponseEntity.ok(apiResponse);
        }
        catch (Exception e){
            ApiResponse<Object> apiResponse = new ApiResponse<>(
                    500,
                    "Error while fetching blogs by user: " + e.getMessage(),
                    null
            );

            return ResponseEntity.internalServerError().body(apiResponse);
        }
    }

}

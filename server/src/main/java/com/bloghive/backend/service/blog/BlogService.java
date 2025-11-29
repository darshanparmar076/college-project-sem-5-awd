package com.bloghive.backend.service.blog;

import com.bloghive.backend.DTOs.request.UpdateBlogRequestDTO;
import com.bloghive.backend.model.blog.BlogDetails;
import org.bson.types.ObjectId;
import org.springframework.http.ResponseEntity;
import org.springframework.web.multipart.MultipartFile;

public interface BlogService {
    ResponseEntity<?> createBlog(BlogDetails blogDetails, MultipartFile featureImage);

    ResponseEntity<?> updateBlog(UpdateBlogRequestDTO updateBlogRequestDTO, ObjectId blogId, MultipartFile featureImage);

    ResponseEntity<?> getBlogBySearchKeyword(String keyword);

    ResponseEntity<?> deleteBlog(ObjectId blogId);

    ResponseEntity<?> getAllBlogPosts();

    ResponseEntity<?> getBlogPost(ObjectId blogId);

    ResponseEntity<?> getBlogsByUserName(String userName);
}

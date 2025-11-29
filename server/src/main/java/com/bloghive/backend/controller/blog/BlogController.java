package com.bloghive.backend.controller.blog;

import com.bloghive.backend.DTOs.request.UpdateBlogRequestDTO;
import com.bloghive.backend.model.blog.BlogDetails;
import com.bloghive.backend.service.blog.BlogService;
import org.bson.types.ObjectId;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("blog")
public class BlogController {
    @Autowired
    private BlogService blogService;

    @PostMapping(value = "create", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<?> createBlog(
            @RequestParam("title") String title,
            @RequestParam("slug") String slug,
            @RequestParam("content") String content,
            @RequestParam("featureImage") MultipartFile featureImage){
        
        BlogDetails blogDetails = new BlogDetails();
        blogDetails.setTitle(title);
        blogDetails.setSlug(slug);
        blogDetails.setContent(content);
        
        return blogService.createBlog(blogDetails, featureImage);
    }

    @PostMapping(value = "edit/{blogId}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<?> updateBlog(
            @PathVariable ObjectId blogId,
            @RequestParam("title") String title,
            @RequestParam("content") String content,
            @RequestParam(value = "featureImage", required = false) MultipartFile featureImage){
        
        UpdateBlogRequestDTO updateBlogRequestDTO = new UpdateBlogRequestDTO();
        updateBlogRequestDTO.setTitle(title);
        updateBlogRequestDTO.setContent(content);
        
        return blogService.updateBlog(updateBlogRequestDTO, blogId, featureImage);
    }

    @DeleteMapping("{blogId}")
    public ResponseEntity<?> deleteBlog(@PathVariable ObjectId blogId){
        return blogService.deleteBlog(blogId);
    }
}

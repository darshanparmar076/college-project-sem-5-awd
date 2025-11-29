package com.bloghive.backend.controller.like;

import com.bloghive.backend.service.like.LikeService;
import org.bson.types.ObjectId;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("like")
public class LikeController {
    @Autowired
    private LikeService likeService;

    @PostMapping("{blogId}/like-blog-post")
    public ResponseEntity<?> likeBlogPost(@PathVariable ObjectId blogId){
        return likeService.likeBlogPost(blogId);
    }

    @DeleteMapping("{blogId}/unlike-blog-post")
    public ResponseEntity<?> unlikeBlogPost(@PathVariable ObjectId blogId){
        return likeService.unlikeBlogPost(blogId);
    }
}

package com.bloghive.backend.controller.user;

import com.bloghive.backend.model.user.OtpDetails;
import com.bloghive.backend.model.user.User;
import com.bloghive.backend.service.blog.BlogService;
import com.bloghive.backend.service.comment.CommentService;
import com.bloghive.backend.service.user.OtpService;
import com.bloghive.backend.service.user.PublicService;
import com.bloghive.backend.service.user.UserService;
import jakarta.servlet.http.HttpServletResponse;
import org.bson.types.ObjectId;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("public")
public class PublicController {
    @Autowired
    private PublicService publicService;

    @Autowired
    private OtpService otpService;

    @Autowired
    private BlogService blogService;

    @Autowired
    private UserService userService;

    @Autowired
    private CommentService commentService;

    @PostMapping("signup")
    public ResponseEntity<?> signup(@RequestBody User user){
        return publicService.signup(user);
    }

    @PostMapping("login")
    public ResponseEntity<?> login(@RequestBody User users){
        return publicService.login(users);
    }

    @PostMapping("otp-verification")
    public ResponseEntity<?> otpVerification(@RequestBody OtpDetails otpDetails, HttpServletResponse response){
        return otpService.compareOtp(otpDetails, response);
    }

    @GetMapping("get-blog-search/{keyword}")
    public ResponseEntity<?> getBlogBySearchKeyword(@PathVariable String keyword){
        return blogService.getBlogBySearchKeyword(keyword);
    }

    @GetMapping("get-all-blog-posts")
    public ResponseEntity<?> getAllBlogPosts(){
        return blogService.getAllBlogPosts();
    }

    @GetMapping("get-blog-post/{blogId}")
    public ResponseEntity<?> getBlogPost(@PathVariable ObjectId blogId){
        return blogService.getBlogPost(blogId);
    }

    @GetMapping("get-user/{userName}")
    public ResponseEntity<?> getUserProfile(@PathVariable String userName){
        return userService.getUserProfile(userName);
    }

    @GetMapping("user/{userName}/get-user-post")
    public ResponseEntity<?> getUserPost(@PathVariable String userName){
        return blogService.getBlogsByUserName(userName);
    }

    @GetMapping("{blogId}/get-blog-comments")
    public ResponseEntity<?> getBlogComments(@PathVariable ObjectId blogId){
        return commentService.getBlogComments(blogId);
    }
}

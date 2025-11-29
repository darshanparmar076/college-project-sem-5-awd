package com.bloghive.backend.controller.follow;

import com.bloghive.backend.service.follow.FollowService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("follow")
public class FollowController {
    @Autowired
    private FollowService followService;

    @PostMapping("{userName}/follow-user")
    public ResponseEntity<?> followUser(@PathVariable String userName){
        return followService.followUser(userName);
    }

    @DeleteMapping("{userName}/unfollow-user")
    public ResponseEntity<?> unfollowUser(@PathVariable String userName){
        return followService.unFollowUser(userName);
    }
}

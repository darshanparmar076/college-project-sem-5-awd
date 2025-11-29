package com.bloghive.backend.service.follow;

import org.springframework.http.ResponseEntity;

public interface FollowService {
    ResponseEntity<?> followUser(String userName);

    ResponseEntity<?> unFollowUser(String userName);
}

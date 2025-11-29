package com.bloghive.backend.service.like;

import org.bson.types.ObjectId;
import org.springframework.http.ResponseEntity;

public interface LikeService {
    ResponseEntity<?> likeBlogPost(ObjectId blogId);

    ResponseEntity<?> unlikeBlogPost(ObjectId blogId);
}

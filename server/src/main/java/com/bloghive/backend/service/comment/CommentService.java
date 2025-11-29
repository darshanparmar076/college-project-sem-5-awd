package com.bloghive.backend.service.comment;

import com.bloghive.backend.model.comment.CommentDetails;
import org.bson.types.ObjectId;
import org.springframework.http.ResponseEntity;

public interface CommentService {
    ResponseEntity<?> createComment(CommentDetails commentDetails, ObjectId blogId);

    ResponseEntity<?> getBlogComments(ObjectId blogId);
}

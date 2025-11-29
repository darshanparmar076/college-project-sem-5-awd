package com.bloghive.backend.controller.comment;

import com.bloghive.backend.model.comment.CommentDetails;
import com.bloghive.backend.service.comment.CommentService;
import org.bson.types.ObjectId;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("comment")
public class CommentController {
    @Autowired
    private CommentService commentService;

    @PostMapping("{blogId}/create-comment")
    public ResponseEntity<?> createComment(@PathVariable ObjectId blogId, @RequestBody CommentDetails commentDetails){
        return commentService.createComment(commentDetails, blogId);
    }
}

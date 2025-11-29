package com.bloghive.backend.repository.comment;

import com.bloghive.backend.model.comment.CommentDetails;
import org.bson.types.ObjectId;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface CommentRepository extends MongoRepository<CommentDetails, ObjectId> {
}

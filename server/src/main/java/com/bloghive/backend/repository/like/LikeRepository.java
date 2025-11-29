package com.bloghive.backend.repository.like;

import com.bloghive.backend.model.like.LikeDetails;
import org.bson.types.ObjectId;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface LikeRepository extends MongoRepository<LikeDetails, ObjectId> {
    Optional<LikeDetails> findByUserIdAndBlogId(ObjectId objectId, ObjectId blogId);
}

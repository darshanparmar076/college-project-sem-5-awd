package com.bloghive.backend.repository.blog;

import com.bloghive.backend.model.blog.BlogDetails;
import org.bson.types.ObjectId;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface BlogRepository extends MongoRepository<BlogDetails, ObjectId> {
    long countByUserId(ObjectId id);

    List<BlogDetails> findByTitleRegexIgnoreCaseOrContentRegexIgnoreCase(String regexPattern, String regexPattern1);
}

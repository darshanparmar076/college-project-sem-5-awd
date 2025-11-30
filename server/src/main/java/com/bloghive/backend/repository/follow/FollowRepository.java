package com.bloghive.backend.repository.follow;

import com.bloghive.backend.model.follow.FollowDetails;
import org.bson.types.ObjectId;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface FollowRepository extends MongoRepository<FollowDetails, ObjectId> {
    long countByFollowingId(ObjectId id);

    long countByFollowerId(ObjectId id);

    boolean existsByFollowerIdAndFollowingId(ObjectId loggedInUserId, ObjectId id);

    FollowDetails findByFollowerIdAndFollowingId(ObjectId id, ObjectId id1);
}

package com.bloghive.backend.repository.follow;

import com.bloghive.backend.model.follow.FollowDetails;
import org.bson.types.ObjectId;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface FollowRepository extends MongoRepository<FollowDetails, ObjectId> {
    long countByFollowing(ObjectId id);

    long countByFollower(ObjectId id);

    boolean existsByFollowerAndFollowing(ObjectId loggedInUserId, ObjectId id);

    FollowDetails findByFollowerAndFollowing(ObjectId id, ObjectId id1);
}

package com.bloghive.backend.repository.user;

import com.bloghive.backend.model.user.OtpDetails;
import org.bson.types.ObjectId;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;

@Repository
public interface OtpRepository extends MongoRepository<OtpDetails, ObjectId> {
    OtpDetails findByEmail(String email);

    void deleteByLocalTimeBefore(LocalDateTime expiryTime);
}

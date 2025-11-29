package com.bloghive.backend.repository.user;

import com.bloghive.backend.model.user.User;
import org.bson.types.ObjectId;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface UsersRepository extends MongoRepository<User, ObjectId> {
    User findByUserName(String userName);

    @Query("{ 'datetime' : { $lte: ?0 } }")
    List<User> findByTime(LocalDateTime expiryTime);

    User findByEmail(String email);

    boolean existsByUserName(String username);
}

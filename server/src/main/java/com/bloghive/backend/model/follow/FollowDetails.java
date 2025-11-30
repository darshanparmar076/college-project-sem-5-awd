package com.bloghive.backend.model.follow;

import org.bson.types.ObjectId;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;

@Document(collection = "follows")
public class FollowDetails {
    @Id
    private ObjectId followId;
    private ObjectId followerId;
    private ObjectId followingId;
    private LocalDateTime createdAt = LocalDateTime.now();
    private LocalDateTime updatedAt = LocalDateTime.now();

    public ObjectId getFollowId() {
        return followId;
    }

    public void setFollowId(ObjectId followId) {
        this.followId = followId;
    }

    public ObjectId getFollowerId() {
        return followerId;
    }

    public void setFollowerId(ObjectId followerId) {
        this.followerId = followerId;
    }

    public ObjectId getFollowingId() {
        return followingId;
    }

    public void setFollowingId(ObjectId followingId) {
        this.followingId = followingId;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(LocalDateTime updatedAt) {
        this.updatedAt = updatedAt;
    }
}

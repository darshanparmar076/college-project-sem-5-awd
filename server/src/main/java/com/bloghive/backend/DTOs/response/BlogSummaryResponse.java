package com.bloghive.backend.DTOs.response;

import java.time.LocalDateTime;

public class BlogSummaryResponse {
    private String blogId;
    private String title;
    private String slug;
    private String featureImage;
    private String content;
    private long visits;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    private AuthorResponse authorResponse;


    public BlogSummaryResponse() {
    }

    public BlogSummaryResponse(String blogId, String title, String slug, String featureImage, String content, long visits, LocalDateTime createdAt, LocalDateTime updatedAt, AuthorResponse authorResponse) {
        this.blogId = blogId;
        this.title = title;
        this.slug = slug;
        this.featureImage = featureImage;
        this.content = content;
        this.visits = visits;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
        this.authorResponse = authorResponse;
    }

    public String getBlogId() {
        return blogId;
    }

    public void setBlogId(String blogId) {
        this.blogId = blogId;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getSlug() {
        return slug;
    }

    public void setSlug(String slug) {
        this.slug = slug;
    }

    public String getFeatureImage() {
        return featureImage;
    }

    public void setFeatureImage(String featureImage) {
        this.featureImage = featureImage;
    }

    public String getContent() {
        return content;
    }

    public void setContent(String content) {
        this.content = content;
    }

    public long getVisits() {
        return visits;
    }

    public void setVisits(long visits) {
        this.visits = visits;
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

    public AuthorResponse getBlogAuthorResponseDTO() {
        return authorResponse;
    }

    public void setBlogAuthorResponseDTO(AuthorResponse authorResponse) {
        this.authorResponse = authorResponse;
    }
}

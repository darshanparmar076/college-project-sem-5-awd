package com.bloghive.backend.DTOs.response;

public class BlogDetailsResponse {
    private BlogSummaryResponse blogSummaryResponse;
    private boolean isLiked;
    private long likes;
    private long comments;

    public BlogDetailsResponse() {
    }

    public BlogDetailsResponse(BlogSummaryResponse blogSummaryResponse, boolean isLiked, long likes, long comments) {
        this.blogSummaryResponse = blogSummaryResponse;
        this.isLiked = isLiked;
        this.likes = likes;
        this.comments = comments;
    }

    public BlogSummaryResponse getBlogSummaryResponse() {
        return blogSummaryResponse;
    }

    public void setBlogSummaryResponse(BlogSummaryResponse blogSummaryResponse) {
        this.blogSummaryResponse = blogSummaryResponse;
    }

    public boolean isLiked() {
        return isLiked;
    }

    public void setLiked(boolean liked) {
        isLiked = liked;
    }

    public long getLikes() {
        return likes;
    }

    public void setLikes(long likes) {
        this.likes = likes;
    }

    public long getComments() {
        return comments;
    }

    public void setComments(long comments) {
        this.comments = comments;
    }
}

package com.bloghive.backend.DTOs.response;

public class AuthorResponse {
    private String userId;
    private String name;
    private String userName;
    private String email;
    private String avtar;

    public AuthorResponse() {
    }

    public AuthorResponse(String userId, String name, String userName, String email, String avtar) {
        this.userId = userId;
        this.name = name;
        this.userName = userName;
        this.email = email;
        this.avtar = avtar;
    }

    public String getUserId() {
        return userId;
    }

    public void setUserId(String userId) {
        this.userId = userId;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getUserName() {
        return userName;
    }

    public void setUserName(String userName) {
        this.userName = userName;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getAvtar() {
        return avtar;
    }

    public void setAvtar(String avtar) {
        this.avtar = avtar;
    }
}

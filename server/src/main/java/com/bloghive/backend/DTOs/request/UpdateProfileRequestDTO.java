package com.bloghive.backend.DTOs.request;

import com.fasterxml.jackson.annotation.JsonProperty;

public class UpdateProfileRequestDTO {
    private String name;
    
    @JsonProperty("username")
    private String username;
    
    private String email;
    private String gender;

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getUserName() {
        return username;
    }

    public void setUserName(String userName) {
        this.username = userName;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getGender() {
        return gender;
    }

    public void setGender(String gender) {
        this.gender = gender;
    }
}
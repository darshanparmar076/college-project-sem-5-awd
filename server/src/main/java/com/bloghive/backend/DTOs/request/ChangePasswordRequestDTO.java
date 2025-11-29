package com.bloghive.backend.DTOs.request;

public class ChangePasswordRequestDTO {
    private String currentPassword;
    private String newPasssword;
    private String confirmPassword;

    public ChangePasswordRequestDTO() {
    }

    public ChangePasswordRequestDTO(String currentPassword, String newPasssword, String confirmPassword) {
        this.currentPassword = currentPassword;
        this.newPasssword = newPasssword;
        this.confirmPassword = confirmPassword;
    }

    public String getCurrentPassword() {
        return currentPassword;
    }

    public void setCurrentPassword(String currentPassword) {
        this.currentPassword = currentPassword;
    }

    public String getNewPasssword() {
        return newPasssword;
    }

    public void setNewPasssword(String newPasssword) {
        this.newPasssword = newPasssword;
    }

    public String getConfirmPassword() {
        return confirmPassword;
    }

    public void setConfirmPassword(String confirmPassword) {
        this.confirmPassword = confirmPassword;
    }
}

package com.bloghive.backend.service.user;

import com.bloghive.backend.model.user.User;
import org.springframework.http.ResponseEntity;

public interface PublicService {
    ResponseEntity<?> signup(User user);

    ResponseEntity<?> login(User users);
}

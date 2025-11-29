package com.bloghive.backend.configuration;

import com.bloghive.backend.model.user.User;
import com.bloghive.backend.repository.user.UsersRepository;
import org.bson.types.ObjectId;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

@Service
public class UserServiceImpls implements UserDetailsService {

    @Autowired
    private UsersRepository usersRepository;

    @Override
    public UserDetails loadUserByUsername(String userId) throws UsernameNotFoundException {
//        User user =usersRepository.findByUserName(username);

        ObjectId objectId;
        try {
            objectId = new ObjectId(userId);
        } catch (IllegalArgumentException e) {
            throw new UsernameNotFoundException("Invalid user id format: " + userId);
        }
        User user = usersRepository.findById(objectId)
                .orElseThrow(() -> new UsernameNotFoundException("User not found with id: " + userId));

        if (user != null){
            return org.springframework.security.core.userdetails.User.builder()
//                    .username(user.getUserName())
                    .username(user.getId().toString())
                    .password(user.getPassword())
                    .roles(user.getRole())
                    .build();
        }

        throw new UsernameNotFoundException("User not found with username: " + userId);
    }
}

package com.userservice.impl;

import com.userservice.entity.User;
import com.userservice.exception.UserNotFoundException;
import com.userservice.repository.UserRepository;
import com.userservice.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class UserServiceImpl implements UserService {

    @Autowired
    private UserRepository userRepository;

    @Override
    public List<User> getAllUser() {
        List<User> allUsers = userRepository.findAll();
        return allUsers;
    }

    @Override
    public User getOneUser(String id) {
        Optional<User> u = userRepository.findById(id);
        return u.orElseThrow(
                () -> new UserNotFoundException("User not present in id : " + id)
        );
    }

    @Override
    public User createUser(User u) {
        User u1 = userRepository.save(u);
        return u1;
    }

    @Override
    public boolean updateUser(String id, User u) {
        Optional<User> oldUser = userRepository.findById(id);

        if (oldUser.isPresent()) {
            u.setId(id);
            userRepository.save(u);
            return true;
        }

        return false;
    }

    @Override
    public boolean deleteUser(String id) {
        Optional<User> u = userRepository.findById(id);

        if (u.isPresent()) {
            userRepository.deleteById(id);
            return true;
        }

        return false;
    }
}
package com.userservice.controller;

import com.userservice.entity.User;
import com.userservice.service.UserService;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
public class UserController {

    private UserService us;

    public UserController(UserService uu) {
        this.us = uu;
    }

    @PostMapping("/create")
    public String create(@RequestBody User u1) {
        String x = UUID.randomUUID().toString();
        u1.setId(x);
        us.createUser(u1);
        return "Success";
    }

    @GetMapping("/getAllUser")
    public List<User> getAllUser() {
        return us.getAllUser();
    }

    @GetMapping("/getUser/{id}")
    public User getUserById(@PathVariable String id) {
        return us.getOneUser(id);
    }

    @PutMapping("/updateUser/{id}")
    public String updateUser(@PathVariable String id,
                             @RequestBody User u1) {
        boolean x = us.updateUser(id, u1);

        if (x) {
            return "Success";
        }

        return "Data not Found";
    }

    @DeleteMapping("/deleteUser/{id}")
    public boolean deleteUser(@PathVariable String id) {
        return us.deleteUser(id);
    }
}
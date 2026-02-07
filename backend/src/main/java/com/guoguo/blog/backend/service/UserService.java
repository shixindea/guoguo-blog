package com.guoguo.blog.backend.service;

import com.guoguo.blog.backend.dto.UserDTO;

public interface UserService {
  UserDTO getUserById(Long id);
}


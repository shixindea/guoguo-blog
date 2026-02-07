package com.guoguo.blog.backend.service;

import com.guoguo.blog.backend.dto.UserDTO;
import com.guoguo.blog.backend.dto.UpdateMyProfileRequest;

public interface UserService {
  UserDTO getUserById(Long id);

  UserDTO updateMyProfile(Long id, UpdateMyProfileRequest request);
}

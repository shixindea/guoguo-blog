package com.guoguo.blog.backend.service;

import com.guoguo.blog.backend.dto.AuthResponse;
import com.guoguo.blog.backend.dto.LoginRequest;
import com.guoguo.blog.backend.dto.RegisterRequest;

public interface AuthService {
  AuthResponse register(RegisterRequest request);

  AuthResponse login(LoginRequest request);
}


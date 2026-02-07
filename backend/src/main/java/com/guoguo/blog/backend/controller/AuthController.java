package com.guoguo.blog.backend.controller;

import com.guoguo.blog.backend.dto.AuthResponse;
import com.guoguo.blog.backend.dto.LoginRequest;
import com.guoguo.blog.backend.dto.RegisterRequest;
import com.guoguo.blog.backend.service.AuthService;
import com.guoguo.blog.backend.web.ApiResponse;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 * 认证模块接口
 *
 * <p>提供注册、登录等公开接口，用于获取 JWT 访问令牌。</p>
 */
@Tag(name = "Auth", description = "登录注册相关接口")
@RestController
@RequestMapping(value = "/api/auth", produces = MediaType.APPLICATION_JSON_VALUE)
@RequiredArgsConstructor
@Validated
public class AuthController {
  private final AuthService authService;

  /**
   * 用户注册
   *
   * <p>创建用户并返回访问令牌与用户信息。</p>
   *
   * @param request 注册请求
   * @return 注册结果
   */
  @Operation(summary = "用户注册", description = "创建用户并返回 accessToken/refreshToken")
  @PostMapping(value = "/register", consumes = MediaType.APPLICATION_JSON_VALUE)
  public ResponseEntity<ApiResponse<AuthResponse>> register(@Valid @RequestBody RegisterRequest request) {
    return ResponseEntity.ok(ApiResponse.success("注册成功", authService.register(request)));
  }

  /**
   * 用户登录
   *
   * <p>使用邮箱或用户名 + 密码进行登录，成功后返回访问令牌与用户信息。</p>
   *
   * @param request 登录请求
   * @return 登录结果
   */
  @Operation(summary = "用户登录", description = "使用邮箱或用户名 + 密码登录，返回 accessToken/refreshToken")
  @PostMapping(value = "/login", consumes = MediaType.APPLICATION_JSON_VALUE)
  public ResponseEntity<ApiResponse<AuthResponse>> login(@Valid @RequestBody LoginRequest request) {
    return ResponseEntity.ok(ApiResponse.success("登录成功", authService.login(request)));
  }
}


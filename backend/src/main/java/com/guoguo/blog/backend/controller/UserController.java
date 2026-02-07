package com.guoguo.blog.backend.controller;

import com.guoguo.blog.backend.dto.UserDTO;
import com.guoguo.blog.backend.security.CustomUserDetails;
import com.guoguo.blog.backend.service.UserService;
import com.guoguo.blog.backend.web.ApiResponse;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 * 用户模块接口
 *
 * <p>提供需要登录态的用户信息相关接口。</p>
 */
@Tag(name = "User", description = "用户信息相关接口")
@SecurityRequirement(name = "BearerAuth")
@RestController
@RequestMapping(value = "/api/user", produces = MediaType.APPLICATION_JSON_VALUE)
@RequiredArgsConstructor
public class UserController {
  private final UserService userService;

  /**
   * 获取当前用户信息
   *
   * <p>需要携带 Authorization: Bearer &lt;token&gt;。</p>
   *
   * @param userDetails 当前登录用户
   * @return 当前用户信息
   */
  @Operation(summary = "获取当前用户信息")
  @GetMapping("/me")
  public ResponseEntity<ApiResponse<UserDTO>> me(@AuthenticationPrincipal CustomUserDetails userDetails) {
    return ResponseEntity.ok(ApiResponse.success(userService.getUserById(userDetails.getId())));
  }
}


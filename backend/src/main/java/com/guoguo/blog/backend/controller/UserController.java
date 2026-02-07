package com.guoguo.blog.backend.controller;

import com.guoguo.blog.backend.dto.UserDTO;
import com.guoguo.blog.backend.dto.UpdateMyProfileRequest;
import com.guoguo.blog.backend.security.CustomUserDetails;
import com.guoguo.blog.backend.service.UserService;
import com.guoguo.blog.backend.web.ApiResponse;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
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

  /**
   * 更新当前用户资料
   *
   * <p>支持更新昵称、头像、个人简介。邮箱等敏感字段不在此接口更新。</p>
   *
   * @param userDetails 当前登录用户
   * @param request 更新请求
   * @return 更新后的用户信息
   */
  @Operation(summary = "更新当前用户资料")
  @PutMapping(value = "/me", consumes = MediaType.APPLICATION_JSON_VALUE)
  public ResponseEntity<ApiResponse<UserDTO>> updateMyProfile(
      @AuthenticationPrincipal CustomUserDetails userDetails, @Valid @RequestBody UpdateMyProfileRequest request) {
    return ResponseEntity.ok(ApiResponse.success("保存成功", userService.updateMyProfile(userDetails.getId(), request)));
  }
}

package com.guoguo.blog.backend.controller;

import com.guoguo.blog.backend.dto.DashboardOverviewDTO;
import com.guoguo.blog.backend.security.CustomUserDetails;
import com.guoguo.blog.backend.service.DashboardService;
import com.guoguo.blog.backend.web.ApiResponse;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 * 控制台模块接口
 *
 * <p>提供用户控制台所需的数据概览接口。</p>
 */
@Tag(name = "Dashboard", description = "控制台相关接口")
@SecurityRequirement(name = "BearerAuth")
@RestController
@RequestMapping(value = "/api/dashboard", produces = MediaType.APPLICATION_JSON_VALUE)
@RequiredArgsConstructor
@Validated
public class DashboardController {
  private final DashboardService dashboardService;

  /**
   * 获取控制台数据概览
   *
   * @param user 当前登录用户
   * @return 控制台概览数据
   */
  @Operation(summary = "获取控制台数据概览")
  @GetMapping("/overview")
  public ResponseEntity<ApiResponse<DashboardOverviewDTO>> overview(@AuthenticationPrincipal CustomUserDetails user) {
    return ResponseEntity.ok(ApiResponse.success(dashboardService.overview(user.getId())));
  }
}


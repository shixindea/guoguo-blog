package com.guoguo.blog.backend.controller;

import com.guoguo.blog.backend.dto.CheckinCalendarDTO;
import com.guoguo.blog.backend.dto.CheckinRequest;
import com.guoguo.blog.backend.dto.CheckinResultDTO;
import com.guoguo.blog.backend.dto.CheckinStatusDTO;
import com.guoguo.blog.backend.security.CustomUserDetails;
import com.guoguo.blog.backend.service.CheckinService;
import com.guoguo.blog.backend.web.ApiResponse;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

/**
 * 签到模块接口
 *
 * <p>提供签到、签到状态、签到日历等能力。</p>
 */
@Tag(name = "Checkin", description = "签到相关接口")
@RestController
@RequestMapping(value = "/api/checkins", produces = MediaType.APPLICATION_JSON_VALUE)
@RequiredArgsConstructor
@Validated
public class CheckinController {
  private final CheckinService checkinService;

  /**
   * 执行签到
   *
   * <p>幂等约束：同一用户同一天只能签到一次。</p>
   *
   * @param user 当前登录用户
   * @param request 签到请求
   * @param httpServletRequest HTTP请求（用于获取IP）
   * @return 签到结果
   */
  @Operation(summary = "执行签到")
  @PostMapping(consumes = MediaType.APPLICATION_JSON_VALUE)
  public ResponseEntity<ApiResponse<CheckinResultDTO>> checkin(
      @AuthenticationPrincipal CustomUserDetails user,
      @Valid @RequestBody CheckinRequest request,
      HttpServletRequest httpServletRequest) {
    String ipAddress = resolveIp(httpServletRequest);
    CheckinResultDTO result = checkinService.checkin(user.getId(), request, ipAddress);
    return ResponseEntity.ok(ApiResponse.success("签到成功", result));
  }

  /**
   * 获取签到状态
   *
   * @param user 当前登录用户
   * @return 签到状态
   */
  @Operation(summary = "获取签到状态")
  @GetMapping("/status")
  public ResponseEntity<ApiResponse<CheckinStatusDTO>> status(@AuthenticationPrincipal CustomUserDetails user) {
    return ResponseEntity.ok(ApiResponse.success(checkinService.status(user.getId())));
  }

  /**
   * 获取签到日历
   *
   * @param user 当前登录用户
   * @param yearMonth 年月（YYYY-MM），不传默认当前月
   * @return 签到日历数据
   */
  @Operation(summary = "获取签到日历")
  @GetMapping("/calendar")
  public ResponseEntity<ApiResponse<CheckinCalendarDTO>> calendar(
      @AuthenticationPrincipal CustomUserDetails user, @RequestParam(name = "yearMonth", required = false) String yearMonth) {
    return ResponseEntity.ok(ApiResponse.success(checkinService.calendar(user.getId(), yearMonth)));
  }

  private String resolveIp(HttpServletRequest request) {
    String xff = request.getHeader("X-Forwarded-For");
    if (xff != null && !xff.isBlank()) {
      int comma = xff.indexOf(',');
      return comma > 0 ? xff.substring(0, comma).trim() : xff.trim();
    }
    String xri = request.getHeader("X-Real-IP");
    if (xri != null && !xri.isBlank()) return xri.trim();
    return request.getRemoteAddr();
  }
}


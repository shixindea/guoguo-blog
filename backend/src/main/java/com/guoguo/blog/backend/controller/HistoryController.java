package com.guoguo.blog.backend.controller;

import com.guoguo.blog.backend.dto.HistoryItemDTO;
import com.guoguo.blog.backend.dto.PageResponse;
import com.guoguo.blog.backend.security.CustomUserDetails;
import com.guoguo.blog.backend.service.HistoryService;
import com.guoguo.blog.backend.web.ApiResponse;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

/**
 * 浏览历史模块接口
 *
 * <p>提供当前用户的浏览历史列表、删除与清空等能力。</p>
 */
@Tag(name = "History", description = "浏览历史相关接口")
@SecurityRequirement(name = "BearerAuth")
@RestController
@RequestMapping(value = "/api/histories", produces = MediaType.APPLICATION_JSON_VALUE)
@RequiredArgsConstructor
@Validated
public class HistoryController {
  private final HistoryService historyService;

  /**
   * 获取我的浏览历史
   *
   * @param user 当前登录用户
   * @param page 页码（从1开始）
   * @param size 每页大小
   * @return 浏览历史分页列表
   */
  @Operation(summary = "获取我的浏览历史")
  @GetMapping
  public ResponseEntity<ApiResponse<PageResponse<HistoryItemDTO>>> list(
      @AuthenticationPrincipal CustomUserDetails user,
      @RequestParam(name = "page", defaultValue = "1") int page,
      @RequestParam(name = "size", defaultValue = "50") int size) {
    return ResponseEntity.ok(ApiResponse.success(historyService.listMyHistory(user.getId(), page, size)));
  }

  /**
   * 删除一条浏览历史
   *
   * @param user 当前登录用户
   * @param id 历史记录ID
   * @return void
   */
  @Operation(summary = "删除一条浏览历史")
  @DeleteMapping("/{id}")
  public ResponseEntity<ApiResponse<Void>> remove(@AuthenticationPrincipal CustomUserDetails user, @PathVariable("id") Long id) {
    historyService.removeMyHistory(user.getId(), id);
    return ResponseEntity.ok(ApiResponse.success("删除成功"));
  }

  /**
   * 清空浏览历史
   *
   * @param user 当前登录用户
   * @return void
   */
  @Operation(summary = "清空浏览历史")
  @DeleteMapping
  public ResponseEntity<ApiResponse<Void>> clear(@AuthenticationPrincipal CustomUserDetails user) {
    historyService.clearMyHistory(user.getId());
    return ResponseEntity.ok(ApiResponse.success("已清空"));
  }
}


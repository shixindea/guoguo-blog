package com.guoguo.blog.backend.controller;

import com.guoguo.blog.backend.dto.CollectionItemDTO;
import com.guoguo.blog.backend.dto.PageResponse;
import com.guoguo.blog.backend.security.CustomUserDetails;
import com.guoguo.blog.backend.service.CollectionService;
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
 * 收藏模块接口
 *
 * <p>提供当前用户的收藏列表与取消收藏等能力。</p>
 */
@Tag(name = "Collection", description = "收藏相关接口")
@SecurityRequirement(name = "BearerAuth")
@RestController
@RequestMapping(value = "/api/collections", produces = MediaType.APPLICATION_JSON_VALUE)
@RequiredArgsConstructor
@Validated
public class CollectionController {
  private final CollectionService collectionService;

  /**
   * 获取我的收藏列表
   *
   * @param user 当前登录用户
   * @param page 页码（从1开始）
   * @param size 每页大小
   * @return 收藏分页列表
   */
  @Operation(summary = "获取我的收藏列表")
  @GetMapping
  public ResponseEntity<ApiResponse<PageResponse<CollectionItemDTO>>> list(
      @AuthenticationPrincipal CustomUserDetails user,
      @RequestParam(name = "page", defaultValue = "1") int page,
      @RequestParam(name = "size", defaultValue = "20") int size) {
    return ResponseEntity.ok(ApiResponse.success(collectionService.listMyCollections(user.getId(), page, size)));
  }

  /**
   * 取消收藏（按文章ID）
   *
   * @param user 当前登录用户
   * @param articleId 文章ID
   * @return void
   */
  @Operation(summary = "取消收藏")
  @DeleteMapping("/{articleId}")
  public ResponseEntity<ApiResponse<Void>> remove(
      @AuthenticationPrincipal CustomUserDetails user, @PathVariable("articleId") Long articleId) {
    collectionService.removeMyCollection(user.getId(), articleId);
    return ResponseEntity.ok(ApiResponse.success("取消收藏成功"));
  }
}


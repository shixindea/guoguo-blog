package com.guoguo.blog.backend.controller;

import com.guoguo.blog.backend.dto.ArticleListItem;
import com.guoguo.blog.backend.dto.ArticleRequest;
import com.guoguo.blog.backend.dto.ArticleResponse;
import com.guoguo.blog.backend.dto.ArticleViewRequest;
import com.guoguo.blog.backend.dto.PageResponse;
import com.guoguo.blog.backend.security.CustomUserDetails;
import com.guoguo.blog.backend.service.ArticleService;
import com.guoguo.blog.backend.web.ApiResponse;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

/**
 * 文章模块接口
 *
 * <p>提供文章的创建、编辑、删除、列表与详情等接口。</p>
 */
@Tag(name = "Article", description = "文章相关接口")
@RestController
@RequestMapping(value = "/api/articles", produces = MediaType.APPLICATION_JSON_VALUE)
@RequiredArgsConstructor
@Validated
public class ArticleController {
  private final ArticleService articleService;

  /**
   * 创建文章
   *
   * <p>创建文章默认为草稿，支持直接发布。</p>
   *
   * @param user 当前登录用户
   * @param request 文章请求
   * @return 创建结果
   */
  @SecurityRequirement(name = "BearerAuth")
  @Operation(summary = "创建文章", description = "创建文章（草稿/发布），返回文章详情")
  @PostMapping(consumes = MediaType.APPLICATION_JSON_VALUE)
  public ResponseEntity<ApiResponse<ArticleResponse>> create(
      @AuthenticationPrincipal CustomUserDetails user, @Valid @RequestBody ArticleRequest request) {
    return ResponseEntity.ok(ApiResponse.success(articleService.createArticle(user.getId(), request)));
  }

  /**
   * 更新文章
   *
   * <p>仅作者可更新自己的文章。</p>
   *
   * @param user 当前登录用户
   * @param id 文章ID
   * @param request 文章请求
   * @return 更新结果
   */
  @SecurityRequirement(name = "BearerAuth")
  @Operation(summary = "更新文章", description = "更新文章内容与状态，返回文章详情")
  @PutMapping(value = "/{id}", consumes = MediaType.APPLICATION_JSON_VALUE)
  public ResponseEntity<ApiResponse<ArticleResponse>> update(
      @AuthenticationPrincipal CustomUserDetails user,
      @PathVariable("id") Long id,
      @Valid @RequestBody ArticleRequest request) {
    return ResponseEntity.ok(ApiResponse.success(articleService.updateArticle(user.getId(), id, request)));
  }

  /**
   * 删除文章
   *
   * <p>仅作者可删除自己的文章，采用软删除。</p>
   *
   * @param user 当前登录用户
   * @param id 文章ID
   * @return 删除结果
   */
  @SecurityRequirement(name = "BearerAuth")
  @Operation(summary = "删除文章", description = "软删除文章")
  @DeleteMapping("/{id}")
  public ResponseEntity<ApiResponse<Void>> delete(@AuthenticationPrincipal CustomUserDetails user, @PathVariable("id") Long id) {
    articleService.deleteArticle(user.getId(), id);
    return ResponseEntity.ok(ApiResponse.success("删除成功"));
  }

  /**
   * 获取文章详情
   *
   * <p>公开文章可匿名访问；非公开文章仅作者可访问。</p>
   *
   * @param user 当前登录用户（可为空）
   * @param id 文章ID
   * @return 文章详情
   */
  @Operation(summary = "获取文章详情")
  @GetMapping("/{id}")
  public ResponseEntity<ApiResponse<ArticleResponse>> detail(
      @AuthenticationPrincipal CustomUserDetails user, @PathVariable("id") Long id) {
    Long viewerId = user == null ? null : user.getId();
    return ResponseEntity.ok(ApiResponse.success(articleService.getArticleDetail(viewerId, id)));
  }

  /**
   * 获取文章列表
   *
   * <p>默认仅返回公开已发布文章；若传 userId=当前用户ID，可查看自己的草稿等状态。</p>
   *
   * @param user 当前登录用户（可为空）
   * @param page 页码（从1开始）
   * @param size 每页大小
   * @param sortBy 排序字段：createdAt, publishedAt, viewCount, likeCount
   * @param order 排序方向：asc, desc
   * @param status 状态：DRAFT, PUBLISHED, PRIVATE
   * @param categoryId 分类ID
   * @param tagId 标签ID
   * @param userId 作者ID
   * @param keyword 关键词
   * @return 文章分页列表
   */
  @Operation(summary = "获取文章列表")
  @GetMapping
  public ResponseEntity<ApiResponse<PageResponse<ArticleListItem>>> list(
      @AuthenticationPrincipal CustomUserDetails user,
      @RequestParam(name = "page", defaultValue = "1") int page,
      @RequestParam(name = "size", defaultValue = "20") int size,
      @RequestParam(name = "sortBy", defaultValue = "createdAt") String sortBy,
      @RequestParam(name = "order", defaultValue = "desc") String order,
      @RequestParam(name = "status", required = false) String status,
      @RequestParam(name = "categoryId", required = false) Long categoryId,
      @RequestParam(name = "tagId", required = false) Long tagId,
      @RequestParam(name = "userId", required = false) Long userId,
      @RequestParam(name = "keyword", required = false) String keyword) {
    Long viewerId = user == null ? null : user.getId();
    return ResponseEntity.ok(
        ApiResponse.success(
            articleService.listArticles(viewerId, page, size, sortBy, order, status, categoryId, tagId, userId, keyword)));
  }

  /**
   * 获取草稿列表
   *
   * <p>仅返回当前用户草稿。</p>
   *
   * @param user 当前登录用户
   * @param page 页码（从1开始）
   * @param size 每页大小
   * @return 草稿分页列表
   */
  @SecurityRequirement(name = "BearerAuth")
  @Operation(summary = "获取草稿列表", description = "返回当前用户草稿分页列表")
  @GetMapping("/drafts")
  public ResponseEntity<ApiResponse<PageResponse<ArticleListItem>>> drafts(
      @AuthenticationPrincipal CustomUserDetails user,
      @RequestParam(name = "page", defaultValue = "1") int page,
      @RequestParam(name = "size", defaultValue = "20") int size) {
    return ResponseEntity.ok(ApiResponse.success(articleService.listDrafts(user.getId(), page, size)));
  }

  /**
   * 搜索文章
   *
   * @param user 当前登录用户（可为空）
   * @param keyword 关键词
   * @param page 页码（从1开始）
   * @param size 每页大小
   * @return 搜索结果
   */
  @Operation(summary = "搜索文章")
  @GetMapping("/search")
  public ResponseEntity<ApiResponse<PageResponse<ArticleListItem>>> search(
      @AuthenticationPrincipal CustomUserDetails user,
      @RequestParam(name = "keyword") String keyword,
      @RequestParam(name = "page", defaultValue = "1") int page,
      @RequestParam(name = "size", defaultValue = "20") int size) {
    Long viewerId = user == null ? null : user.getId();
    return ResponseEntity.ok(ApiResponse.success(articleService.search(viewerId, keyword, page, size)));
  }

  /**
   * 热门文章
   *
   * @param limit 返回数量
   * @return 热门文章列表
   */
  @Operation(summary = "热门文章")
  @GetMapping("/trending")
  public ResponseEntity<ApiResponse<List<ArticleListItem>>> trending(@RequestParam(name = "limit", defaultValue = "10") int limit) {
    return ResponseEntity.ok(ApiResponse.success(articleService.trending(limit)));
  }

  /**
   * 相关文章
   *
   * @param user 当前登录用户（可为空）
   * @param id 文章ID
   * @param limit 返回数量
   * @return 相关文章列表
   */
  @Operation(summary = "相关文章")
  @GetMapping("/{id}/related")
  public ResponseEntity<ApiResponse<List<ArticleListItem>>> related(
      @AuthenticationPrincipal CustomUserDetails user,
      @PathVariable("id") Long id,
      @RequestParam(name = "limit", defaultValue = "6") int limit) {
    Long viewerId = user == null ? null : user.getId();
    return ResponseEntity.ok(ApiResponse.success(articleService.related(viewerId, id, limit)));
  }

  /**
   * 点赞/取消点赞
   *
   * @param user 当前登录用户
   * @param id 文章ID
   * @return 文章详情（包含 liked 状态）
   */
  @SecurityRequirement(name = "BearerAuth")
  @Operation(summary = "点赞/取消点赞")
  @PostMapping("/{id}/like")
  public ResponseEntity<ApiResponse<ArticleResponse>> like(@AuthenticationPrincipal CustomUserDetails user, @PathVariable("id") Long id) {
    return ResponseEntity.ok(ApiResponse.success(articleService.toggleLike(user.getId(), id)));
  }

  /**
   * 收藏/取消收藏
   *
   * @param user 当前登录用户
   * @param id 文章ID
   * @return 文章详情（包含 collected 状态）
   */
  @SecurityRequirement(name = "BearerAuth")
  @Operation(summary = "收藏/取消收藏")
  @PostMapping("/{id}/collect")
  public ResponseEntity<ApiResponse<ArticleResponse>> collect(
      @AuthenticationPrincipal CustomUserDetails user, @PathVariable("id") Long id) {
    return ResponseEntity.ok(ApiResponse.success(articleService.toggleCollect(user.getId(), id)));
  }

  /**
   * 记录阅读
   *
   * <p>公开文章可匿名记录阅读（仅累计阅读数）；登录用户会同步阅读进度。</p>
   *
   * @param user 当前登录用户（可为空）
   * @param id 文章ID
   * @param request 阅读记录
   * @return 记录结果
   */
  @Operation(summary = "记录阅读")
  @PostMapping(value = "/{id}/view", consumes = MediaType.APPLICATION_JSON_VALUE)
  public ResponseEntity<ApiResponse<Void>> view(
      @AuthenticationPrincipal CustomUserDetails user,
      @PathVariable("id") Long id,
      @RequestBody(required = false) ArticleViewRequest request) {
    Long viewerId = user == null ? null : user.getId();
    articleService.recordView(viewerId, id, request);
    return ResponseEntity.ok(ApiResponse.success("OK"));
  }
}


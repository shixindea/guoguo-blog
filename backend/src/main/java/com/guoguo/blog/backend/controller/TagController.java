package com.guoguo.blog.backend.controller;

import com.guoguo.blog.backend.dto.ArticleListItem;
import com.guoguo.blog.backend.dto.PageResponse;
import com.guoguo.blog.backend.dto.TagDTO;
import com.guoguo.blog.backend.entity.Tag;
import com.guoguo.blog.backend.exception.BusinessException;
import com.guoguo.blog.backend.repository.TagRepository;
import com.guoguo.blog.backend.security.CustomUserDetails;
import com.guoguo.blog.backend.service.ArticleService;
import com.guoguo.blog.backend.web.ApiResponse;
import io.swagger.v3.oas.annotations.Operation;
import java.util.List;
import java.util.stream.Collectors;
import lombok.RequiredArgsConstructor;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

/**
 * 标签模块接口
 *
 * <p>提供标签查询、热门标签、标签下文章等接口。</p>
 */
@io.swagger.v3.oas.annotations.tags.Tag(name = "Tag", description = "标签相关接口")
@RestController
@RequestMapping(value = "/api/tags", produces = MediaType.APPLICATION_JSON_VALUE)
@RequiredArgsConstructor
@Validated
public class TagController {
  private final TagRepository tagRepository;
  private final ArticleService articleService;

  /**
   * 获取标签列表
   *
   * @return 标签列表
   */
  @Operation(summary = "获取标签列表")
  @GetMapping
  public ResponseEntity<ApiResponse<List<TagDTO>>> list() {
    List<TagDTO> list = tagRepository.findAll().stream().map(this::toTagDTO).collect(Collectors.toList());
    return ResponseEntity.ok(ApiResponse.success(list));
  }

  /**
   * 获取标签详情
   *
   * @param id 标签ID
   * @return 标签详情
   */
  @Operation(summary = "获取标签详情")
  @GetMapping("/{id}")
  public ResponseEntity<ApiResponse<TagDTO>> detail(@PathVariable("id") Long id) {
    Tag tag = tagRepository.findById(id).orElseThrow(() -> new BusinessException("TAG_NOT_FOUND", "标签不存在"));
    return ResponseEntity.ok(ApiResponse.success(toTagDTO(tag)));
  }

  /**
   * 获取标签下文章
   *
   * @param user 当前登录用户（可为空）
   * @param id 标签ID
   * @param page 页码
   * @param size 每页大小
   * @return 文章分页列表
   */
  @Operation(summary = "获取标签下文章")
  @GetMapping("/{id}/articles")
  public ResponseEntity<ApiResponse<PageResponse<ArticleListItem>>> articles(
      @AuthenticationPrincipal CustomUserDetails user,
      @PathVariable("id") Long id,
      @RequestParam(name = "page", defaultValue = "1") int page,
      @RequestParam(name = "size", defaultValue = "20") int size) {
    Long viewerId = user == null ? null : user.getId();
    return ResponseEntity.ok(
        ApiResponse.success(
            articleService.listArticles(viewerId, page, size, "publishedAt", "desc", "PUBLISHED", null, id, null, null)));
  }

  /**
   * 热门标签
   *
   * @return 热门标签列表
   */
  @Operation(summary = "热门标签")
  @GetMapping("/popular")
  public ResponseEntity<ApiResponse<List<TagDTO>>> popular() {
    List<TagDTO> list = tagRepository.findPopularTop50().stream().limit(20).map(this::toTagDTO).collect(Collectors.toList());
    return ResponseEntity.ok(ApiResponse.success(list));
  }

  private TagDTO toTagDTO(Tag tag) {
    return TagDTO.builder()
        .id(tag.getId())
        .name(tag.getName())
        .slug(tag.getSlug())
        .description(tag.getDescription())
        .icon(tag.getIcon())
        .color(tag.getColor())
        .articleCount(tag.getArticleCount())
        .recommended(tag.getRecommended())
        .createdAt(tag.getCreatedAt())
        .build();
  }
}

package com.guoguo.blog.backend.controller;

import com.guoguo.blog.backend.dto.ArticleListItem;
import com.guoguo.blog.backend.dto.CategoryDTO;
import com.guoguo.blog.backend.dto.PageResponse;
import com.guoguo.blog.backend.entity.Category;
import com.guoguo.blog.backend.exception.BusinessException;
import com.guoguo.blog.backend.security.CustomUserDetails;
import com.guoguo.blog.backend.service.ArticleService;
import com.guoguo.blog.backend.repository.CategoryRepository;
import com.guoguo.blog.backend.web.ApiResponse;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
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
 * 分类模块接口
 *
 * <p>提供分类查询与分类下文章列表等接口。</p>
 */
@Tag(name = "Category", description = "分类相关接口")
@RestController
@RequestMapping(value = "/api/categories", produces = MediaType.APPLICATION_JSON_VALUE)
@RequiredArgsConstructor
@Validated
public class CategoryController {
  private final CategoryRepository categoryRepository;
  private final ArticleService articleService;

  /**
   * 获取分类列表
   *
   * @return 分类列表
   */
  @Operation(summary = "获取分类列表")
  @GetMapping
  public ResponseEntity<ApiResponse<List<CategoryDTO>>> list() {
    List<CategoryDTO> list =
        categoryRepository.findAll().stream().map(this::toCategoryDTO).collect(Collectors.toList());
    return ResponseEntity.ok(ApiResponse.success(list));
  }

  /**
   * 获取分类详情
   *
   * @param id 分类ID
   * @return 分类详情
   */
  @Operation(summary = "获取分类详情")
  @GetMapping("/{id}")
  public ResponseEntity<ApiResponse<CategoryDTO>> detail(@PathVariable("id") Long id) {
    Category category = categoryRepository.findById(id).orElseThrow(() -> new BusinessException("CATEGORY_NOT_FOUND", "分类不存在"));
    return ResponseEntity.ok(ApiResponse.success(toCategoryDTO(category)));
  }

  /**
   * 获取分类下文章
   *
   * @param user 当前登录用户（可为空）
   * @param id 分类ID
   * @param page 页码
   * @param size 每页大小
   * @return 文章列表
   */
  @Operation(summary = "获取分类下文章")
  @GetMapping("/{id}/articles")
  public ResponseEntity<ApiResponse<PageResponse<ArticleListItem>>> articles(
      @AuthenticationPrincipal CustomUserDetails user,
      @PathVariable("id") Long id,
      @RequestParam(name = "page", defaultValue = "1") int page,
      @RequestParam(name = "size", defaultValue = "20") int size) {
    Long viewerId = user == null ? null : user.getId();
    return ResponseEntity.ok(
        ApiResponse.success(
            articleService.listArticles(viewerId, page, size, "publishedAt", "desc", "PUBLISHED", id, null, null, null)));
  }

  private CategoryDTO toCategoryDTO(Category category) {
    return CategoryDTO.builder()
        .id(category.getId())
        .name(category.getName())
        .slug(category.getSlug())
        .description(category.getDescription())
        .icon(category.getIcon())
        .sortOrder(category.getSortOrder())
        .parentId(category.getParent() == null ? null : category.getParent().getId())
        .articleCount(category.getArticleCount())
        .createdAt(category.getCreatedAt())
        .build();
  }
}

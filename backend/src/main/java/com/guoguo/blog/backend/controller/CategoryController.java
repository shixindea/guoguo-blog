package com.guoguo.blog.backend.controller;

import com.guoguo.blog.backend.dto.ArticleListItem;
import com.guoguo.blog.backend.dto.CategoryDTO;
import com.guoguo.blog.backend.dto.CategoryTreeDTO;
import com.guoguo.blog.backend.dto.CreateCategoryRequest;
import com.guoguo.blog.backend.dto.UpdateCategoryRequest;
import com.guoguo.blog.backend.dto.BatchUpdateStatusRequest;
import com.guoguo.blog.backend.dto.PageResponse;
import com.guoguo.blog.backend.entity.Category;
import com.guoguo.blog.backend.exception.BusinessException;
import com.guoguo.blog.backend.security.CustomUserDetails;
import com.guoguo.blog.backend.service.ArticleService;
import com.guoguo.blog.backend.repository.CategoryRepository;
import com.guoguo.blog.backend.repository.UserRepository;
import com.guoguo.blog.backend.entity.User;
import com.guoguo.blog.backend.web.ApiResponse;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import java.util.List;
import java.util.Map;
import java.util.ArrayList;
import java.util.Objects;
import java.util.stream.Collectors;
import lombok.RequiredArgsConstructor;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.RequestBody;
import jakarta.validation.Valid;

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
  private final UserRepository userRepository;
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
   * 获取分类分页列表（支持筛选/排序）
   *
   * @param page 页码（从1开始）
   * @param size 每页大小
   * @param keyword 关键词（匹配name/slug）
   * @param parentId 父分类ID
   * @param enabled 是否启用
   * @param system 是否系统分类
   * @return 分类分页列表
   */
  @Operation(summary = "获取分类分页列表")
  @GetMapping("/page")
  public ResponseEntity<ApiResponse<PageResponse<CategoryDTO>>> page(
      @RequestParam(name = "page", defaultValue = "1") int page,
      @RequestParam(name = "size", defaultValue = "20") int size,
      @RequestParam(name = "keyword", required = false) String keyword,
      @RequestParam(name = "parentId", required = false) Long parentId,
      @RequestParam(name = "enabled", required = false) Boolean enabled,
      @RequestParam(name = "system", required = false) Boolean system) {
    Pageable pageable =
        PageRequest.of(
            Math.max(page - 1, 0),
            Math.max(size, 1),
            Sort.by(Sort.Direction.ASC, "sortOrder").and(Sort.by(Sort.Direction.DESC, "id")));

    Page<Category> categoryPage =
        categoryRepository.findAll(
            (root, query, cb) -> {
              var predicates = new ArrayList<jakarta.persistence.criteria.Predicate>();
              if (keyword != null && !keyword.trim().isEmpty()) {
                String like = "%" + keyword.trim() + "%";
                predicates.add(cb.or(cb.like(root.get("name"), like), cb.like(root.get("slug"), like)));
              }
              if (parentId != null) {
                predicates.add(cb.equal(root.get("parent").get("id"), parentId));
              }
              if (enabled != null) {
                predicates.add(cb.equal(root.get("enabled"), enabled));
              }
              if (system != null) {
                predicates.add(cb.equal(root.get("system"), system));
              }
              return cb.and(predicates.toArray(new jakarta.persistence.criteria.Predicate[0]));
            },
            pageable);

    List<CategoryDTO> list =
        categoryPage.getContent().stream().map(this::toCategoryDTO).collect(Collectors.toList());
    return ResponseEntity.ok(
        ApiResponse.success(
            PageResponse.<CategoryDTO>builder()
                .page(page)
                .size(size)
                .total(categoryPage.getTotalElements())
                .list(list)
                .build()));
  }

  /**
   * 获取分类树
   *
   * @param enabled 是否仅返回启用分类（可为空）
   * @return 分类树
   */
  @Operation(summary = "获取分类树")
  @GetMapping("/tree")
  public ResponseEntity<ApiResponse<List<CategoryTreeDTO>>> tree(
      @RequestParam(name = "enabled", required = false) Boolean enabled) {
    List<Category> all =
        enabled == null
            ? categoryRepository.findAll(Sort.by(Sort.Direction.ASC, "sortOrder").and(Sort.by(Sort.Direction.DESC, "id")))
            : categoryRepository.findAll(
                (root, query, cb) -> cb.equal(root.get("enabled"), enabled),
                Sort.by(Sort.Direction.ASC, "sortOrder").and(Sort.by(Sort.Direction.DESC, "id")));

    Map<Long, List<Category>> childrenMap =
        all.stream()
            .collect(
                Collectors.groupingBy(
                    c -> c.getParent() == null ? 0L : c.getParent().getId(), Collectors.toList()));

    List<Category> roots = childrenMap.getOrDefault(0L, List.of());
    List<CategoryTreeDTO> tree =
        roots.stream().map(r -> toTreeDTO(r, childrenMap)).collect(Collectors.toList());
    return ResponseEntity.ok(ApiResponse.success(tree));
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
      @RequestParam(name = "size", defaultValue = "20") int size,
      @RequestParam(name = "sortBy", defaultValue = "publishedAt") String sortBy,
      @RequestParam(name = "order", defaultValue = "desc") String order) {
    Long viewerId = user == null ? null : user.getId();
    return ResponseEntity.ok(
        ApiResponse.success(
            articleService.listArticles(viewerId, page, size, sortBy, order, "PUBLISHED", id, null, null, null)));
  }

  /**
   * 创建分类
   *
   * @param user 当前登录用户
   * @param request 创建请求
   * @return 分类信息
   */
  @Operation(summary = "创建分类")
  @PostMapping(consumes = MediaType.APPLICATION_JSON_VALUE)
  @PreAuthorize("isAuthenticated()")
  public ResponseEntity<ApiResponse<CategoryDTO>> create(
      @AuthenticationPrincipal CustomUserDetails user, @Valid @RequestBody CreateCategoryRequest request) {
    if (categoryRepository.findBySlug(request.getSlug()).isPresent()) {
      throw new BusinessException("CATEGORY_SLUG_EXISTS", "分类标识已存在");
    }
    Category parent = null;
    if (request.getParentId() != null) {
      parent =
          categoryRepository
              .findById(request.getParentId())
              .orElseThrow(() -> new BusinessException("CATEGORY_PARENT_NOT_FOUND", "父分类不存在"));
    }
    User creator =
        userRepository.findById(user.getId()).orElseThrow(() -> new BusinessException("USER_NOT_FOUND", "用户不存在"));

    Category category =
        Category.builder()
            .name(request.getName())
            .slug(request.getSlug())
            .description(request.getDescription())
            .icon(request.getIcon())
            .color(request.getColor())
            .sortOrder(request.getSortOrder() == null ? 0 : request.getSortOrder())
            .parent(parent)
            .level(parent == null ? 1 : Math.max(parent.getLevel() == null ? 1 : parent.getLevel(), 1) + 1)
            .enabled(request.getEnabled() == null ? true : request.getEnabled())
            .system(Boolean.TRUE.equals(request.getSystem()))
            .createdBy(creator)
            .build();
    category = categoryRepository.save(category);
    return ResponseEntity.ok(ApiResponse.success("分类创建成功", toCategoryDTO(category)));
  }

  /**
   * 更新分类
   *
   * @param user 当前登录用户
   * @param id 分类ID
   * @param request 更新请求
   * @return 分类信息
   */
  @Operation(summary = "更新分类")
  @PutMapping(value = "/{id}", consumes = MediaType.APPLICATION_JSON_VALUE)
  @PreAuthorize("isAuthenticated()")
  public ResponseEntity<ApiResponse<CategoryDTO>> update(
      @AuthenticationPrincipal CustomUserDetails user,
      @PathVariable("id") Long id,
      @Valid @RequestBody UpdateCategoryRequest request) {
    Category category =
        categoryRepository.findById(id).orElseThrow(() -> new BusinessException("CATEGORY_NOT_FOUND", "分类不存在"));
    if (request.getSlug() != null && !request.getSlug().trim().isEmpty()) {
      Category existing = categoryRepository.findBySlug(request.getSlug()).orElse(null);
      if (existing != null && !Objects.equals(existing.getId(), id)) {
        throw new BusinessException("CATEGORY_SLUG_EXISTS", "分类标识已存在");
      }
      category.setSlug(request.getSlug());
    }
    if (request.getName() != null) category.setName(request.getName());
    if (request.getDescription() != null) category.setDescription(request.getDescription());
    if (request.getIcon() != null) category.setIcon(request.getIcon());
    if (request.getColor() != null) category.setColor(request.getColor());
    if (request.getSortOrder() != null) category.setSortOrder(request.getSortOrder());
    if (request.getSystem() != null) category.setSystem(request.getSystem());
    if (request.getEnabled() != null) category.setEnabled(request.getEnabled());
    if (request.getParentId() != null) {
      Category parent =
          categoryRepository
              .findById(request.getParentId())
              .orElseThrow(() -> new BusinessException("CATEGORY_PARENT_NOT_FOUND", "父分类不存在"));
      category.setParent(parent);
      category.setLevel(Math.max(parent.getLevel() == null ? 1 : parent.getLevel(), 1) + 1);
    }
    categoryRepository.save(category);
    return ResponseEntity.ok(ApiResponse.success("分类更新成功", toCategoryDTO(category)));
  }

  /**
   * 删除分类
   *
   * @param id 分类ID
   * @return void
   */
  @Operation(summary = "删除分类")
  @DeleteMapping("/{id}")
  @PreAuthorize("hasAuthority('ROLE_ADMIN')")
  public ResponseEntity<ApiResponse<Void>> delete(@PathVariable("id") Long id) {
    Category category =
        categoryRepository.findById(id).orElseThrow(() -> new BusinessException("CATEGORY_NOT_FOUND", "分类不存在"));
    categoryRepository.delete(category);
    return ResponseEntity.ok(ApiResponse.success("分类删除成功"));
  }

  /**
   * 批量更新分类启用状态
   *
   * @param request 请求
   * @return void
   */
  @Operation(summary = "批量更新分类状态")
  @PatchMapping(value = "/batch-status", consumes = MediaType.APPLICATION_JSON_VALUE)
  @PreAuthorize("hasAuthority('ROLE_ADMIN')")
  public ResponseEntity<ApiResponse<Void>> batchUpdateStatus(@Valid @RequestBody BatchUpdateStatusRequest request) {
    List<Category> list = categoryRepository.findAllById(request.getIds());
    for (Category c : list) {
      c.setEnabled(request.getEnabled());
    }
    categoryRepository.saveAll(list);
    return ResponseEntity.ok(ApiResponse.success("状态更新成功"));
  }

  private CategoryDTO toCategoryDTO(Category category) {
    return CategoryDTO.builder()
        .id(category.getId())
        .name(category.getName())
        .slug(category.getSlug())
        .description(category.getDescription())
        .icon(category.getIcon())
        .color(category.getColor())
        .sortOrder(category.getSortOrder())
        .parentId(category.getParent() == null ? null : category.getParent().getId())
        .level(category.getLevel())
        .articleCount(category.getArticleCount())
        .system(category.getSystem())
        .enabled(category.getEnabled())
        .createdAt(category.getCreatedAt())
        .build();
  }

  private CategoryTreeDTO toTreeDTO(Category category, Map<Long, List<Category>> childrenMap) {
    List<Category> children = childrenMap.getOrDefault(category.getId(), List.of());
    return CategoryTreeDTO.builder()
        .id(category.getId())
        .name(category.getName())
        .slug(category.getSlug())
        .icon(category.getIcon())
        .color(category.getColor())
        .sortOrder(category.getSortOrder())
        .articleCount(category.getArticleCount())
        .enabled(category.getEnabled())
        .children(children.stream().map(c -> toTreeDTO(c, childrenMap)).collect(Collectors.toList()))
        .build();
  }
}

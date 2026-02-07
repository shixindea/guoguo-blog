package com.guoguo.blog.backend.controller;

import com.guoguo.blog.backend.dto.ArticleListItem;
import com.guoguo.blog.backend.dto.CreateTagRequest;
import com.guoguo.blog.backend.dto.PageResponse;
import com.guoguo.blog.backend.dto.TagDTO;
import com.guoguo.blog.backend.dto.UpdateTagRequest;
import com.guoguo.blog.backend.entity.Tag;
import com.guoguo.blog.backend.entity.TagFollow;
import com.guoguo.blog.backend.entity.User;
import com.guoguo.blog.backend.exception.BusinessException;
import com.guoguo.blog.backend.repository.TagRepository;
import com.guoguo.blog.backend.repository.TagFollowRepository;
import com.guoguo.blog.backend.repository.UserRepository;
import com.guoguo.blog.backend.security.CustomUserDetails;
import com.guoguo.blog.backend.service.ArticleService;
import com.guoguo.blog.backend.web.ApiResponse;
import io.swagger.v3.oas.annotations.Operation;
import java.util.List;
import java.util.Objects;
import java.util.Set;
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
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.RequestBody;
import jakarta.validation.Valid;

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
  private final TagFollowRepository tagFollowRepository;
  private final UserRepository userRepository;
  private final ArticleService articleService;

  /**
   * 获取标签列表
   *
   * @return 标签列表
   */
  @Operation(summary = "获取标签列表")
  @GetMapping
  public ResponseEntity<ApiResponse<List<TagDTO>>> list(@AuthenticationPrincipal CustomUserDetails user) {
    Long viewerId = user == null ? null : user.getId();
    Set<Long> followingIds =
        viewerId == null ? Set.of() : Set.copyOf(tagFollowRepository.findTagIdsByUserId(viewerId));
    List<TagDTO> list =
        tagRepository.findAll().stream()
            .map(t -> toTagDTO(t, followingIds.contains(t.getId())))
            .collect(Collectors.toList());
    return ResponseEntity.ok(ApiResponse.success(list));
  }

  /**
   * 获取标签分页列表（支持筛选/排序）
   *
   * @param user 当前登录用户（可为空）
   * @param page 页码（从1开始）
   * @param size 每页大小
   * @param keyword 关键词（匹配name/slug）
   * @param recommended 是否推荐
   * @param hot 是否热门
   * @param enabled 是否启用
   * @param sortBy 排序字段（articleCount/viewCount/createdAt）
   * @param order 排序方向（asc/desc）
   * @return 标签分页列表
   */
  @Operation(summary = "获取标签分页列表")
  @GetMapping("/page")
  public ResponseEntity<ApiResponse<PageResponse<TagDTO>>> page(
      @AuthenticationPrincipal CustomUserDetails user,
      @RequestParam(name = "page", defaultValue = "1") int page,
      @RequestParam(name = "size", defaultValue = "20") int size,
      @RequestParam(name = "keyword", required = false) String keyword,
      @RequestParam(name = "recommended", required = false) Boolean recommended,
      @RequestParam(name = "hot", required = false) Boolean hot,
      @RequestParam(name = "enabled", required = false) Boolean enabled,
      @RequestParam(name = "sortBy", defaultValue = "articleCount") String sortBy,
      @RequestParam(name = "order", defaultValue = "desc") String order) {
    Long viewerId = user == null ? null : user.getId();
    Set<Long> followingIds =
        viewerId == null ? Set.of() : Set.copyOf(tagFollowRepository.findTagIdsByUserId(viewerId));

    String sortField =
        switch (sortBy == null ? "" : sortBy.trim()) {
          case "viewCount", "view_count" -> "viewCount";
          case "createdAt", "created_at" -> "createdAt";
          default -> "articleCount";
        };
    Sort.Direction direction = "asc".equalsIgnoreCase(order) ? Sort.Direction.ASC : Sort.Direction.DESC;
    Pageable pageable = PageRequest.of(Math.max(page - 1, 0), Math.max(size, 1), Sort.by(direction, sortField));

    Page<Tag> tagPage =
        tagRepository.findAll(
            (root, query, cb) -> {
              var predicates = new java.util.ArrayList<jakarta.persistence.criteria.Predicate>();
              if (keyword != null && !keyword.trim().isEmpty()) {
                String like = "%" + keyword.trim() + "%";
                predicates.add(cb.or(cb.like(root.get("name"), like), cb.like(root.get("slug"), like)));
              }
              if (recommended != null) {
                predicates.add(cb.equal(root.get("recommended"), recommended));
              }
              if (hot != null) {
                predicates.add(cb.equal(root.get("hot"), hot));
              }
              if (enabled != null) {
                predicates.add(cb.equal(root.get("enabled"), enabled));
              }
              return cb.and(predicates.toArray(new jakarta.persistence.criteria.Predicate[0]));
            },
            pageable);

    List<TagDTO> list =
        tagPage.getContent().stream()
            .map(t -> toTagDTO(t, followingIds.contains(t.getId())))
            .collect(Collectors.toList());

    return ResponseEntity.ok(
        ApiResponse.success(
            PageResponse.<TagDTO>builder()
                .page(page)
                .size(size)
                .total(tagPage.getTotalElements())
                .list(list)
                .build()));
  }

  /**
   * 获取标签详情
   *
   * @param id 标签ID
   * @return 标签详情
   */
  @Operation(summary = "获取标签详情")
  @GetMapping("/{id}")
  public ResponseEntity<ApiResponse<TagDTO>> detail(
      @AuthenticationPrincipal CustomUserDetails user, @PathVariable("id") Long id) {
    Tag tag = tagRepository.findById(id).orElseThrow(() -> new BusinessException("TAG_NOT_FOUND", "标签不存在"));
    boolean following =
        user != null && tagFollowRepository.findByUser_IdAndTag_Id(user.getId(), id).isPresent();
    return ResponseEntity.ok(ApiResponse.success(toTagDTO(tag, following)));
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
      @RequestParam(name = "size", defaultValue = "20") int size,
      @RequestParam(name = "sortBy", defaultValue = "publishedAt") String sortBy,
      @RequestParam(name = "order", defaultValue = "desc") String order) {
    Long viewerId = user == null ? null : user.getId();
    return ResponseEntity.ok(
        ApiResponse.success(
            articleService.listArticles(viewerId, page, size, sortBy, order, "PUBLISHED", null, id, null, null)));
  }

  /**
   * 热门标签
   *
   * @return 热门标签列表
   */
  @Operation(summary = "热门标签")
  @GetMapping("/popular")
  public ResponseEntity<ApiResponse<List<TagDTO>>> popular(
      @AuthenticationPrincipal CustomUserDetails user,
      @RequestParam(name = "limit", defaultValue = "10") int limit,
      @RequestParam(name = "period", required = false) String period) {
    Long viewerId = user == null ? null : user.getId();
    Set<Long> followingIds =
        viewerId == null ? Set.of() : Set.copyOf(tagFollowRepository.findTagIdsByUserId(viewerId));
    List<TagDTO> list =
        tagRepository.findPopularTop50().stream()
            .filter(t -> t.getEnabled() == null || Boolean.TRUE.equals(t.getEnabled()))
            .limit(Math.max(limit, 1))
            .map(t -> toTagDTO(t, followingIds.contains(t.getId())))
            .collect(Collectors.toList());
    return ResponseEntity.ok(ApiResponse.success(list));
  }

  /**
   * 推荐标签
   *
   * @param user 当前登录用户（可为空）
   * @param limit 数量
   * @return 推荐标签列表
   */
  @Operation(summary = "推荐标签")
  @GetMapping("/recommended")
  public ResponseEntity<ApiResponse<List<TagDTO>>> recommended(
      @AuthenticationPrincipal CustomUserDetails user, @RequestParam(name = "limit", defaultValue = "10") int limit) {
    Long viewerId = user == null ? null : user.getId();
    Set<Long> followingIds =
        viewerId == null ? Set.of() : Set.copyOf(tagFollowRepository.findTagIdsByUserId(viewerId));
    List<TagDTO> list =
        tagRepository.findRecommendedTop50().stream()
            .limit(Math.max(limit, 1))
            .map(t -> toTagDTO(t, followingIds.contains(t.getId())))
            .collect(Collectors.toList());
    return ResponseEntity.ok(ApiResponse.success(list));
  }

  /**
   * 标签搜索（自动补全）
   *
   * @param user 当前登录用户（可为空）
   * @param keyword 关键词
   * @param limit 数量
   * @return 标签列表
   */
  @Operation(summary = "标签搜索")
  @GetMapping("/search")
  public ResponseEntity<ApiResponse<List<TagDTO>>> search(
      @AuthenticationPrincipal CustomUserDetails user,
      @RequestParam(name = "keyword") String keyword,
      @RequestParam(name = "limit", defaultValue = "10") int limit) {
    Long viewerId = user == null ? null : user.getId();
    Set<Long> followingIds =
        viewerId == null ? Set.of() : Set.copyOf(tagFollowRepository.findTagIdsByUserId(viewerId));

    List<TagDTO> list =
        tagRepository.findAll(
                (root, query, cb) -> {
                  String like = "%" + keyword.trim() + "%";
                  return cb.and(
                      cb.or(cb.like(root.get("name"), like), cb.like(root.get("slug"), like)),
                      cb.or(cb.isNull(root.get("enabled")), cb.isTrue(root.get("enabled"))));
                },
                PageRequest.of(0, Math.max(limit, 1), Sort.by(Sort.Direction.DESC, "articleCount")))
            .getContent()
            .stream()
            .map(t -> toTagDTO(t, followingIds.contains(t.getId())))
            .collect(Collectors.toList());
    return ResponseEntity.ok(ApiResponse.success(list));
  }

  /**
   * 关注/取消关注标签
   *
   * @param user 当前登录用户
   * @param id 标签ID
   * @return 是否关注
   */
  @Operation(summary = "关注/取消关注标签")
  @PostMapping("/{id}/follow")
  @PreAuthorize("isAuthenticated()")
  public ResponseEntity<ApiResponse<Boolean>> follow(
      @AuthenticationPrincipal CustomUserDetails user, @PathVariable("id") Long id) {
    Tag tag = tagRepository.findById(id).orElseThrow(() -> new BusinessException("TAG_NOT_FOUND", "标签不存在"));
    TagFollow existing = tagFollowRepository.findByUser_IdAndTag_Id(user.getId(), id).orElse(null);
    if (existing != null) {
      tagFollowRepository.delete(existing);
      return ResponseEntity.ok(ApiResponse.success("已取消关注", false));
    }
    User u = userRepository.findById(user.getId()).orElseThrow(() -> new BusinessException("USER_NOT_FOUND", "用户不存在"));
    tagFollowRepository.save(TagFollow.builder().user(u).tag(tag).build());
    return ResponseEntity.ok(ApiResponse.success("关注成功", true));
  }

  /**
   * 创建标签
   *
   * @param user 当前登录用户
   * @param request 创建请求
   * @return 标签信息
   */
  @Operation(summary = "创建标签")
  @PostMapping(consumes = MediaType.APPLICATION_JSON_VALUE)
  @PreAuthorize("isAuthenticated()")
  public ResponseEntity<ApiResponse<TagDTO>> create(
      @AuthenticationPrincipal CustomUserDetails user, @Valid @RequestBody CreateTagRequest request) {
    if (tagRepository.findBySlug(request.getSlug()).isPresent()) {
      throw new BusinessException("TAG_SLUG_EXISTS", "标签标识已存在");
    }
    Tag tag =
        Tag.builder()
            .name(request.getName())
            .slug(request.getSlug())
            .description(request.getDescription())
            .icon(request.getIcon())
            .color(request.getColor())
            .style(request.getStyle())
            .recommended(Boolean.TRUE.equals(request.getRecommended()))
            .hot(Boolean.TRUE.equals(request.getHot()))
            .enabled(request.getEnabled() == null ? true : request.getEnabled())
            .system(false)
            .build();
    tag = tagRepository.save(tag);
    return ResponseEntity.ok(ApiResponse.success("标签创建成功", toTagDTO(tag, false)));
  }

  /**
   * 更新标签
   *
   * @param user 当前登录用户
   * @param id 标签ID
   * @param request 更新请求
   * @return 标签信息
   */
  @Operation(summary = "更新标签")
  @PutMapping(value = "/{id}", consumes = MediaType.APPLICATION_JSON_VALUE)
  @PreAuthorize("isAuthenticated()")
  public ResponseEntity<ApiResponse<TagDTO>> update(
      @AuthenticationPrincipal CustomUserDetails user, @PathVariable("id") Long id, @Valid @RequestBody UpdateTagRequest request) {
    Tag tag = tagRepository.findById(id).orElseThrow(() -> new BusinessException("TAG_NOT_FOUND", "标签不存在"));
    if (request.getSlug() != null && !request.getSlug().trim().isEmpty()) {
      Tag existing = tagRepository.findBySlug(request.getSlug()).orElse(null);
      if (existing != null && !Objects.equals(existing.getId(), id)) {
        throw new BusinessException("TAG_SLUG_EXISTS", "标签标识已存在");
      }
      tag.setSlug(request.getSlug());
    }
    if (request.getName() != null) tag.setName(request.getName());
    if (request.getDescription() != null) tag.setDescription(request.getDescription());
    if (request.getIcon() != null) tag.setIcon(request.getIcon());
    if (request.getColor() != null) tag.setColor(request.getColor());
    if (request.getStyle() != null) tag.setStyle(request.getStyle());
    if (request.getRecommended() != null) tag.setRecommended(request.getRecommended());
    if (request.getHot() != null) tag.setHot(request.getHot());
    if (request.getEnabled() != null) tag.setEnabled(request.getEnabled());
    tagRepository.save(tag);
    boolean following = tagFollowRepository.findByUser_IdAndTag_Id(user.getId(), id).isPresent();
    return ResponseEntity.ok(ApiResponse.success("标签更新成功", toTagDTO(tag, following)));
  }

  /**
   * 删除标签
   *
   * @param id 标签ID
   * @return void
   */
  @Operation(summary = "删除标签")
  @DeleteMapping("/{id}")
  @PreAuthorize("hasAuthority('ROLE_ADMIN')")
  public ResponseEntity<ApiResponse<Void>> delete(@PathVariable("id") Long id) {
    Tag tag = tagRepository.findById(id).orElseThrow(() -> new BusinessException("TAG_NOT_FOUND", "标签不存在"));
    tagRepository.delete(tag);
    return ResponseEntity.ok(ApiResponse.success("标签删除成功"));
  }

  private TagDTO toTagDTO(Tag tag, boolean following) {
    return TagDTO.builder()
        .id(tag.getId())
        .name(tag.getName())
        .slug(tag.getSlug())
        .description(tag.getDescription())
        .icon(tag.getIcon())
        .color(tag.getColor())
        .articleCount(tag.getArticleCount())
        .viewCount(tag.getViewCount())
        .recommended(tag.getRecommended())
        .hot(tag.getHot())
        .system(tag.getSystem())
        .enabled(tag.getEnabled())
        .following(following)
        .style(tag.getStyle())
        .createdAt(tag.getCreatedAt())
        .build();
  }
}

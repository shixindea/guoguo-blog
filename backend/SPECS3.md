# 标签和分类管理功能

## 一、需要新增的数据库表

由于目前还没有标签和分类的管理功能，需要新增以下表：

```sql
-- 1. 分类表（categories）
CREATE TABLE categories (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(50) NOT NULL COMMENT '分类名称',
    slug VARCHAR(50) NOT NULL UNIQUE COMMENT '分类slug（URL标识）',
    description VARCHAR(500) COMMENT '分类描述',
    icon VARCHAR(100) COMMENT '分类图标',
    color VARCHAR(20) COMMENT '分类颜色',
    sort_order INT DEFAULT 0 COMMENT '排序',
    parent_id BIGINT COMMENT '父分类ID',
    level INT DEFAULT 1 COMMENT '层级（1:一级分类，2:二级分类）',
    article_count INT DEFAULT 0 COMMENT '文章数',
    is_system BOOLEAN DEFAULT FALSE COMMENT '是否为系统分类',
    is_enabled BOOLEAN DEFAULT TRUE COMMENT '是否启用',
    created_by BIGINT COMMENT '创建者ID',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    INDEX idx_parent_id (parent_id),
    INDEX idx_sort_order (sort_order),
    INDEX idx_level (level),
    INDEX idx_is_enabled (is_enabled),
    INDEX idx_slug (slug),
    FOREIGN KEY (parent_id) REFERENCES categories(id) ON DELETE CASCADE,
    FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='分类表';

-- 2. 标签表（tags）
CREATE TABLE tags (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(50) NOT NULL COMMENT '标签名称',
    slug VARCHAR(50) NOT NULL UNIQUE COMMENT '标签slug（URL标识）',
    description VARCHAR(500) COMMENT '标签描述',
    icon VARCHAR(100) COMMENT '标签图标',
    color VARCHAR(20) COMMENT '标签颜色',
    style VARCHAR(20) DEFAULT 'default' COMMENT '标签样式',
    article_count INT DEFAULT 0 COMMENT '使用次数',
    view_count INT DEFAULT 0 COMMENT '浏览数',
    is_recommended BOOLEAN DEFAULT FALSE COMMENT '是否推荐',
    is_hot BOOLEAN DEFAULT FALSE COMMENT '是否热门',
    is_system BOOLEAN DEFAULT FALSE COMMENT '是否为系统标签',
    is_enabled BOOLEAN DEFAULT TRUE COMMENT '是否启用',
    created_by BIGINT COMMENT '创建者ID',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    INDEX idx_article_count (article_count),
    INDEX idx_is_recommended (is_recommended),
    INDEX idx_is_hot (is_hot),
    INDEX idx_is_enabled (is_enabled),
    INDEX idx_slug (slug),
    FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='标签表';

-- 3. 文章-标签关联表（article_tags）
CREATE TABLE article_tags (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    article_id BIGINT NOT NULL,
    tag_id BIGINT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    
    UNIQUE KEY uk_article_tag (article_id, tag_id),
    INDEX idx_tag_id (tag_id),
    FOREIGN KEY (article_id) REFERENCES articles(id) ON DELETE CASCADE,
    FOREIGN KEY (tag_id) REFERENCES tags(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='文章-标签关联表';

-- 4. 用户关注的标签表（user_follow_tags）
CREATE TABLE user_follow_tags (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    user_id BIGINT NOT NULL,
    tag_id BIGINT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    
    UNIQUE KEY uk_user_tag (user_id, tag_id),
    INDEX idx_tag_id (tag_id),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (tag_id) REFERENCES tags(id) ON DELETE CASCADE
) COMMENT='用户关注的标签表';
```

## 二、需要修改的现有表

需要在 `articles` 表中添加 `category_id` 字段（如果还没有的话）：

```sql
-- 检查 articles 表是否有 category_id 字段
-- 如果没有，则添加
ALTER TABLE articles 
ADD COLUMN category_id BIGINT COMMENT '分类ID',
ADD INDEX idx_category_id (category_id),
ADD CONSTRAINT fk_articles_category_id 
FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE SET NULL;

-- 添加创建者字段（如果还没有）
ALTER TABLE categories
ADD COLUMN created_by BIGINT COMMENT '创建者ID',
ADD INDEX idx_created_by (created_by),
ADD CONSTRAINT fk_categories_created_by 
FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE SET NULL;

ALTER TABLE tags
ADD COLUMN created_by BIGINT COMMENT '创建者ID',
ADD INDEX idx_created_by (created_by),
ADD CONSTRAINT fk_tags_created_by 
FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE SET NULL;
```

## 三、后端接口设计

### 1. 分类管理接口

```java
// CategoryController.java
@RestController
@RequestMapping("/api/categories")
@RequiredArgsConstructor
@Validated
public class CategoryController {
    
    private final CategoryService categoryService;
    
    // 获取分类树
    @GetMapping("/tree")
    @Operation(summary = "获取分类树")
    public ResponseEntity<ApiResponse<List<CategoryTreeDTO>>> getCategoryTree(
            @RequestParam(required = false) Boolean enabled
    ) {
        List<CategoryTreeDTO> tree = categoryService.getCategoryTree(enabled);
        return ResponseEntity.ok(ApiResponse.success(tree));
    }
    
    // 获取分类列表
    @GetMapping
    @Operation(summary = "获取分类列表")
    public ResponseEntity<ApiResponse<PageResponse<CategoryDTO>>> getCategories(
            @RequestParam(defaultValue = "1") Integer page,
            @RequestParam(defaultValue = "20") Integer size,
            @RequestParam(required = false) String keyword,
            @RequestParam(required = false) Long parentId,
            @RequestParam(required = false) Boolean enabled,
            @RequestParam(required = false) Boolean system
    ) {
        CategoryQuery query = CategoryQuery.builder()
                .page(page)
                .size(size)
                .keyword(keyword)
                .parentId(parentId)
                .enabled(enabled)
                .system(system)
                .build();
        PageResponse<CategoryDTO> result = categoryService.getCategories(query);
        return ResponseEntity.ok(ApiResponse.success(result));
    }
    
    // 获取分类详情
    @GetMapping("/{id}")
    @Operation(summary = "获取分类详情")
    public ResponseEntity<ApiResponse<CategoryDetailDTO>> getCategory(@PathVariable Long id) {
        CategoryDetailDTO category = categoryService.getCategoryDetail(id);
        return ResponseEntity.ok(ApiResponse.success(category));
    }
    
    // 创建分类
    @PostMapping
    @Operation(summary = "创建分类")
    @PreAuthorize("hasRole('AUTHOR')")
    public ResponseEntity<ApiResponse<CategoryDTO>> createCategory(
            @AuthenticationPrincipal CustomUserDetails userDetails,
            @Valid @RequestBody CreateCategoryRequest request
    ) {
        CategoryDTO category = categoryService.createCategory(request, userDetails.getId());
        return ResponseEntity.ok(ApiResponse.success("分类创建成功", category));
    }
    
    // 更新分类
    @PutMapping("/{id}")
    @Operation(summary = "更新分类")
    @PreAuthorize("hasRole('AUTHOR')")
    public ResponseEntity<ApiResponse<CategoryDTO>> updateCategory(
            @PathVariable Long id,
            @Valid @RequestBody UpdateCategoryRequest request
    ) {
        CategoryDTO category = categoryService.updateCategory(id, request);
        return ResponseEntity.ok(ApiResponse.success("分类更新成功", category));
    }
    
    // 删除分类
    @DeleteMapping("/{id}")
    @Operation(summary = "删除分类")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<Void>> deleteCategory(@PathVariable Long id) {
        categoryService.deleteCategory(id);
        return ResponseEntity.ok(ApiResponse.success("分类删除成功"));
    }
    
    // 批量更新分类状态
    @PatchMapping("/batch-status")
    @Operation(summary = "批量更新分类状态")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<Void>> batchUpdateStatus(
            @Valid @RequestBody BatchUpdateStatusRequest request
    ) {
        categoryService.batchUpdateStatus(request);
        return ResponseEntity.ok(ApiResponse.success("状态更新成功"));
    }
    
    // 获取分类下的文章
    @GetMapping("/{id}/articles")
    @Operation(summary = "获取分类下的文章")
    public ResponseEntity<ApiResponse<PageResponse<ArticleListItem>>> getCategoryArticles(
            @PathVariable Long id,
            @RequestParam(defaultValue = "1") Integer page,
            @RequestParam(defaultValue = "20") Integer size,
            @RequestParam(defaultValue = "publishedAt") String sortBy,
            @RequestParam(defaultValue = "desc") String order
    ) {
        ArticleQueryParams params = ArticleQueryParams.builder()
                .page(page)
                .size(size)
                .sortBy(sortBy)
                .order(order)
                .categoryId(id)
                .status("PUBLISHED")
                .build();
        PageResponse<ArticleListItem> articles = categoryService.getCategoryArticles(id, params);
        return ResponseEntity.ok(ApiResponse.success(articles));
    }
}
```

### 2. 标签管理接口

```java
// TagController.java
@RestController
@RequestMapping("/api/tags")
@RequiredArgsConstructor
@Validated
public class TagController {
    
    private final TagService tagService;
    
    // 获取标签列表
    @GetMapping
    @Operation(summary = "获取标签列表")
    public ResponseEntity<ApiResponse<PageResponse<TagDTO>>> getTags(
            @RequestParam(defaultValue = "1") Integer page,
            @RequestParam(defaultValue = "20") Integer size,
            @RequestParam(required = false) String keyword,
            @RequestParam(required = false) Boolean recommended,
            @RequestParam(required = false) Boolean hot,
            @RequestParam(required = false) Boolean enabled,
            @RequestParam(defaultValue = "articleCount") String sortBy,
            @RequestParam(defaultValue = "desc") String order
    ) {
        TagQuery query = TagQuery.builder()
                .page(page)
                .size(size)
                .keyword(keyword)
                .recommended(recommended)
                .hot(hot)
                .enabled(enabled)
                .sortBy(sortBy)
                .order(order)
                .build();
        PageResponse<TagDTO> result = tagService.getTags(query);
        return ResponseEntity.ok(ApiResponse.success(result));
    }
    
    // 获取标签详情
    @GetMapping("/{id}")
    @Operation(summary = "获取标签详情")
    public ResponseEntity<ApiResponse<TagDetailDTO>> getTag(@PathVariable Long id) {
        TagDetailDTO tag = tagService.getTagDetail(id);
        return ResponseEntity.ok(ApiResponse.success(tag));
    }
    
    // 创建标签
    @PostMapping
    @Operation(summary = "创建标签")
    @PreAuthorize("hasRole('AUTHOR')")
    public ResponseEntity<ApiResponse<TagDTO>> createTag(
            @AuthenticationPrincipal CustomUserDetails userDetails,
            @Valid @RequestBody CreateTagRequest request
    ) {
        TagDTO tag = tagService.createTag(request, userDetails.getId());
        return ResponseEntity.ok(ApiResponse.success("标签创建成功", tag));
    }
    
    // 更新标签
    @PutMapping("/{id}")
    @Operation(summary = "更新标签")
    @PreAuthorize("hasRole('AUTHOR')")
    public ResponseEntity<ApiResponse<TagDTO>> updateTag(
            @PathVariable Long id,
            @Valid @RequestBody UpdateTagRequest request
    ) {
        TagDTO tag = tagService.updateTag(id, request);
        return ResponseEntity.ok(ApiResponse.success("标签更新成功", tag));
    }
    
    // 删除标签
    @DeleteMapping("/{id}")
    @Operation(summary = "删除标签")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<Void>> deleteTag(@PathVariable Long id) {
        tagService.deleteTag(id);
        return ResponseEntity.ok(ApiResponse.success("标签删除成功"));
    }
    
    // 获取热门标签
    @GetMapping("/popular")
    @Operation(summary = "获取热门标签")
    public ResponseEntity<ApiResponse<List<TagDTO>>> getPopularTags(
            @RequestParam(defaultValue = "10") Integer limit,
            @RequestParam(required = false) String period // daily, weekly, monthly
    ) {
        List<TagDTO> tags = tagService.getPopularTags(limit, period);
        return ResponseEntity.ok(ApiResponse.success(tags));
    }
    
    // 获取推荐标签
    @GetMapping("/recommended")
    @Operation(summary = "获取推荐标签")
    public ResponseEntity<ApiResponse<List<TagDTO>>> getRecommendedTags(
            @RequestParam(defaultValue = "10") Integer limit
    ) {
        List<TagDTO> tags = tagService.getRecommendedTags(limit);
        return ResponseEntity.ok(ApiResponse.success(tags));
    }
    
    // 标签搜索（自动补全）
    @GetMapping("/search")
    @Operation(summary = "标签搜索")
    public ResponseEntity<ApiResponse<List<TagDTO>>> searchTags(
            @RequestParam String keyword,
            @RequestParam(defaultValue = "10") Integer limit
    ) {
        List<TagDTO> tags = tagService.searchTags(keyword, limit);
        return ResponseEntity.ok(ApiResponse.success(tags));
    }
    
    // 获取标签下的文章
    @GetMapping("/{id}/articles")
    @Operation(summary = "获取标签下的文章")
    public ResponseEntity<ApiResponse<PageResponse<ArticleListItem>>> getTagArticles(
            @PathVariable Long id,
            @RequestParam(defaultValue = "1") Integer page,
            @RequestParam(defaultValue = "20") Integer size,
            @RequestParam(defaultValue = "publishedAt") String sortBy,
            @RequestParam(defaultValue = "desc") String order
    ) {
        ArticleQueryParams params = ArticleQueryParams.builder()
                .page(page)
                .size(size)
                .sortBy(sortBy)
                .order(order)
                .tagId(id)
                .status("PUBLISHED")
                .build();
        PageResponse<ArticleListItem> articles = tagService.getTagArticles(id, params);
        return ResponseEntity.ok(ApiResponse.success(articles));
    }
    
    // 关注/取消关注标签
    @PostMapping("/{id}/follow")
    @Operation(summary = "关注/取消关注标签")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<ApiResponse<Boolean>> followTag(
            @AuthenticationPrincipal CustomUserDetails userDetails,
            @PathVariable Long id
    ) {
        boolean following = tagService.toggleFollowTag(userDetails.getId(), id);
        return ResponseEntity.ok(ApiResponse.success(following ? "关注成功" : "已取消关注", following));
    }
}
```

## 四、DTO设计

### 1. 分类相关DTO

```java
// CreateCategoryRequest.java
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CreateCategoryRequest {
    
    @NotBlank(message = "分类名称不能为空")
    @Size(min = 2, max = 50, message = "分类名称长度2-50位")
    private String name;
    
    @NotBlank(message = "分类标识不能为空")
    @Pattern(regexp = "^[a-z0-9-]+$", message = "分类标识只能包含小写字母、数字和连字符")
    private String slug;
    
    private String description;
    private String icon;
    private String color;
    private Integer sortOrder;
    private Long parentId;
    private Boolean enabled;
    private Boolean system;
}

// CategoryDTO.java
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CategoryDTO {
    private Long id;
    private String name;
    private String slug;
    private String description;
    private String icon;
    private String color;
    private Integer sortOrder;
    private Long parentId;
    private String parentName;
    private Integer level;
    private Integer articleCount;
    private Boolean system;
    private Boolean enabled;
    private UserSimpleDTO createdBy;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}

// CategoryTreeDTO.java
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CategoryTreeDTO {
    private Long id;
    private String name;
    private String slug;
    private String icon;
    private String color;
    private Integer sortOrder;
    private Integer articleCount;
    private Boolean enabled;
    private List<CategoryTreeDTO> children;
}
```

### 2. 标签相关DTO

```java
// CreateTagRequest.java
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CreateTagRequest {
    
    @NotBlank(message = "标签名称不能为空")
    @Size(min = 1, max = 50, message = "标签名称长度1-50位")
    private String name;
    
    @NotBlank(message = "标签标识不能为空")
    @Pattern(regexp = "^[a-z0-9-]+$", message = "标签标识只能包含小写字母、数字和连字符")
    private String slug;
    
    private String description;
    private String icon;
    private String color;
    private String style; // default, primary, success, warning, danger
    private Boolean recommended;
    private Boolean enabled;
}

// TagDTO.java
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class TagDTO {
    private Long id;
    private String name;
    private String slug;
    private String description;
    private String icon;
    private String color;
    private String style;
    private Integer articleCount;
    private Integer viewCount;
    private Boolean recommended;
    private Boolean hot;
    private Boolean system;
    private Boolean enabled;
    private Boolean following; // 当前用户是否关注
    private UserSimpleDTO createdBy;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}

// TagDetailDTO.java
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode(callSuper = true)
public class TagDetailDTO extends TagDTO {
    private List<ArticleSimpleDTO> recentArticles;
    private List<UserSimpleDTO> topFollowers;
    private Integer followerCount;
    private String seoTitle;
    private String seoDescription;
    private String seoKeywords;
}
```

## 五、服务层实现要点

### 1. CategoryService 实现要点

```java
@Service
@RequiredArgsConstructor
@Transactional
@Slf4j
public class CategoryService {
    
    private final CategoryRepository categoryRepository;
    private final ArticleRepository articleRepository;
    private final CategoryMapper categoryMapper;
    private final RedisTemplate<String, Object> redisTemplate;
    
    /**
     * 创建分类
     */
    public CategoryDTO createCategory(CreateCategoryRequest request, Long userId) {
        // 检查slug是否已存在
        if (categoryRepository.existsBySlug(request.getSlug())) {
            throw new BusinessException("分类标识已存在");
        }
        
        // 如果设置了父分类，验证父分类是否存在且不是系统分类
        Category parent = null;
        if (request.getParentId() != null) {
            parent = categoryRepository.findById(request.getParentId())
                    .orElseThrow(() -> new BusinessException("父分类不存在"));
            if (Boolean.TRUE.equals(parent.getSystem())) {
                throw new BusinessException("不能在系统分类下创建子分类");
            }
        }
        
        // 计算层级
        int level = parent == null ? 1 : parent.getLevel() + 1;
        if (level > 3) {
            throw new BusinessException("分类层级不能超过3级");
        }
        
        // 创建分类
        Category category = Category.builder()
                .name(request.getName())
                .slug(request.getSlug())
                .description(request.getDescription())
                .icon(request.getIcon())
                .color(request.getColor())
                .sortOrder(request.getSortOrder() != null ? request.getSortOrder() : 0)
                .parent(parent)
                .level(level)
                .system(request.getSystem() != null ? request.getSystem() : false)
                .enabled(request.getEnabled() != null ? request.getEnabled() : true)
                .createdBy(User.builder().id(userId).build())
                .build();
        
        category = categoryRepository.save(category);
        
        // 清除缓存
        clearCategoryCache();
        
        return categoryMapper.toDTO(category);
    }
    
    /**
     * 获取分类树
     */
    @Cacheable(value = "category", key = "'tree:' + #enabled")
    public List<CategoryTreeDTO> getCategoryTree(Boolean enabled) {
        List<Category> categories;
        if (enabled != null) {
            categories = categoryRepository.findByEnabledAndParentIsNullOrderBySortOrderAsc(enabled);
        } else {
            categories = categoryRepository.findByParentIsNullOrderBySortOrderAsc();
        }
        
        return categories.stream()
                .map(this::buildCategoryTree)
                .collect(Collectors.toList());
    }
    
    /**
     * 递归构建分类树
     */
    private CategoryTreeDTO buildCategoryTree(Category category) {
        List<Category> children = categoryRepository.findByParentOrderBySortOrderAsc(category);
        
        List<CategoryTreeDTO> childDTOs = children.stream()
                .filter(child -> child.getEnabled()) // 只返回启用的子分类
                .map(this::buildCategoryTree)
                .collect(Collectors.toList());
        
        return CategoryTreeDTO.builder()
                .id(category.getId())
                .name(category.getName())
                .slug(category.getSlug())
                .icon(category.getIcon())
                .color(category.getColor())
                .sortOrder(category.getSortOrder())
                .articleCount(category.getArticleCount())
                .enabled(category.getEnabled())
                .children(childDTOs.isEmpty() ? null : childDTOs)
                .build();
    }
    
    /**
     * 获取分类下的文章
     */
    public PageResponse<ArticleListItem> getCategoryArticles(Long categoryId, ArticleQueryParams params) {
        // 获取分类及其所有子分类
        Category category = categoryRepository.findById(categoryId)
                .orElseThrow(() -> new BusinessException("分类不存在"));
        
        List<Long> categoryIds = new ArrayList<>();
        categoryIds.add(categoryId);
        if (category.getLevel() == 1) {
            // 如果是父分类，包含所有子分类
            List<Category> children = categoryRepository.findByParent(category);
            categoryIds.addAll(children.stream()
                    .map(Category::getId)
                    .collect(Collectors.toList()));
        }
        
        // 查询文章
        Pageable pageable = PageRequest.of(params.getPage() - 1, params.getSize(), 
                Sort.by(Sort.Direction.fromString(params.getOrder()), params.getSortBy()));
        
        Page<Article> page = articleRepository.findByCategoryIdInAndStatus(
                categoryIds, ArticleStatus.PUBLISHED, pageable);
        
        return PageResponse.of(page.map(articleMapper::toListItem));
    }
    
    /**
     * 清除分类缓存
     */
    private void clearCategoryCache() {
        redisTemplate.delete("category:tree:*");
        redisTemplate.delete("category:list:*");
    }
}
```

### 2. TagService 实现要点

```java
@Service
@RequiredArgsConstructor
@Transactional
@Slf4j
public class TagService {
    
    private final TagRepository tagRepository;
    private final ArticleRepository articleRepository;
    private final ArticleTagRepository articleTagRepository;
    private final UserFollowTagRepository userFollowTagRepository;
    private final TagMapper tagMapper;
    private final RedisTemplate<String, Object> redisTemplate;
    
    /**
     * 创建标签
     */
    public TagDTO createTag(CreateTagRequest request, Long userId) {
        // 检查slug是否已存在
        if (tagRepository.existsBySlug(request.getSlug())) {
            throw new BusinessException("标签标识已存在");
        }
        
        // 创建标签
        Tag tag = Tag.builder()
                .name(request.getName())
                .slug(request.getSlug())
                .description(request.getDescription())
                .icon(request.getIcon())
                .color(request.getColor())
                .style(request.getStyle() != null ? request.getStyle() : "default")
                .recommended(request.getRecommended() != null ? request.getRecommended() : false)
                .enabled(request.getEnabled() != null ? request.getEnabled() : true)
                .createdBy(User.builder().id(userId).build())
                .build();
        
        tag = tagRepository.save(tag);
        
        // 清除缓存
        clearTagCache();
        
        return tagMapper.toDTO(tag);
    }
    
    /**
     * 标签搜索（自动补全）
     */
    public List<TagDTO> searchTags(String keyword, Integer limit) {
        List<Tag> tags = tagRepository.searchByNameOrSlug(
                keyword, 
                PageRequest.of(0, limit != null ? limit : 10)
        );
        
        return tags.stream()
                .filter(Tag::getEnabled)
                .map(tagMapper::toDTO)
                .collect(Collectors.toList());
    }
    
    /**
     * 获取热门标签
     */
    @Cacheable(value = "tag", key = "'popular:' + #limit + ':' + #period")
    public List<TagDTO> getPopularTags(Integer limit, String period) {
        LocalDateTime startTime = null;
        if ("daily".equals(period)) {
            startTime = LocalDateTime.now().minusDays(1);
        } else if ("weekly".equals(period)) {
            startTime = LocalDateTime.now().minusWeeks(1);
        } else if ("monthly".equals(period)) {
            startTime = LocalDateTime.now().minusMonths(1);
        }
        
        List<Tag> tags;
        if (startTime != null) {
            // 基于时间段的文章数量排序
            tags = tagRepository.findPopularTagsByPeriod(startTime, 
                    PageRequest.of(0, limit != null ? limit : 10));
        } else {
            // 基于总文章数量排序
            tags = tagRepository.findByEnabledTrueOrderByArticleCountDesc(
                    PageRequest.of(0, limit != null ? limit : 10));
        }
        
        return tags.stream()
                .map(tagMapper::toDTO)
                .collect(Collectors.toList());
    }
    
    /**
     * 关注/取消关注标签
     */
    public boolean toggleFollowTag(Long userId, Long tagId) {
        // 验证标签是否存在且启用
        Tag tag = tagRepository.findByIdAndEnabledTrue(tagId)
                .orElseThrow(() -> new BusinessException("标签不存在或未启用"));
        
        Optional<UserFollowTag> existing = userFollowTagRepository
                .findByUserIdAndTagId(userId, tagId);
        
        if (existing.isPresent()) {
            // 取消关注
            userFollowTagRepository.delete(existing.get());
            return false;
        } else {
            // 关注
            UserFollowTag follow = UserFollowTag.builder()
                    .user(User.builder().id(userId).build())
                    .tag(tag)
                    .build();
            userFollowTagRepository.save(follow);
            return true;
        }
    }
    
    /**
     * 更新标签使用计数
     */
    @Async
    public void updateTagUsageCount(Long tagId) {
        Tag tag = tagRepository.findById(tagId).orElse(null);
        if (tag != null) {
            int articleCount = articleTagRepository.countByTagId(tagId);
            tag.setArticleCount(articleCount);
            
            // 如果是热门标签（使用次数超过阈值）
            if (articleCount >= 100 && !tag.getHot()) {
                tag.setHot(true);
            } else if (articleCount < 100 && tag.getHot()) {
                tag.setHot(false);
            }
            
            tagRepository.save(tag);
            clearTagCache();
        }
    }
    
    /**
     * 清除标签缓存
     */
    private void clearTagCache() {
        redisTemplate.delete("tag:popular:*");
        redisTemplate.delete("tag:recommended:*");
        redisTemplate.delete("tag:list:*");
    }
}
```

## 六、前端对接方案

### 1. TypeScript类型定义

```typescript
// types/category.ts
export interface Category {
  id: number;
  name: string;
  slug: string;
  description?: string;
  icon?: string;
  color?: string;
  sortOrder: number;
  parentId?: number;
  level: number;
  articleCount: number;
  system: boolean;
  enabled: boolean;
  createdBy?: UserSimple;
  createdAt: string;
  updatedAt: string;
}

export interface CategoryTree extends Category {
  children?: CategoryTree[];
}

export interface CreateCategoryRequest {
  name: string;
  slug: string;
  description?: string;
  icon?: string;
  color?: string;
  sortOrder?: number;
  parentId?: number;
  enabled?: boolean;
  system?: boolean;
}

// types/tag.ts
export interface Tag {
  id: number;
  name: string;
  slug: string;
  description?: string;
  icon?: string;
  color?: string;
  style: string;
  articleCount: number;
  viewCount: number;
  recommended: boolean;
  hot: boolean;
  system: boolean;
  enabled: boolean;
  following?: boolean; // 当前用户是否关注
  createdBy?: UserSimple;
  createdAt: string;
  updatedAt: string;
}

export interface CreateTagRequest {
  name: string;
  slug: string;
  description?: string;
  icon?: string;
  color?: string;
  style?: string;
  recommended?: boolean;
  enabled?: boolean;
}
```

### 2. API服务封装

```typescript
// services/category.ts
export class CategoryService {
  // 获取分类树
  static getCategoryTree(enabled?: boolean): Promise<CategoryTree[]> {
    return api.get('/categories/tree', { enabled });
  }
  
  // 创建分类
  static createCategory(data: CreateCategoryRequest): Promise<Category> {
    return api.post('/categories', data);
  }
  
  // 更新分类
  static updateCategory(id: number, data: Partial<CreateCategoryRequest>): Promise<Category> {
    return api.put(`/categories/${id}`, data);
  }
  
  // 删除分类
  static deleteCategory(id: number): Promise<void> {
    return api.delete(`/categories/${id}`);
  }
  
  // 获取分类下的文章
  static getCategoryArticles(
    id: number, 
    params: { page?: number; size?: number; sortBy?: string; order?: string }
  ): Promise<PageResponse<ArticleListItem>> {
    return api.get(`/categories/${id}/articles`, params);
  }
}

// services/tag.ts
export class TagService {
  // 获取标签列表
  static getTags(params?: {
    page?: number;
    size?: number;
    keyword?: string;
    recommended?: boolean;
    hot?: boolean;
    enabled?: boolean;
    sortBy?: string;
    order?: string;
  }): Promise<PageResponse<Tag>> {
    return api.get('/tags', params);
  }
  
  // 获取热门标签
  static getPopularTags(limit?: number, period?: string): Promise<Tag[]> {
    return api.get('/tags/popular', { limit, period });
  }
  
  // 标签搜索
  static searchTags(keyword: string, limit?: number): Promise<Tag[]> {
    return api.get('/tags/search', { keyword, limit });
  }
  
  // 创建标签
  static createTag(data: CreateTagRequest): Promise<Tag> {
    return api.post('/tags', data);
  }
  
  // 关注/取消关注标签
  static followTag(id: number): Promise<boolean> {
    return api.post(`/tags/${id}/follow`);
  }
}
```

### 3. 在发布文章时选择标签和分类

```typescript
// components/ArticleEditor/TagSelector.tsx
import React, { useState, useEffect } from 'react';
import { TagService } from '@/services/tag';
import { Tag } from '@/types/tag';

interface TagSelectorProps {
  selectedTags: number[];
  onChange: (tagIds: number[]) => void;
  maxTags?: number;
}

export const TagSelector: React.FC<TagSelectorProps> = ({
  selectedTags,
  onChange,
  maxTags = 5
}) => {
  const [tags, setTags] = useState<Tag[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchText, setSearchText] = useState('');
  
  // 加载热门标签
  useEffect(() => {
    loadPopularTags();
  }, []);
  
  // 搜索标签
  useEffect(() => {
    if (searchText.trim()) {
      const timer = setTimeout(() => {
        searchTags(searchText);
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [searchText]);
  
  const loadPopularTags = async () => {
    setLoading(true);
    try {
      const popularTags = await TagService.getPopularTags(20);
      setTags(popularTags);
    } catch (error) {
      console.error('加载标签失败:', error);
    } finally {
      setLoading(false);
    }
  };
  
  const searchTags = async (keyword: string) => {
    setLoading(true);
    try {
      const searchResult = await TagService.searchTags(keyword, 10);
      setTags(searchResult);
    } catch (error) {
      console.error('搜索标签失败:', error);
    } finally {
      setLoading(false);
    }
  };
  
  const handleTagClick = (tagId: number) => {
    let newSelectedTags: number[];
    
    if (selectedTags.includes(tagId)) {
      // 取消选择
      newSelectedTags = selectedTags.filter(id => id !== tagId);
    } else {
      // 检查是否超过最大限制
      if (selectedTags.length >= maxTags) {
        message.warning(`最多只能选择${maxTags}个标签`);
        return;
      }
      newSelectedTags = [...selectedTags, tagId];
    }
    
    onChange(newSelectedTags);
  };
  
  const handleCreateTag = async () => {
    if (!searchText.trim()) return;
    
    try {
      const newTag = await TagService.createTag({
        name: searchText,
        slug: searchText.toLowerCase().replace(/\s+/g, '-')
      });
      
      // 添加新标签到列表
      setTags(prev => [newTag, ...prev]);
      
      // 选择新标签
      if (selectedTags.length < maxTags) {
        onChange([...selectedTags, newTag.id]);
      }
      
      setSearchText('');
    } catch (error) {
      message.error('创建标签失败');
    }
  };
  
  return (
    <div className="tag-selector">
      <div className="search-box">
        <Input.Search
          placeholder="搜索或创建标签..."
          value={searchText}
          onChange={e => setSearchText(e.target.value)}
          onSearch={handleCreateTag}
          loading={loading}
        />
        <span className="tag-limit">
          {selectedTags.length}/{maxTags}
        </span>
      </div>
      
      <div className="tag-list">
        {loading ? (
          <Spin />
        ) : (
          tags.map(tag => (
            <Tag
              key={tag.id}
              color={selectedTags.includes(tag.id) ? 'blue' : tag.color}
              style={{ marginBottom: 8, cursor: 'pointer' }}
              onClick={() => handleTagClick(tag.id)}
            >
              {tag.icon && <Icon type={tag.icon} />}
              {tag.name}
            </Tag>
          ))
        )}
      </div>
      
      <div className="selected-tags">
        {selectedTags.map(tagId => {
          const tag = tags.find(t => t.id === tagId);
          return tag ? (
            <Tag
              key={tag.id}
              color="blue"
              closable
              onClose={() => handleTagClick(tag.id)}
            >
              {tag.name}
            </Tag>
          ) : null;
        })}
      </div>
    </div>
  );
};

// components/ArticleEditor/CategorySelector.tsx
import React, { useState, useEffect } from 'react';
import { TreeSelect } from 'antd';
import { CategoryService } from '@/services/category';
import { CategoryTree } from '@/types/category';

interface CategorySelectorProps {
  value?: number;
  onChange?: (categoryId: number) => void;
}

export const CategorySelector: React.FC<CategorySelectorProps> = ({
  value,
  onChange
}) => {
  const [categories, setCategories] = useState<CategoryTree[]>([]);
  const [loading, setLoading] = useState(false);
  
  useEffect(() => {
    loadCategories();
  }, []);
  
  const loadCategories = async () => {
    setLoading(true);
    try {
      const categoryTree = await CategoryService.getCategoryTree(true);
      setCategories(categoryTree);
    } catch (error) {
      console.error('加载分类失败:', error);
    } finally {
      setLoading(false);
    }
  };
  
  // 将分类树转换为TreeSelect需要的数据格式
  const treeData = categories.map(category => ({
    title: (
      <span>
        {category.icon && <Icon type={category.icon} />}
        {category.name}
        <span className="article-count">({category.articleCount})</span>
      </span>
    ),
    value: category.id,
    children: category.children?.map(child => ({
      title: (
        <span>
          {child.icon && <Icon type={child.icon} />}
          {child.name}
          <span className="article-count">({child.articleCount})</span>
        </span>
      ),
      value: child.id
    }))
  }));
  
  return (
    <TreeSelect
      style={{ width: '100%' }}
      value={value}
      dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
      placeholder="请选择分类"
      treeDefaultExpandAll
      onChange={onChange}
      treeData={treeData}
      loading={loading}
      allowClear
    />
  );
};
```

### 4. 集成到文章发布表单

```typescript
// components/ArticleEditor/index.tsx
const ArticleEditor: React.FC = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  
  // 发布文章
  const handleSubmit = async (values: any) => {
    setLoading(true);
    try {
      const articleData = {
        ...values,
        // 确保tagIds是数组
        tagIds: Array.isArray(values.tagIds) ? values.tagIds : [],
        // 如果选择了分类
        categoryId: values.categoryId || null
      };
      
      await ArticleService.createArticle(articleData);
      message.success('文章发布成功');
    } catch (error) {
      message.error('发布失败');
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <Form form={form} onFinish={handleSubmit}>
      {/* 标题、封面图等字段 */}
      
      {/* 分类选择 */}
      <Form.Item name="categoryId" label="分类">
        <CategorySelector />
      </Form.Item>
      
      {/* 标签选择 */}
      <Form.Item 
        name="tagIds" 
        label="标签"
        rules={[{ required: true, message: '请至少选择一个标签' }]}
      >
        <TagSelector />
      </Form.Item>
      
      {/* 其他字段 */}
      
      <Form.Item>
        <Button type="primary" htmlType="submit" loading={loading}>
          发布文章
        </Button>
      </Form.Item>
    </Form>
  );
};
```

## 七、初始化数据

创建一些系统默认的分类和标签：

```sql
-- 初始化系统分类
INSERT INTO categories (name, slug, description, icon, color, sort_order, level, is_system, is_enabled) VALUES
('前端开发', 'frontend', '前端开发相关技术', 'CodeOutlined', '#1890ff', 1, 1, TRUE, TRUE),
('后端架构', 'backend', '后端开发与架构设计', 'ApiOutlined', '#52c41a', 2, 1, TRUE, TRUE),
('移动开发', 'mobile', '移动端开发技术', 'MobileOutlined', '#faad14', 3, 1, TRUE, TRUE),
('数据科学', 'data-science', '数据分析与人工智能', 'LineChartOutlined', '#722ed1', 4, 1, TRUE, TRUE),
('运维部署', 'devops', '运维与部署相关', 'CloudServerOutlined', '#13c2c2', 5, 1, TRUE, TRUE);

-- 初始化热门标签
INSERT INTO tags (name, slug, description, color, style, is_recommended, is_hot, is_system, is_enabled) VALUES
('JavaScript', 'javascript', 'JavaScript编程语言', '#f0db4f', 'warning', TRUE, TRUE, TRUE, TRUE),
('TypeScript', 'typescript', 'TypeScript编程语言', '#007acc', 'primary', TRUE, TRUE, TRUE, TRUE),
('React', 'react', 'React前端框架', '#61dafb', 'info', TRUE, TRUE, TRUE, TRUE),
('Vue', 'vue', 'Vue.js框架', '#42b883', 'success', TRUE, TRUE, TRUE, TRUE),
('Node.js', 'nodejs', 'Node.js后端运行时', '#68a063', 'success', TRUE, TRUE, TRUE, TRUE),
('Java', 'java', 'Java编程语言', '#007396', 'danger', TRUE, TRUE, TRUE, TRUE),
('Spring Boot', 'spring-boot', 'Spring Boot框架', '#6db33f', 'success', TRUE, TRUE, TRUE, TRUE),
('Python', 'python', 'Python编程语言', '#3776ab', 'primary', TRUE, TRUE, TRUE, TRUE),
('Docker', 'docker', '容器化技术', '#2496ed', 'info', TRUE, TRUE, TRUE, TRUE),
('Kubernetes', 'kubernetes', '容器编排平台', '#326ce5', 'primary', TRUE, TRUE, TRUE, TRUE),
('微服务', 'microservices', '微服务架构', '#ff6b6b', 'danger', TRUE, TRUE, TRUE, TRUE),
('数据库', 'database', '数据库技术', '#ffa726', 'warning', TRUE, TRUE, TRUE, TRUE),
('算法', 'algorithm', '算法与数据结构', '#4db6ac', 'success', TRUE, TRUE, TRUE, TRUE),
('设计模式', 'design-patterns', '软件设计模式', '#9575cd', 'default', TRUE, FALSE, TRUE, TRUE),
('性能优化', 'performance', '性能优化技巧', '#f06292', 'warning', TRUE, FALSE, TRUE, TRUE);
```

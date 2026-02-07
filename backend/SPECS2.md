# 文章系统后端接口设计文档

## 一、数据库设计

### 1. 核心表结构

```sql
-- 文章表
CREATE TABLE articles (
    id BIGINT PRIMARY KEY AUTO_INCREMENT COMMENT '文章ID',
    user_id BIGINT NOT NULL COMMENT '作者ID',
    title VARCHAR(200) NOT NULL COMMENT '文章标题',
    slug VARCHAR(200) NOT NULL UNIQUE COMMENT '文章slug（URL友好标识）',
    cover_image VARCHAR(500) COMMENT '封面图URL',
    summary TEXT COMMENT '文章摘要',
    content LONGTEXT NOT NULL COMMENT '文章内容（Markdown格式）',
    html_content LONGTEXT COMMENT 'HTML格式内容（用于快速展示）',
    
    -- 状态相关
    status ENUM('DRAFT', 'PUBLISHED', 'PRIVATE', 'DELETED') DEFAULT 'DRAFT' COMMENT '文章状态',
    visibility ENUM('PUBLIC', 'PRIVATE', 'PASSWORD', 'PAID') DEFAULT 'PUBLIC' COMMENT '可见性',
    password VARCHAR(100) COMMENT '访问密码（如果visibility=PASSWORD）',
    price DECIMAL(10,2) DEFAULT 0 COMMENT '价格（如果visibility=PAID）',
    
    -- 分类标签
    category_id BIGINT COMMENT '分类ID',
    
    -- 统计相关
    view_count BIGINT DEFAULT 0 COMMENT '阅读数',
    like_count BIGINT DEFAULT 0 COMMENT '点赞数',
    collect_count BIGINT DEFAULT 0 COMMENT '收藏数',
    comment_count BIGINT DEFAULT 0 COMMENT '评论数',
    share_count BIGINT DEFAULT 0 COMMENT '分享数',
    
    -- 时间相关
    published_at DATETIME COMMENT '发布时间',
    scheduled_at DATETIME COMMENT '定时发布时间',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    deleted_at DATETIME COMMENT '软删除时间',
    
    -- 索引
    INDEX idx_user_id (user_id),
    INDEX idx_status (status),
    INDEX idx_published_at (published_at),
    INDEX idx_category_id (category_id),
    INDEX idx_created_at (created_at),
    INDEX idx_slug (slug),
    FULLTEXT idx_title_summary (title, summary),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='文章表';

-- 文章标签关联表
CREATE TABLE article_tags (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    article_id BIGINT NOT NULL,
    tag_id BIGINT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    
    UNIQUE KEY uk_article_tag (article_id, tag_id),
    INDEX idx_tag_id (tag_id),
    FOREIGN KEY (article_id) REFERENCES articles(id) ON DELETE CASCADE,
    FOREIGN KEY (tag_id) REFERENCES tags(id) ON DELETE CASCADE
) COMMENT='文章-标签关联表';

-- 分类表
CREATE TABLE categories (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(50) NOT NULL COMMENT '分类名称',
    slug VARCHAR(50) NOT NULL UNIQUE COMMENT '分类slug',
    description VARCHAR(500) COMMENT '分类描述',
    icon VARCHAR(100) COMMENT '分类图标',
    sort_order INT DEFAULT 0 COMMENT '排序',
    parent_id BIGINT COMMENT '父分类ID',
    article_count INT DEFAULT 0 COMMENT '文章数',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    INDEX idx_parent_id (parent_id),
    INDEX idx_sort_order (sort_order),
    FOREIGN KEY (parent_id) REFERENCES categories(id) ON DELETE CASCADE
) COMMENT='分类表';

-- 标签表
CREATE TABLE tags (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(50) NOT NULL COMMENT '标签名称',
    slug VARCHAR(50) NOT NULL UNIQUE COMMENT '标签slug',
    description VARCHAR(500) COMMENT '标签描述',
    icon VARCHAR(100) COMMENT '标签图标',
    color VARCHAR(20) COMMENT '标签颜色',
    article_count INT DEFAULT 0 COMMENT '使用次数',
    is_recommended BOOLEAN DEFAULT FALSE COMMENT '是否推荐',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    INDEX idx_article_count (article_count),
    INDEX idx_is_recommended (is_recommended)
) COMMENT='标签表';

-- 文章点赞表
CREATE TABLE article_likes (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    article_id BIGINT NOT NULL,
    user_id BIGINT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    
    UNIQUE KEY uk_article_user_like (article_id, user_id),
    INDEX idx_user_id (user_id),
    FOREIGN KEY (article_id) REFERENCES articles(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) COMMENT='文章点赞表';

-- 文章收藏表
CREATE TABLE article_collections (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    article_id BIGINT NOT NULL,
    user_id BIGINT NOT NULL,
    collection_id BIGINT COMMENT '收藏夹ID',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    
    UNIQUE KEY uk_article_user_collection (article_id, user_id, collection_id),
    INDEX idx_user_id (user_id),
    INDEX idx_collection_id (collection_id),
    FOREIGN KEY (article_id) REFERENCES articles(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (collection_id) REFERENCES collections(id) ON DELETE CASCADE
) COMMENT='文章收藏表';

-- 文章阅读历史表
CREATE TABLE article_read_history (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    article_id BIGINT NOT NULL,
    user_id BIGINT NOT NULL,
    progress DECIMAL(5,2) DEFAULT 0 COMMENT '阅读进度（0-100）',
    last_position INT DEFAULT 0 COMMENT '最后阅读位置（字符位置）',
    read_duration INT DEFAULT 0 COMMENT '阅读时长（秒）',
    last_read_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    
    INDEX idx_user_id (user_id),
    INDEX idx_last_read_at (last_read_at),
    UNIQUE KEY uk_article_user (article_id, user_id),
    FOREIGN KEY (article_id) REFERENCES articles(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) COMMENT='文章阅读历史表';

-- 收藏夹表
CREATE TABLE collections (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    user_id BIGINT NOT NULL,
    name VARCHAR(100) NOT NULL COMMENT '收藏夹名称',
    description VARCHAR(500) COMMENT '收藏夹描述',
    cover_image VARCHAR(500) COMMENT '封面图',
    is_public BOOLEAN DEFAULT TRUE COMMENT '是否公开',
    item_count INT DEFAULT 0 COMMENT '收藏项数量',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    INDEX idx_user_id (user_id),
    INDEX idx_is_public (is_public),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) COMMENT='收藏夹表';
```

## 二、后端接口设计

### 1. 接口概览

```
文章相关接口：
- POST   /api/articles          创建文章
- PUT    /api/articles/{id}     更新文章
- DELETE /api/articles/{id}     删除文章
- GET    /api/articles/{id}     获取文章详情
- GET    /api/articles          获取文章列表
- GET    /api/articles/{id}/related 相关文章
- POST   /api/articles/{id}/like 点赞/取消点赞
- POST   /api/articles/{id}/collect 收藏/取消收藏
- POST   /api/articles/{id}/view 记录阅读
- GET    /api/articles/drafts   获取草稿列表
- GET    /api/articles/search   搜索文章
- GET    /api/articles/trending 热门文章

分类相关接口：
- GET    /api/categories        获取分类列表
- GET    /api/categories/{id}   获取分类详情
- GET    /api/categories/{id}/articles 获取分类下的文章

标签相关接口：
- GET    /api/tags              获取标签列表
- GET    /api/tags/{id}         获取标签详情
- GET    /api/tags/{id}/articles 获取标签下的文章
- GET    /api/tags/popular      热门标签

用户文章相关：
- GET    /api/users/{userId}/articles 获取用户文章
- GET    /api/users/{userId}/collections 获取用户收藏
```

### 2. 请求/响应DTO设计

```java
// 文章创建/更新请求
public class ArticleRequest {
    private String title;
    private String slug;
    private String coverImage;
    private String summary;
    private String content;
    private String status; // DRAFT, PUBLISHED
    private String visibility; // PUBLIC, PRIVATE, PASSWORD, PAID
    private String password;
    private BigDecimal price;
    private Long categoryId;
    private List<Long> tagIds;
    private LocalDateTime scheduledAt;
}

// 文章响应
public class ArticleResponse {
    private Long id;
    private String title;
    private String slug;
    private String coverImage;
    private String summary;
    private String content;
    private String htmlContent;
    private String status;
    private String visibility;
    private Long categoryId;
    private List<TagDTO> tags;
    private UserDTO author;
    private Long viewCount;
    private Long likeCount;
    private Long collectCount;
    private Long commentCount;
    private LocalDateTime publishedAt;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private Boolean liked; // 当前用户是否点赞
    private Boolean collected; // 当前用户是否收藏
    private Integer readProgress; // 阅读进度
}

// 文章列表项
public class ArticleListItem {
    private Long id;
    private String title;
    private String slug;
    private String coverImage;
    private String summary;
    private String status;
    private String visibility;
    private UserDTO author;
    private CategoryDTO category;
    private List<TagDTO> tags;
    private Long viewCount;
    private Long likeCount;
    private Long commentCount;
    private LocalDateTime publishedAt;
    private LocalDateTime createdAt;
}

// 文章查询参数
public class ArticleQueryParams {
    private Integer page = 1;
    private Integer size = 20;
    private String sortBy = "createdAt"; // createdAt, publishedAt, viewCount, likeCount
    private String order = "desc"; // asc, desc
    private String status; // DRAFT, PUBLISHED
    private Long categoryId;
    private Long tagId;
    private Long userId;
    private String keyword;
    private LocalDate startDate;
    private LocalDate endDate;
}
```

## 三、实现思路提示词

请复制以下提示词给其他大模型：

---

## 需求：实现技术内容分享平台的完整文章系统后端

### 技术栈要求：
- Java 17 + Spring Boot 3.x
- Spring Security + JWT认证
- Spring Data JPA + MySQL 8.x
- Redis 7.x 用于缓存
- MapStruct 对象映射
- Lombok 简化代码

### 核心功能模块：

#### 1. 文章管理模块
**功能需求：**
- 文章的CRUD操作（创建、读取、更新、删除）
- 支持Markdown编辑和HTML转换
- 文章状态管理（草稿、已发布、私有、定时发布）
- 文章可见性控制（公开、私有、密码保护、付费阅读）
- 文章分类和标签管理
- 文章统计（阅读数、点赞数、收藏数）

**接口设计：**
```
文章相关接口：
- POST   /api/articles          创建文章
- PUT    /api/articles/{id}     更新文章
- DELETE /api/articles/{id}     删除文章
- GET    /api/articles/{id}     获取文章详情
- GET    /api/articles          获取文章列表
- GET    /api/articles/{id}/related 相关文章
- POST   /api/articles/{id}/like 点赞/取消点赞
- POST   /api/articles/{id}/collect 收藏/取消收藏
- POST   /api/articles/{id}/view 记录阅读
- GET    /api/articles/drafts   获取草稿列表
- GET    /api/articles/search   搜索文章
- GET    /api/articles/trending 热门文章
```

#### 2. 分类标签模块
**功能需求：**
- 分类的CRUD操作
- 标签的CRUD操作
- 文章与标签的多对多关系
- 热门标签推荐
- 分类下的文章统计

**接口设计：**
```
分类相关接口：
- GET    /api/categories        获取分类列表
- GET    /api/categories/{id}   获取分类详情
- GET    /api/categories/{id}/articles 获取分类下的文章

标签相关接口：
- GET    /api/tags              获取标签列表
- GET    /api/tags/{id}         获取标签详情
- GET    /api/tags/{id}/articles 获取标签下的文章
- GET    /api/tags/popular      热门标签
```

#### 3. 互动功能模块
**功能需求：**
- 文章点赞/取消点赞
- 文章收藏/取消收藏（支持多收藏夹）
- 阅读历史记录（记录进度、时长）
- 用户收藏夹管理
- 数据统计和分析

**接口设计：**
```
互动接口：
- POST   /api/articles/{id}/like 点赞/取消点赞
- POST   /api/articles/{id}/collect 收藏/取消收藏
- GET    /api/users/{userId}/collections 用户收藏夹
- POST   /api/collections        创建收藏夹
- PUT    /api/collections/{id}   更新收藏夹
- DELETE /api/collections/{id}   删除收藏夹
```

### 数据库设计：
（已提供完整的SQL建表语句，包括articles、article_tags、categories、tags、article_likes、article_collections、article_read_history、collections等表）

### 技术要求：

#### 1. 安全要求：
- JWT认证和授权
- 权限验证：用户只能操作自己的文章（管理员除外）
- 防止XSS攻击：对用户输入的Markdown内容进行安全过滤
- 防止SQL注入：使用参数化查询
- 接口限流：对热门接口进行限流保护

#### 2. 性能优化：
- Redis缓存：文章详情、热门文章列表、标签云等
- 数据库索引：对查询频繁的字段建立合适索引
- 分页查询：所有列表接口支持分页
- 懒加载：关联数据按需加载
- 异步处理：阅读统计、点赞统计等异步更新

#### 3. 业务逻辑：
- 文章发布流程：草稿 -> 审核 -> 发布
- 定时发布：使用Spring Task或消息队列实现
- 付费文章：需要验证用户购买记录
- 阅读统计：防刷机制（同一用户多次阅读只算一次）
- 相关推荐：基于标签相似度推荐相关文章

#### 4. 异常处理：
- 统一的异常响应格式
- 详细的错误信息（开发环境）
- 友好的错误提示（生产环境）
- 操作日志记录

### 文件结构参考：
```
src/main/java/com/techplatform/
├── config/                    # 配置类
│   ├── SecurityConfig.java
│   ├── RedisConfig.java
│   └── WebConfig.java
├── controller/               # 控制器
│   ├── ArticleController.java
│   ├── CategoryController.java
│   ├── TagController.java
│   └── CollectionController.java
├── service/                  # 服务层
│   ├── ArticleService.java
│   ├── CategoryService.java
│   ├── TagService.java
│   └── CollectionService.java
├── repository/               # 数据访问层
│   ├── ArticleRepository.java
│   ├── CategoryRepository.java
│   ├── TagRepository.java
│   └── CollectionRepository.java
├── model/                    # 实体类
│   ├── entity/              # JPA实体
│   ├── dto/                 # 数据传输对象
│   └── vo/                  # 视图对象
├── security/                 # 安全相关
│   ├── JwtTokenProvider.java
│   └── CustomUserDetails.java
├── exception/               # 异常处理
│   ├── GlobalExceptionHandler.java
│   └── BusinessException.java
└── util/                    # 工具类
    ├── MarkdownUtil.java    # Markdown转换工具
    └── SlugUtil.java        # Slug生成工具
```

### 特殊功能实现要点：

#### 1. Markdown处理：
```java
// 使用flexmark-java库解析Markdown
public class MarkdownUtil {
    public static String toHtml(String markdown) {
        // 解析Markdown为HTML
        // 支持代码高亮、数学公式、流程图等
    }
    
    public static String extractSummary(String markdown, int length) {
        // 从Markdown中提取纯文本摘要
    }
}
```

#### 2. 文章slug生成：
```java
public class SlugUtil {
    public static String generateSlug(String title) {
        // 生成URL友好的slug
        // 如："Hello World!" -> "hello-world"
        // 确保唯一性
    }
}
```

#### 3. 阅读统计防刷：
```java
// 使用Redis记录用户阅读行为
@Component
public class ArticleViewService {
    @Autowired
    private RedisTemplate<String, String> redisTemplate;
    
    public void recordView(Long articleId, Long userId) {
        String key = String.format("article:view:%s:%s", articleId, userId);
        // 设置24小时内不重复计数
        Boolean viewed = redisTemplate.opsForValue().setIfAbsent(key, "1", 24, TimeUnit.HOURS);
        if (Boolean.TRUE.equals(viewed)) {
            // 异步更新数据库阅读数
            asyncUpdateViewCount(articleId);
        }
    }
}
```

#### 4. 相关文章推荐：
```java
@Service
public class ArticleRecommendationService {
    public List<Article> getRelatedArticles(Long articleId, int limit) {
        // 基于标签相似度推荐
        // 1. 获取当前文章的标签
        // 2. 查找有相同标签的文章
        // 3. 按标签重合度排序
        // 4. 排除当前文章
    }
}
```

### 测试要求：
- 单元测试覆盖核心业务逻辑
- 集成测试验证接口功能
- 性能测试确保系统稳定性
- 安全测试验证权限控制

### 部署要求：
- Docker容器化部署
- 配置文件分离（开发、测试、生产）
- 健康检查接口
- 监控和日志收集

请按照以上要求实现完整的文章系统后端，确保代码质量、安全性和性能。需要提供完整的源代码，包括实体类、Repository、Service、Controller、DTO、工具类等。

---

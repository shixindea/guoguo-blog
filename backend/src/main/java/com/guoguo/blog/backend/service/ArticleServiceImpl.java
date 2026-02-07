package com.guoguo.blog.backend.service;

import com.guoguo.blog.backend.dto.ArticleListItem;
import com.guoguo.blog.backend.dto.ArticleRequest;
import com.guoguo.blog.backend.dto.ArticleResponse;
import com.guoguo.blog.backend.dto.ArticleViewRequest;
import com.guoguo.blog.backend.dto.CategoryDTO;
import com.guoguo.blog.backend.dto.PageResponse;
import com.guoguo.blog.backend.dto.TagDTO;
import com.guoguo.blog.backend.dto.UserDTO;
import com.guoguo.blog.backend.entity.Article;
import com.guoguo.blog.backend.entity.ArticleCollection;
import com.guoguo.blog.backend.entity.ArticleLike;
import com.guoguo.blog.backend.entity.ArticleReadHistory;
import com.guoguo.blog.backend.entity.ArticleStatus;
import com.guoguo.blog.backend.entity.ArticleTag;
import com.guoguo.blog.backend.entity.ArticleTag;
import com.guoguo.blog.backend.entity.ArticleVisibility;
import com.guoguo.blog.backend.entity.Category;
import com.guoguo.blog.backend.entity.Tag;
import com.guoguo.blog.backend.entity.User;
import com.guoguo.blog.backend.exception.BusinessException;
import com.guoguo.blog.backend.repository.ArticleCollectionRepository;
import com.guoguo.blog.backend.repository.ArticleLikeRepository;
import com.guoguo.blog.backend.repository.ArticleReadHistoryRepository;
import com.guoguo.blog.backend.repository.ArticleRepository;
import com.guoguo.blog.backend.repository.ArticleTagRepository;
import com.guoguo.blog.backend.repository.CategoryRepository;
import com.guoguo.blog.backend.repository.TagRepository;
import com.guoguo.blog.backend.repository.UserRepository;
import com.guoguo.blog.backend.util.MarkdownUtil;
import com.guoguo.blog.backend.util.SlugUtil;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Collections;
import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.Set;
import java.util.stream.Collectors;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;

@Service
@RequiredArgsConstructor
@Transactional
public class ArticleServiceImpl implements ArticleService {
  private final ArticleRepository articleRepository;
  private final ArticleTagRepository articleTagRepository;
  private final ArticleLikeRepository articleLikeRepository;
  private final ArticleCollectionRepository articleCollectionRepository;
  private final ArticleReadHistoryRepository articleReadHistoryRepository;
  private final CategoryRepository categoryRepository;
  private final TagRepository tagRepository;
  private final UserRepository userRepository;

  @Override
  public ArticleResponse createArticle(Long userId, ArticleRequest request) {
    User author = userRepository.findById(userId).orElseThrow(() -> new BusinessException("USER_NOT_FOUND", "用户不存在"));
    Category category = resolveCategory(request.getCategoryId());

    ArticleStatus status = resolveStatus(request.getStatus());
    ArticleVisibility visibility = resolveVisibility(request.getVisibility());
    String slug = resolveUniqueSlug(null, request.getSlug(), request.getTitle());

    String summary = request.getSummary();
    if (!StringUtils.hasText(summary)) {
      summary = MarkdownUtil.extractSummary(request.getContent(), 120);
    }

    Article article =
        Article.builder()
            .author(author)
            .title(request.getTitle())
            .slug(slug)
            .coverImage(request.getCoverImage())
            .summary(summary)
            .content(request.getContent())
            .htmlContent(MarkdownUtil.toHtml(request.getContent()))
            .status(status)
            .visibility(visibility)
            .password(request.getPassword())
            .price(defaultPrice(request.getPrice()))
            .category(category)
            .scheduledAt(request.getScheduledAt())
            .publishedAt(status == ArticleStatus.PUBLISHED ? LocalDateTime.now() : null)
            .build();

    article = articleRepository.save(article);
    saveTags(article, request.getTagIds());
    return getArticleDetail(userId, article.getId());
  }

  @Override
  public ArticleResponse updateArticle(Long userId, Long articleId, ArticleRequest request) {
    Article article = articleRepository.findById(articleId).orElseThrow(() -> new BusinessException("ARTICLE_NOT_FOUND", "文章不存在"));
    if (!Objects.equals(article.getAuthor().getId(), userId)) {
      throw new BusinessException("FORBIDDEN", "无权操作该文章");
    }
    if (article.getStatus() == ArticleStatus.DELETED) {
      throw new BusinessException("ARTICLE_DELETED", "文章已删除");
    }

    Category category = resolveCategory(request.getCategoryId());
    ArticleStatus status = resolveStatus(request.getStatus());
    ArticleVisibility visibility = resolveVisibility(request.getVisibility());
    String slug = resolveUniqueSlug(articleId, request.getSlug(), request.getTitle());

    article.setTitle(request.getTitle());
    article.setSlug(slug);
    article.setCoverImage(request.getCoverImage());
    article.setContent(request.getContent());
    article.setHtmlContent(MarkdownUtil.toHtml(request.getContent()));
    article.setVisibility(visibility);
    article.setPassword(request.getPassword());
    article.setPrice(defaultPrice(request.getPrice()));
    article.setCategory(category);
    article.setScheduledAt(request.getScheduledAt());

    String summary = request.getSummary();
    if (!StringUtils.hasText(summary)) {
      summary = MarkdownUtil.extractSummary(request.getContent(), 120);
    }
    article.setSummary(summary);

    ArticleStatus oldStatus = article.getStatus();
    article.setStatus(status);
    if (oldStatus != ArticleStatus.PUBLISHED && status == ArticleStatus.PUBLISHED) {
      article.setPublishedAt(LocalDateTime.now());
    }

    articleRepository.save(article);
    saveTags(article, request.getTagIds());
    return getArticleDetail(userId, articleId);
  }

  @Override
  public void deleteArticle(Long userId, Long articleId) {
    Article article = articleRepository.findById(articleId).orElseThrow(() -> new BusinessException("ARTICLE_NOT_FOUND", "文章不存在"));
    if (!Objects.equals(article.getAuthor().getId(), userId)) {
      throw new BusinessException("FORBIDDEN", "无权删除该文章");
    }
    article.setStatus(ArticleStatus.DELETED);
    article.setDeletedAt(LocalDateTime.now());
    articleRepository.save(article);
  }

  @Override
  @Transactional(readOnly = true)
  public ArticleResponse getArticleDetail(Long viewerUserId, Long articleId) {
    Article article = articleRepository.findById(articleId).orElseThrow(() -> new BusinessException("ARTICLE_NOT_FOUND", "文章不存在"));
    if (article.getStatus() == ArticleStatus.DELETED) {
      throw new BusinessException("ARTICLE_DELETED", "文章已删除");
    }
    if (!canViewArticle(viewerUserId, article)) {
      throw new BusinessException("FORBIDDEN", "无权访问该文章");
    }

    List<Long> tagIds = articleTagRepository.findTagIdsByArticleId(articleId);
    List<Tag> tags = tagIds.isEmpty() ? List.of() : tagRepository.findAllById(tagIds);

    Boolean liked = false;
    Boolean collected = false;
    if (viewerUserId != null) {
      liked = articleLikeRepository.findByArticle_IdAndUser_Id(articleId, viewerUserId).isPresent();
      collected = articleCollectionRepository.findByArticle_IdAndUser_Id(articleId, viewerUserId).isPresent();
    }

    return ArticleResponse.builder()
        .id(article.getId())
        .title(article.getTitle())
        .slug(article.getSlug())
        .coverImage(article.getCoverImage())
        .summary(article.getSummary())
        .content(article.getContent())
        .htmlContent(article.getHtmlContent())
        .status(article.getStatus().name())
        .visibility(article.getVisibility().name())
        .category(toCategoryDTO(article.getCategory()))
        .tags(tags.stream().map(this::toTagDTO).collect(Collectors.toList()))
        .author(toAuthorDTO(article.getAuthor()))
        .viewCount(article.getViewCount())
        .likeCount(article.getLikeCount())
        .collectCount(article.getCollectCount())
        .commentCount(article.getCommentCount())
        .publishedAt(article.getPublishedAt())
        .createdAt(article.getCreatedAt())
        .updatedAt(article.getUpdatedAt())
        .liked(liked)
        .collected(collected)
        .build();
  }

  @Override
  @Transactional(readOnly = true)
  public PageResponse<ArticleListItem> listArticles(
      Long viewerUserId,
      int page,
      int size,
      String sortBy,
      String order,
      String status,
      Long categoryId,
      Long tagId,
      Long userId,
      String keyword) {
    Pageable pageable = PageRequest.of(Math.max(page - 1, 0), Math.max(size, 1), buildSort(sortBy, order));

    Specification<Article> spec =
        (root, query, cb) -> {
          List<jakarta.persistence.criteria.Predicate> predicates = new ArrayList<>();
          predicates.add(cb.notEqual(root.get("status"), ArticleStatus.DELETED));

          if (StringUtils.hasText(keyword)) {
            String like = "%" + keyword.trim() + "%";
            predicates.add(cb.or(cb.like(root.get("title"), like), cb.like(root.get("summary"), like)));
          }
          if (categoryId != null) {
            predicates.add(cb.equal(root.get("category").get("id"), categoryId));
          }
          if (userId != null) {
            predicates.add(cb.equal(root.get("author").get("id"), userId));
          }
          if (tagId != null) {
            var subquery = query.subquery(Long.class);
            var articleTag = subquery.from(ArticleTag.class);
            subquery.select(articleTag.get("id"));
            subquery.where(
                cb.equal(articleTag.get("article").get("id"), root.get("id")),
                cb.equal(articleTag.get("tag").get("id"), tagId));
            predicates.add(cb.exists(subquery));
          }

          ArticleStatus statusEnum = resolveStatusNullable(status);
          if (statusEnum != null) {
            predicates.add(cb.equal(root.get("status"), statusEnum));
          }

          boolean selfQuery = viewerUserId != null && userId != null && Objects.equals(viewerUserId, userId);
          if (!selfQuery) {
            predicates.add(cb.equal(root.get("status"), ArticleStatus.PUBLISHED));
            predicates.add(cb.equal(root.get("visibility"), ArticleVisibility.PUBLIC));
          }

          return cb.and(predicates.toArray(new jakarta.persistence.criteria.Predicate[0]));
        };

    Page<Article> articlePage = articleRepository.findAll(spec, pageable);
    List<Article> articles = articlePage.getContent();
    Map<Long, List<TagDTO>> tagsMap = loadTagsMap(articles);

    List<ArticleListItem> list =
        articles.stream()
            .map(
                a ->
                    ArticleListItem.builder()
                        .id(a.getId())
                        .title(a.getTitle())
                        .slug(a.getSlug())
                        .coverImage(a.getCoverImage())
                        .summary(a.getSummary())
                        .status(a.getStatus().name())
                        .visibility(a.getVisibility().name())
                        .author(toAuthorDTO(a.getAuthor()))
                        .category(toCategoryDTO(a.getCategory()))
                        .tags(tagsMap.getOrDefault(a.getId(), List.of()))
                        .viewCount(a.getViewCount())
                        .likeCount(a.getLikeCount())
                        .commentCount(a.getCommentCount())
                        .publishedAt(a.getPublishedAt())
                        .createdAt(a.getCreatedAt())
                        .build())
            .collect(Collectors.toList());

    return PageResponse.<ArticleListItem>builder()
        .page(page)
        .size(size)
        .total(articlePage.getTotalElements())
        .list(list)
        .build();
  }

  @Override
  @Transactional(readOnly = true)
  public PageResponse<ArticleListItem> listDrafts(Long userId, int page, int size) {
    Pageable pageable = PageRequest.of(Math.max(page - 1, 0), Math.max(size, 1), Sort.by(Sort.Direction.DESC, "updatedAt"));
    Page<Article> articlePage = articleRepository.findByAuthorIdAndStatus(userId, ArticleStatus.DRAFT, pageable);
    Map<Long, List<TagDTO>> tagsMap = loadTagsMap(articlePage.getContent());

    List<ArticleListItem> list =
        articlePage.getContent().stream()
            .map(
                a ->
                    ArticleListItem.builder()
                        .id(a.getId())
                        .title(a.getTitle())
                        .slug(a.getSlug())
                        .coverImage(a.getCoverImage())
                        .summary(a.getSummary())
                        .status(a.getStatus().name())
                        .visibility(a.getVisibility().name())
                        .author(toAuthorDTO(a.getAuthor()))
                        .category(toCategoryDTO(a.getCategory()))
                        .tags(tagsMap.getOrDefault(a.getId(), List.of()))
                        .viewCount(a.getViewCount())
                        .likeCount(a.getLikeCount())
                        .commentCount(a.getCommentCount())
                        .publishedAt(a.getPublishedAt())
                        .createdAt(a.getCreatedAt())
                        .build())
            .collect(Collectors.toList());

    return PageResponse.<ArticleListItem>builder()
        .page(page)
        .size(size)
        .total(articlePage.getTotalElements())
        .list(list)
        .build();
  }

  @Override
  @Transactional(readOnly = true)
  public List<ArticleListItem> trending(int limit) {
    Pageable pageable = PageRequest.of(0, Math.max(limit, 1), Sort.by(Sort.Direction.DESC, "viewCount"));
    PageResponse<ArticleListItem> page =
        listArticles(null, 1, pageable.getPageSize(), "viewCount", "desc", "PUBLISHED", null, null, null, null);
    return page.getList();
  }

  @Override
  @Transactional(readOnly = true)
  public PageResponse<ArticleListItem> search(Long viewerUserId, String keyword, int page, int size) {
    return listArticles(viewerUserId, page, size, "publishedAt", "desc", "PUBLISHED", null, null, null, keyword);
  }

  @Override
  @Transactional(readOnly = true)
  public List<ArticleListItem> related(Long viewerUserId, Long articleId, int limit) {
    List<Long> tagIds = articleTagRepository.findTagIdsByArticleId(articleId);
    if (tagIds.isEmpty()) {
      return List.of();
    }
    List<Article> related = articleRepository.findRelatedPublic(articleId, tagIds, PageRequest.of(0, Math.max(limit, 1)));
    Map<Long, List<TagDTO>> tagsMap = loadTagsMap(related);
    return related.stream()
        .map(
            a ->
                ArticleListItem.builder()
                    .id(a.getId())
                    .title(a.getTitle())
                    .slug(a.getSlug())
                    .coverImage(a.getCoverImage())
                    .summary(a.getSummary())
                    .status(a.getStatus().name())
                    .visibility(a.getVisibility().name())
                    .author(toAuthorDTO(a.getAuthor()))
                    .category(toCategoryDTO(a.getCategory()))
                    .tags(tagsMap.getOrDefault(a.getId(), List.of()))
                    .viewCount(a.getViewCount())
                    .likeCount(a.getLikeCount())
                    .commentCount(a.getCommentCount())
                    .publishedAt(a.getPublishedAt())
                    .createdAt(a.getCreatedAt())
                    .build())
        .collect(Collectors.toList());
  }

  @Override
  public ArticleResponse toggleLike(Long userId, Long articleId) {
    Article article = articleRepository.findById(articleId).orElseThrow(() -> new BusinessException("ARTICLE_NOT_FOUND", "文章不存在"));
    if (article.getStatus() != ArticleStatus.PUBLISHED || article.getVisibility() != ArticleVisibility.PUBLIC) {
      throw new BusinessException("FORBIDDEN", "仅支持对公开发布的文章点赞");
    }

    ArticleLike like = articleLikeRepository.findByArticle_IdAndUser_Id(articleId, userId).orElse(null);
    if (like != null) {
      articleLikeRepository.delete(like);
    } else {
      User user = userRepository.findById(userId).orElseThrow(() -> new BusinessException("USER_NOT_FOUND", "用户不存在"));
      articleLikeRepository.save(ArticleLike.builder().article(article).user(user).build());
    }
    article.setLikeCount(articleLikeRepository.countByArticle_Id(articleId));
    articleRepository.save(article);
    return getArticleDetail(userId, articleId);
  }

  @Override
  public ArticleResponse toggleCollect(Long userId, Long articleId) {
    Article article = articleRepository.findById(articleId).orElseThrow(() -> new BusinessException("ARTICLE_NOT_FOUND", "文章不存在"));
    if (article.getStatus() != ArticleStatus.PUBLISHED || article.getVisibility() != ArticleVisibility.PUBLIC) {
      throw new BusinessException("FORBIDDEN", "仅支持对公开发布的文章收藏");
    }

    ArticleCollection collection = articleCollectionRepository.findByArticle_IdAndUser_Id(articleId, userId).orElse(null);
    if (collection != null) {
      articleCollectionRepository.delete(collection);
    } else {
      User user = userRepository.findById(userId).orElseThrow(() -> new BusinessException("USER_NOT_FOUND", "用户不存在"));
      articleCollectionRepository.save(ArticleCollection.builder().article(article).user(user).build());
    }
    article.setCollectCount(articleCollectionRepository.countByArticle_Id(articleId));
    articleRepository.save(article);
    return getArticleDetail(userId, articleId);
  }

  @Override
  public void recordView(Long viewerUserId, Long articleId, ArticleViewRequest request) {
    Article article = articleRepository.findById(articleId).orElseThrow(() -> new BusinessException("ARTICLE_NOT_FOUND", "文章不存在"));
    if (article.getStatus() == ArticleStatus.DELETED) {
      throw new BusinessException("ARTICLE_DELETED", "文章已删除");
    }
    if (article.getStatus() != ArticleStatus.PUBLISHED || article.getVisibility() != ArticleVisibility.PUBLIC) {
      return;
    }

    article.setViewCount((article.getViewCount() == null ? 0L : article.getViewCount()) + 1);
    articleRepository.save(article);

    if (viewerUserId == null) {
      return;
    }

    ArticleReadHistory history = articleReadHistoryRepository.findByArticle_IdAndUser_Id(articleId, viewerUserId).orElse(null);
    if (history == null) {
      User user = userRepository.findById(viewerUserId).orElseThrow(() -> new BusinessException("USER_NOT_FOUND", "用户不存在"));
      history = ArticleReadHistory.builder().article(article).user(user).build();
    }
    if (request != null) {
      if (request.getProgress() != null) {
        history.setProgress(request.getProgress());
      }
      if (request.getLastPosition() != null) {
        history.setLastPosition(request.getLastPosition());
      }
      if (request.getReadDuration() != null) {
        history.setReadDuration(request.getReadDuration());
      }
    }
    history.setLastReadAt(LocalDateTime.now());
    articleReadHistoryRepository.save(history);
  }

  private boolean canViewArticle(Long viewerUserId, Article article) {
    if (article.getStatus() == ArticleStatus.PUBLISHED && article.getVisibility() == ArticleVisibility.PUBLIC) {
      return true;
    }
    return viewerUserId != null && Objects.equals(viewerUserId, article.getAuthor().getId());
  }

  private Category resolveCategory(Long categoryId) {
    if (categoryId == null) {
      return null;
    }
    return categoryRepository.findById(categoryId).orElseThrow(() -> new BusinessException("CATEGORY_NOT_FOUND", "分类不存在"));
  }

  private ArticleStatus resolveStatus(String status) {
    ArticleStatus s = resolveStatusNullable(status);
    return s == null ? ArticleStatus.DRAFT : s;
  }

  private ArticleStatus resolveStatusNullable(String status) {
    if (!StringUtils.hasText(status)) {
      return null;
    }
    try {
      return ArticleStatus.valueOf(status.trim().toUpperCase());
    } catch (Exception e) {
      throw new BusinessException("INVALID_STATUS", "文章状态不合法");
    }
  }

  private ArticleVisibility resolveVisibility(String visibility) {
    if (!StringUtils.hasText(visibility)) {
      return ArticleVisibility.PUBLIC;
    }
    try {
      return ArticleVisibility.valueOf(visibility.trim().toUpperCase());
    } catch (Exception e) {
      throw new BusinessException("INVALID_VISIBILITY", "文章可见性不合法");
    }
  }

  private BigDecimal defaultPrice(BigDecimal price) {
    return price == null ? BigDecimal.ZERO : price;
  }

  private Sort buildSort(String sortBy, String order) {
    String field;
    if (!StringUtils.hasText(sortBy)) {
      field = "createdAt";
    } else {
      String s = sortBy.trim();
      field =
          switch (s) {
            case "publishedAt", "published_at" -> "publishedAt";
            case "viewCount", "view_count" -> "viewCount";
            case "likeCount", "like_count" -> "likeCount";
            case "commentCount", "comment_count" -> "commentCount";
            default -> "createdAt";
          };
    }
    Sort.Direction direction = "asc".equalsIgnoreCase(order) ? Sort.Direction.ASC : Sort.Direction.DESC;
    return Sort.by(direction, field);
  }

  private String resolveUniqueSlug(Long articleId, String slug, String title) {
    String base = StringUtils.hasText(slug) ? SlugUtil.toSlug(slug) : SlugUtil.toSlug(title);
    String candidate = base;
    int i = 1;
    while (true) {
      Article existing = articleRepository.findBySlug(candidate).orElse(null);
      if (existing == null || (articleId != null && Objects.equals(existing.getId(), articleId))) {
        return candidate;
      }
      candidate = base + "-" + i;
      i++;
      if (i > 1000) {
        throw new BusinessException("SLUG_CONFLICT", "slug 冲突，请修改标题或自定义 slug");
      }
    }
  }

  private void saveTags(Article article, List<Long> tagIds) {
    articleTagRepository.deleteByArticle_Id(article.getId());
    if (tagIds == null || tagIds.isEmpty()) {
      return;
    }
    List<Tag> tags = tagRepository.findAllById(tagIds);
    Set<Long> found = tags.stream().map(Tag::getId).collect(Collectors.toSet());
    for (Long id : tagIds) {
      if (!found.contains(id)) {
        throw new BusinessException("TAG_NOT_FOUND", "标签不存在: " + id);
      }
    }
    for (Tag tag : tags) {
      articleTagRepository.save(ArticleTag.builder().article(article).tag(tag).build());
    }
  }

  private Map<Long, List<TagDTO>> loadTagsMap(List<Article> articles) {
    if (articles == null || articles.isEmpty()) {
      return Map.of();
    }
    List<Long> articleIds = articles.stream().map(Article::getId).collect(Collectors.toList());
    List<ArticleTag> articleTags = articleTagRepository.findWithTagByArticleIdIn(articleIds);
    Map<Long, List<TagDTO>> map = new HashMap<>();
    for (ArticleTag at : articleTags) {
      map.computeIfAbsent(at.getArticle().getId(), k -> new ArrayList<>()).add(toTagDTO(at.getTag()));
    }
    return map;
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

  private CategoryDTO toCategoryDTO(Category category) {
    if (category == null) {
      return null;
    }
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

  private UserDTO toAuthorDTO(User user) {
    List<String> roles = user.getRoles() == null ? List.of() : user.getRoles().stream().map(r -> r.getRoleCode()).toList();
    return UserDTO.builder()
        .id(user.getId())
        .username(user.getUsername())
        .email(user.getEmail())
        .displayName(user.getDisplayName())
        .avatarUrl(user.getAvatarUrl())
        .bio(user.getBio())
        .roles(roles)
        .createdAt(user.getCreatedAt())
        .build();
  }
}

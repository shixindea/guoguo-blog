package com.guoguo.blog.backend.service;

import com.guoguo.blog.backend.dto.ArticleListItem;
import com.guoguo.blog.backend.dto.CategoryDTO;
import com.guoguo.blog.backend.dto.CollectionItemDTO;
import com.guoguo.blog.backend.dto.PageResponse;
import com.guoguo.blog.backend.dto.UserDTO;
import com.guoguo.blog.backend.entity.Article;
import com.guoguo.blog.backend.entity.ArticleCollection;
import com.guoguo.blog.backend.entity.Category;
import com.guoguo.blog.backend.entity.User;
import com.guoguo.blog.backend.repository.ArticleCollectionRepository;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class CollectionServiceImpl implements CollectionService {
  private final ArticleCollectionRepository articleCollectionRepository;

  @Override
  public PageResponse<CollectionItemDTO> listMyCollections(Long userId, int page, int size) {
    Page<ArticleCollection> p =
        articleCollectionRepository.findByUser_IdOrderByCreatedAtDesc(
            userId, PageRequest.of(Math.max(page - 1, 0), Math.max(size, 1), Sort.by(Sort.Direction.DESC, "createdAt")));

    List<CollectionItemDTO> list =
        p.getContent().stream()
            .map(
                c ->
                    CollectionItemDTO.builder()
                        .id(c.getId())
                        .collectedAt(c.getCreatedAt())
                        .article(toArticleListItem(c.getArticle()))
                        .build())
            .toList();

    return PageResponse.<CollectionItemDTO>builder()
        .page(page)
        .size(size)
        .total(p.getTotalElements())
        .list(list)
        .build();
  }

  @Override
  @Transactional
  public void removeMyCollection(Long userId, Long articleId) {
    articleCollectionRepository.deleteByArticle_IdAndUser_Id(articleId, userId);
  }

  private ArticleListItem toArticleListItem(Article a) {
    return ArticleListItem.builder()
        .id(a.getId())
        .title(a.getTitle())
        .slug(a.getSlug())
        .coverImage(a.getCoverImage())
        .summary(a.getSummary())
        .status(a.getStatus() == null ? null : a.getStatus().name())
        .visibility(a.getVisibility() == null ? null : a.getVisibility().name())
        .author(toUserDTO(a.getAuthor()))
        .category(toCategoryDTO(a.getCategory()))
        .tags(List.of())
        .viewCount(a.getViewCount())
        .likeCount(a.getLikeCount())
        .commentCount(a.getCommentCount())
        .publishedAt(a.getPublishedAt())
        .createdAt(a.getCreatedAt())
        .build();
  }

  private UserDTO toUserDTO(User u) {
    if (u == null) return null;
    return UserDTO.builder()
        .id(u.getId())
        .username(u.getUsername())
        .email(u.getEmail())
        .displayName(u.getDisplayName())
        .avatarUrl(u.getAvatarUrl())
        .bio(u.getBio())
        .build();
  }

  private CategoryDTO toCategoryDTO(Category c) {
    if (c == null) return null;
    return CategoryDTO.builder()
        .id(c.getId())
        .name(c.getName())
        .slug(c.getSlug())
        .description(c.getDescription())
        .icon(c.getIcon())
        .color(c.getColor())
        .sortOrder(c.getSortOrder())
        .parentId(c.getParent() == null ? null : c.getParent().getId())
        .level(c.getLevel())
        .articleCount(c.getArticleCount())
        .system(c.getSystem())
        .enabled(c.getEnabled())
        .createdAt(c.getCreatedAt())
        .build();
  }
}


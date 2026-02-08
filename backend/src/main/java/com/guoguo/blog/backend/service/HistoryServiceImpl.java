package com.guoguo.blog.backend.service;

import com.guoguo.blog.backend.dto.ArticleListItem;
import com.guoguo.blog.backend.dto.CategoryDTO;
import com.guoguo.blog.backend.dto.HistoryItemDTO;
import com.guoguo.blog.backend.dto.PageResponse;
import com.guoguo.blog.backend.dto.UserDTO;
import com.guoguo.blog.backend.entity.Article;
import com.guoguo.blog.backend.entity.ArticleReadHistory;
import com.guoguo.blog.backend.entity.Category;
import com.guoguo.blog.backend.entity.User;
import com.guoguo.blog.backend.exception.BusinessException;
import com.guoguo.blog.backend.repository.ArticleReadHistoryRepository;
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
public class HistoryServiceImpl implements HistoryService {
  private final ArticleReadHistoryRepository articleReadHistoryRepository;

  @Override
  public PageResponse<HistoryItemDTO> listMyHistory(Long userId, int page, int size) {
    Page<ArticleReadHistory> p =
        articleReadHistoryRepository.findByUser_IdOrderByLastReadAtDesc(
            userId, PageRequest.of(Math.max(page - 1, 0), Math.max(size, 1), Sort.by(Sort.Direction.DESC, "lastReadAt")));

    List<HistoryItemDTO> list =
        p.getContent().stream()
            .map(
                h ->
                    HistoryItemDTO.builder()
                        .id(h.getId())
                        .progress(h.getProgress())
                        .lastReadAt(h.getLastReadAt())
                        .article(toArticleListItem(h.getArticle()))
                        .build())
            .toList();

    return PageResponse.<HistoryItemDTO>builder()
        .page(page)
        .size(size)
        .total(p.getTotalElements())
        .list(list)
        .build();
  }

  @Override
  @Transactional
  public void removeMyHistory(Long userId, Long historyId) {
    ArticleReadHistory h =
        articleReadHistoryRepository
            .findByIdAndUser_Id(historyId, userId)
            .orElseThrow(() -> new BusinessException("HISTORY_NOT_FOUND", "历史记录不存在"));
    articleReadHistoryRepository.delete(h);
  }

  @Override
  @Transactional
  public void clearMyHistory(Long userId) {
    articleReadHistoryRepository.deleteByUser_Id(userId);
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


package com.guoguo.blog.backend.service;

import com.guoguo.blog.backend.dto.ArticleListItem;
import com.guoguo.blog.backend.dto.ArticleRequest;
import com.guoguo.blog.backend.dto.ArticleResponse;
import com.guoguo.blog.backend.dto.ArticleViewRequest;
import com.guoguo.blog.backend.dto.PageResponse;
import java.util.List;

public interface ArticleService {
  ArticleResponse createArticle(Long userId, ArticleRequest request);

  ArticleResponse updateArticle(Long userId, Long articleId, ArticleRequest request);

  void deleteArticle(Long userId, Long articleId);

  ArticleResponse getArticleDetail(Long viewerUserId, Long articleId);

  PageResponse<ArticleListItem> listArticles(
      Long viewerUserId,
      int page,
      int size,
      String sortBy,
      String order,
      String status,
      Long categoryId,
      Long tagId,
      Long userId,
      String keyword);

  PageResponse<ArticleListItem> listDrafts(Long userId, int page, int size);

  List<ArticleListItem> trending(int limit);

  PageResponse<ArticleListItem> search(Long viewerUserId, String keyword, int page, int size);

  List<ArticleListItem> related(Long viewerUserId, Long articleId, int limit);

  ArticleResponse toggleLike(Long userId, Long articleId);

  ArticleResponse toggleCollect(Long userId, Long articleId);

  void recordView(Long viewerUserId, Long articleId, ArticleViewRequest request);
}


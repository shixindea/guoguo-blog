package com.guoguo.blog.backend.service;

import com.guoguo.blog.backend.dto.DashboardOverviewDTO;
import com.guoguo.blog.backend.entity.ArticleStatus;
import com.guoguo.blog.backend.repository.ArticleCollectionRepository;
import com.guoguo.blog.backend.repository.ArticleReadHistoryRepository;
import com.guoguo.blog.backend.repository.ArticleRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class DashboardServiceImpl implements DashboardService {
  private final ArticleRepository articleRepository;
  private final ArticleCollectionRepository articleCollectionRepository;
  private final ArticleReadHistoryRepository articleReadHistoryRepository;

  @Override
  public DashboardOverviewDTO overview(Long userId) {
    long totalViews = articleRepository.sumViewsByAuthor(userId);
    long totalLikes = articleRepository.sumLikesByAuthor(userId);
    long publishedCount = articleRepository.countByAuthor_IdAndStatus(userId, ArticleStatus.PUBLISHED);
    long draftCount = articleRepository.countByAuthor_IdAndStatus(userId, ArticleStatus.DRAFT);
    long collectionCount = articleCollectionRepository.countByUser_Id(userId);
    long historyCount = articleReadHistoryRepository.countByUser_Id(userId);

    return DashboardOverviewDTO.builder()
        .totalViews(totalViews)
        .totalLikes(totalLikes)
        .followerCount(0L)
        .collectionCount(collectionCount)
        .historyCount(historyCount)
        .publishedCount(publishedCount)
        .draftCount(draftCount)
        .build();
  }
}


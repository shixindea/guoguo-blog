package com.guoguo.blog.backend.repository;

import com.guoguo.blog.backend.entity.ArticleReadHistory;
import java.util.Optional;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ArticleReadHistoryRepository extends JpaRepository<ArticleReadHistory, Long> {
  Optional<ArticleReadHistory> findByArticle_IdAndUser_Id(Long articleId, Long userId);

  Page<ArticleReadHistory> findByUser_IdOrderByLastReadAtDesc(Long userId, Pageable pageable);

  long countByUser_Id(Long userId);

  Optional<ArticleReadHistory> findByIdAndUser_Id(Long id, Long userId);

  void deleteByUser_Id(Long userId);
}

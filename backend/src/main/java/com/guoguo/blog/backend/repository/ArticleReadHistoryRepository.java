package com.guoguo.blog.backend.repository;

import com.guoguo.blog.backend.entity.ArticleReadHistory;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ArticleReadHistoryRepository extends JpaRepository<ArticleReadHistory, Long> {
  Optional<ArticleReadHistory> findByArticle_IdAndUser_Id(Long articleId, Long userId);
}


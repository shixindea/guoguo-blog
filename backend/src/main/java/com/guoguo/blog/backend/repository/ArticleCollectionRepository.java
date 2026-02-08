package com.guoguo.blog.backend.repository;

import com.guoguo.blog.backend.entity.ArticleCollection;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ArticleCollectionRepository extends JpaRepository<ArticleCollection, Long> {
  Optional<ArticleCollection> findByArticle_IdAndUser_Id(Long articleId, Long userId);

  long countByArticle_Id(Long articleId);

  long countByUser_Id(Long userId);

  Page<ArticleCollection> findByUser_IdOrderByCreatedAtDesc(Long userId, Pageable pageable);

  void deleteByArticle_IdAndUser_Id(Long articleId, Long userId);
}

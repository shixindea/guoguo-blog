package com.guoguo.blog.backend.repository;

import com.guoguo.blog.backend.entity.ArticleCollection;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ArticleCollectionRepository extends JpaRepository<ArticleCollection, Long> {
  Optional<ArticleCollection> findByArticle_IdAndUser_Id(Long articleId, Long userId);

  long countByArticle_Id(Long articleId);
}


package com.guoguo.blog.backend.repository;

import com.guoguo.blog.backend.entity.ArticleLike;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ArticleLikeRepository extends JpaRepository<ArticleLike, Long> {
  Optional<ArticleLike> findByArticle_IdAndUser_Id(Long articleId, Long userId);

  long countByArticle_Id(Long articleId);
}


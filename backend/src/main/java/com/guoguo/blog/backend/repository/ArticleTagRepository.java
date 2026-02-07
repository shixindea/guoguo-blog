package com.guoguo.blog.backend.repository;

import com.guoguo.blog.backend.entity.ArticleTag;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface ArticleTagRepository extends JpaRepository<ArticleTag, Long> {
  @Query("select at.tag.id from ArticleTag at where at.article.id = :articleId")
  List<Long> findTagIdsByArticleId(@Param("articleId") Long articleId);

  @Query("select at from ArticleTag at join fetch at.tag where at.article.id in :articleIds")
  List<ArticleTag> findWithTagByArticleIdIn(@Param("articleIds") List<Long> articleIds);

  void deleteByArticle_Id(Long articleId);
}

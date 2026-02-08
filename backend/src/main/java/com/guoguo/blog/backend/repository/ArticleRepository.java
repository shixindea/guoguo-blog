package com.guoguo.blog.backend.repository;

import com.guoguo.blog.backend.entity.Article;
import com.guoguo.blog.backend.entity.ArticleStatus;
import com.guoguo.blog.backend.entity.ArticleVisibility;
import java.util.List;
import java.util.Optional;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface ArticleRepository extends JpaRepository<Article, Long>, JpaSpecificationExecutor<Article> {
  Optional<Article> findBySlug(String slug);

  @Query(
      "select a from Article a where a.id = :id and a.status <> 'DELETED' and a.visibility = :visibility")
  Optional<Article> findPublicById(@Param("id") Long id, @Param("visibility") ArticleVisibility visibility);

  Page<Article> findByAuthorIdAndStatus(Long authorId, ArticleStatus status, Pageable pageable);

  @Query(
      "select distinct a from Article a join ArticleTag at on at.article.id = a.id "
          + "where at.tag.id in :tagIds and a.id <> :articleId and a.status = 'PUBLISHED' and a.visibility = 'PUBLIC' "
          + "order by a.publishedAt desc")
  List<Article> findRelatedPublic(@Param("articleId") Long articleId, @Param("tagIds") List<Long> tagIds, Pageable pageable);

  long countByAuthor_IdAndStatus(Long authorId, ArticleStatus status);

  @Query("select coalesce(sum(a.viewCount), 0) from Article a where a.author.id = :authorId and a.status = 'PUBLISHED'")
  long sumViewsByAuthor(@Param("authorId") Long authorId);

  @Query("select coalesce(sum(a.likeCount), 0) from Article a where a.author.id = :authorId and a.status = 'PUBLISHED'")
  long sumLikesByAuthor(@Param("authorId") Long authorId);
}

package com.guoguo.blog.backend.repository;

import com.guoguo.blog.backend.entity.Tag;
import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;

public interface TagRepository extends JpaRepository<Tag, Long>, JpaSpecificationExecutor<Tag> {
  Optional<Tag> findBySlug(String slug);

  @Query("select t from Tag t order by t.articleCount desc, t.id desc")
  List<Tag> findPopularTop50();

  @Query("select t from Tag t where t.recommended = true and (t.enabled is null or t.enabled = true) order by t.articleCount desc, t.id desc")
  List<Tag> findRecommendedTop50();
}

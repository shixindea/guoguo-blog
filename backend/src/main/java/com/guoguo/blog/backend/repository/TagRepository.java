package com.guoguo.blog.backend.repository;

import com.guoguo.blog.backend.entity.Tag;
import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

public interface TagRepository extends JpaRepository<Tag, Long> {
  Optional<Tag> findBySlug(String slug);

  @Query("select t from Tag t order by t.articleCount desc, t.id desc")
  List<Tag> findPopularTop50();
}


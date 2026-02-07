package com.guoguo.blog.backend.repository;

import com.guoguo.blog.backend.entity.TagFollow;
import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface TagFollowRepository extends JpaRepository<TagFollow, Long> {
  Optional<TagFollow> findByUser_IdAndTag_Id(Long userId, Long tagId);

  long countByTag_Id(Long tagId);

  @Query("select tf.tag.id from TagFollow tf where tf.user.id = :userId")
  List<Long> findTagIdsByUserId(@Param("userId") Long userId);
}

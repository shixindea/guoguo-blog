package com.guoguo.blog.backend.repository;

import com.guoguo.blog.backend.entity.Category;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

public interface CategoryRepository extends JpaRepository<Category, Long>, JpaSpecificationExecutor<Category> {
  Optional<Category> findBySlug(String slug);
}

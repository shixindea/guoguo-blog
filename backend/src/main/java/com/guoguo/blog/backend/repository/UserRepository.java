package com.guoguo.blog.backend.repository;

import com.guoguo.blog.backend.entity.User;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface UserRepository extends JpaRepository<User, Long> {
  Optional<User> findByEmail(String email);

  Optional<User> findByUsername(String username);

  boolean existsByEmail(String email);

  boolean existsByUsername(String username);

  @Query("select u from User u where u.username = :value or u.email = :value")
  Optional<User> findByUsernameOrEmail(@Param("value") String value);
}


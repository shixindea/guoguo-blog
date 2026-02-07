package com.guoguo.blog.backend.repository;

import com.guoguo.blog.backend.entity.UserRole;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface UserRoleRepository extends JpaRepository<UserRole, Long> {
  @Query("select ur.roleCode from UserRole ur where ur.user.id = :userId")
  List<String> findRoleCodesByUserId(@Param("userId") Long userId);
}


package com.guoguo.blog.backend.repository;

import com.guoguo.blog.backend.entity.UserCheckinStats;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UserCheckinStatsRepository extends JpaRepository<UserCheckinStats, Long> {
  Optional<UserCheckinStats> findByUser_Id(Long userId);
}


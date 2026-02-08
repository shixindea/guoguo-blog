package com.guoguo.blog.backend.service;

import com.guoguo.blog.backend.dto.DashboardOverviewDTO;

public interface DashboardService {
  DashboardOverviewDTO overview(Long userId);
}


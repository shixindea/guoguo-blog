package com.guoguo.blog.backend.service;

import com.guoguo.blog.backend.dto.HistoryItemDTO;
import com.guoguo.blog.backend.dto.PageResponse;

public interface HistoryService {
  PageResponse<HistoryItemDTO> listMyHistory(Long userId, int page, int size);

  void removeMyHistory(Long userId, Long historyId);

  void clearMyHistory(Long userId);
}


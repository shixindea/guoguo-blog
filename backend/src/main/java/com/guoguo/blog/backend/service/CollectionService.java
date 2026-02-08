package com.guoguo.blog.backend.service;

import com.guoguo.blog.backend.dto.CollectionItemDTO;
import com.guoguo.blog.backend.dto.PageResponse;

public interface CollectionService {
  PageResponse<CollectionItemDTO> listMyCollections(Long userId, int page, int size);

  void removeMyCollection(Long userId, Long articleId);
}


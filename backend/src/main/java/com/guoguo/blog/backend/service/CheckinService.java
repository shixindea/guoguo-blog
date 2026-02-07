package com.guoguo.blog.backend.service;

import com.guoguo.blog.backend.dto.CheckinCalendarDTO;
import com.guoguo.blog.backend.dto.CheckinRequest;
import com.guoguo.blog.backend.dto.CheckinResultDTO;
import com.guoguo.blog.backend.dto.CheckinStatusDTO;

public interface CheckinService {
  CheckinResultDTO checkin(Long userId, CheckinRequest request, String ipAddress);

  CheckinStatusDTO status(Long userId);

  CheckinCalendarDTO calendar(Long userId, String yearMonth);
}


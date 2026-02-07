package com.guoguo.blog.backend.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import java.util.List;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Schema(description = "签到日历数据")
public class CheckinCalendarDTO {
  @Schema(description = "年份")
  private int year;

  @Schema(description = "月份（1-12）")
  private int month;

  @Schema(description = "本月已签到日期列表（1-31）")
  private List<Integer> checkinDays;

  @Schema(description = "本月签到天数")
  private int monthDays;

  @Schema(description = "本月获得积分")
  private int monthPoints;

  @Schema(description = "当前连续签到天数")
  private int currentStreak;
}


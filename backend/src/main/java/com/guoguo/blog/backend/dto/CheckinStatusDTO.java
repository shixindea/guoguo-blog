package com.guoguo.blog.backend.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import java.time.LocalDate;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Schema(description = "签到状态")
public class CheckinStatusDTO {
  @Schema(description = "今日是否已签到")
  private boolean todayChecked;

  @Schema(description = "当前连续签到天数")
  private int currentStreak;

  @Schema(description = "最长连续签到天数")
  private int longestStreak;

  @Schema(description = "总签到天数")
  private int totalCheckinDays;

  @Schema(description = "累计获得积分")
  private int totalPointsEarned;

  @Schema(description = "本月签到天数")
  private int currentMonthDays;

  @Schema(description = "本月获得积分")
  private int currentMonthPoints;

  @Schema(description = "可用补签卡数量")
  private int makeupCardsAvailable;

  @Schema(description = "最后签到日期")
  private LocalDate lastCheckinDate;
}


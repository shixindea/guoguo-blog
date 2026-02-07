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
@Schema(description = "签到结果")
public class CheckinResultDTO {
  @Schema(description = "签到日期")
  private LocalDate checkinDate;

  @Schema(description = "基础积分")
  private int basePoints;

  @Schema(description = "额外奖励积分")
  private int extraPoints;

  @Schema(description = "本次获得总积分")
  private int totalPoints;

  @Schema(description = "奖励类型：NORMAL, CONTINUOUS, SPECIAL, MILESTONE")
  private String rewardType;

  @Schema(description = "连续签到天数")
  private int continuousDays;

  @Schema(description = "当前可用补签卡数量")
  private int makeupCardsAvailable;

  @Schema(description = "签到状态汇总")
  private CheckinStatusDTO status;
}


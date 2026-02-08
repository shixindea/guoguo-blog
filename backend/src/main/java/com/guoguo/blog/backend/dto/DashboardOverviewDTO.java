package com.guoguo.blog.backend.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Schema(description = "控制台数据概览")
public class DashboardOverviewDTO {
  @Schema(description = "文章总阅读数（发布文章累计）")
  private long totalViews;

  @Schema(description = "获得点赞数（发布文章累计）")
  private long totalLikes;

  @Schema(description = "粉丝数（当前版本未实现关注体系时为0）")
  private long followerCount;

  @Schema(description = "收藏文章数（当前用户收藏总数）")
  private long collectionCount;

  @Schema(description = "浏览历史条数")
  private long historyCount;

  @Schema(description = "已发布文章数")
  private long publishedCount;

  @Schema(description = "草稿文章数")
  private long draftCount;
}


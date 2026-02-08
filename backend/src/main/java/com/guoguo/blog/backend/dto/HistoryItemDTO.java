package com.guoguo.blog.backend.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Schema(description = "浏览历史列表项")
public class HistoryItemDTO {
  @Schema(description = "历史记录ID")
  private Long id;

  @Schema(description = "阅读进度（0-100）")
  private BigDecimal progress;

  @Schema(description = "最近阅读时间")
  private LocalDateTime lastReadAt;

  @Schema(description = "文章信息")
  private ArticleListItem article;
}


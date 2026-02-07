package com.guoguo.blog.backend.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import java.math.BigDecimal;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Schema(description = "阅读记录请求")
public class ArticleViewRequest {
  @Schema(description = "阅读进度（0-100）", example = "65.5")
  private BigDecimal progress;

  @Schema(description = "最后阅读位置（字符位置）", example = "1024")
  private Integer lastPosition;

  @Schema(description = "阅读时长（秒）", example = "120")
  private Integer readDuration;
}


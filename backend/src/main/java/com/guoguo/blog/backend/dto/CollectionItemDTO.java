package com.guoguo.blog.backend.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import java.time.LocalDateTime;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Schema(description = "收藏列表项")
public class CollectionItemDTO {
  @Schema(description = "收藏记录ID")
  private Long id;

  @Schema(description = "收藏时间")
  private LocalDateTime collectedAt;

  @Schema(description = "文章信息")
  private ArticleListItem article;
}


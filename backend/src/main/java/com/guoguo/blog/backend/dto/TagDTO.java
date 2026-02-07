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
@Schema(description = "标签信息")
public class TagDTO {
  @Schema(description = "标签ID")
  private Long id;

  @Schema(description = "标签名称")
  private String name;

  @Schema(description = "标签slug")
  private String slug;

  @Schema(description = "标签描述")
  private String description;

  @Schema(description = "标签图标")
  private String icon;

  @Schema(description = "标签颜色")
  private String color;

  @Schema(description = "文章数")
  private Integer articleCount;

  @Schema(description = "是否推荐")
  private Boolean recommended;

  @Schema(description = "创建时间")
  private LocalDateTime createdAt;
}


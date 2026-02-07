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
@Schema(description = "分类信息")
public class CategoryDTO {
  @Schema(description = "分类ID")
  private Long id;

  @Schema(description = "分类名称")
  private String name;

  @Schema(description = "分类slug")
  private String slug;

  @Schema(description = "分类描述")
  private String description;

  @Schema(description = "分类图标")
  private String icon;

  @Schema(description = "排序")
  private Integer sortOrder;

  @Schema(description = "父分类ID")
  private Long parentId;

  @Schema(description = "文章数")
  private Integer articleCount;

  @Schema(description = "创建时间")
  private LocalDateTime createdAt;
}


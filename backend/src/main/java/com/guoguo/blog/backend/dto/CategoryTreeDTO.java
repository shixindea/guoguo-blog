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
@Schema(description = "分类树节点")
public class CategoryTreeDTO {
  @Schema(description = "分类ID")
  private Long id;

  @Schema(description = "分类名称")
  private String name;

  @Schema(description = "分类slug")
  private String slug;

  @Schema(description = "分类图标")
  private String icon;

  @Schema(description = "分类颜色")
  private String color;

  @Schema(description = "排序")
  private Integer sortOrder;

  @Schema(description = "文章数")
  private Integer articleCount;

  @Schema(description = "是否启用")
  private Boolean enabled;

  @Schema(description = "子分类")
  private List<CategoryTreeDTO> children;
}

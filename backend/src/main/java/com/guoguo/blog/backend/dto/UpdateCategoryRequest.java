package com.guoguo.blog.backend.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Schema(description = "更新分类请求")
public class UpdateCategoryRequest {
  @Size(min = 2, max = 50, message = "分类名称长度2-50位")
  @Schema(description = "分类名称")
  private String name;

  @Pattern(regexp = "^[a-z0-9-]+$", message = "分类标识只能包含小写字母、数字和连字符")
  @Schema(description = "分类slug")
  private String slug;

  @Schema(description = "描述")
  private String description;

  @Schema(description = "图标")
  private String icon;

  @Schema(description = "颜色")
  private String color;

  @Schema(description = "排序")
  private Integer sortOrder;

  @Schema(description = "父分类ID")
  private Long parentId;

  @Schema(description = "是否启用")
  private Boolean enabled;

  @Schema(description = "是否系统分类")
  private Boolean system;
}

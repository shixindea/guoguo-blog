package com.guoguo.blog.backend.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotBlank;
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
@Schema(description = "创建标签请求")
public class CreateTagRequest {
  @NotBlank(message = "标签名称不能为空")
  @Size(min = 1, max = 50, message = "标签名称长度1-50位")
  @Schema(description = "标签名称")
  private String name;

  @NotBlank(message = "标签标识不能为空")
  @Pattern(regexp = "^[a-z0-9-]+$", message = "标签标识只能包含小写字母、数字和连字符")
  @Schema(description = "标签slug")
  private String slug;

  @Schema(description = "描述")
  private String description;

  @Schema(description = "图标")
  private String icon;

  @Schema(description = "颜色")
  private String color;

  @Schema(description = "样式")
  private String style;

  @Schema(description = "是否推荐")
  private Boolean recommended;

  @Schema(description = "是否热门")
  private Boolean hot;

  @Schema(description = "是否启用")
  private Boolean enabled;
}

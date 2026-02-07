package com.guoguo.blog.backend.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Schema(description = "文章创建/更新请求")
public class ArticleRequest {
  @NotBlank(message = "标题不能为空")
  @Size(max = 200, message = "标题长度不能超过200")
  @Schema(description = "文章标题")
  private String title;

  @Schema(description = "文章slug（URL友好标识），不传则自动生成")
  private String slug;

  @Schema(description = "封面图URL")
  private String coverImage;

  @Schema(description = "文章摘要，不传则自动从正文提取")
  private String summary;

  @NotBlank(message = "正文不能为空")
  @Schema(description = "文章内容（Markdown）")
  private String content;

  @Schema(description = "文章状态：DRAFT, PUBLISHED, PRIVATE")
  private String status;

  @Schema(description = "可见性：PUBLIC, PRIVATE, PASSWORD, PAID")
  private String visibility;

  @Schema(description = "访问密码（visibility=PASSWORD）")
  private String password;

  @Schema(description = "价格（visibility=PAID）")
  private BigDecimal price;

  @Schema(description = "分类ID")
  private Long categoryId;

  @Schema(description = "标签ID列表")
  private List<Long> tagIds;

  @Schema(description = "定时发布时间")
  private LocalDateTime scheduledAt;
}


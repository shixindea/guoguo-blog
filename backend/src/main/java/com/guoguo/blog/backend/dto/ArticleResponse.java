package com.guoguo.blog.backend.dto;

import io.swagger.v3.oas.annotations.media.Schema;
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
@Schema(description = "文章详情响应")
public class ArticleResponse {
  @Schema(description = "文章ID")
  private Long id;

  @Schema(description = "标题")
  private String title;

  @Schema(description = "slug")
  private String slug;

  @Schema(description = "封面图")
  private String coverImage;

  @Schema(description = "摘要")
  private String summary;

  @Schema(description = "正文（Markdown）")
  private String content;

  @Schema(description = "HTML内容")
  private String htmlContent;

  @Schema(description = "状态")
  private String status;

  @Schema(description = "可见性")
  private String visibility;

  @Schema(description = "分类")
  private CategoryDTO category;

  @Schema(description = "标签")
  private List<TagDTO> tags;

  @Schema(description = "作者")
  private UserDTO author;

  @Schema(description = "阅读数")
  private Long viewCount;

  @Schema(description = "点赞数")
  private Long likeCount;

  @Schema(description = "收藏数")
  private Long collectCount;

  @Schema(description = "评论数")
  private Long commentCount;

  @Schema(description = "发布时间")
  private LocalDateTime publishedAt;

  @Schema(description = "创建时间")
  private LocalDateTime createdAt;

  @Schema(description = "更新时间")
  private LocalDateTime updatedAt;

  @Schema(description = "当前用户是否点赞")
  private Boolean liked;

  @Schema(description = "当前用户是否收藏")
  private Boolean collected;
}


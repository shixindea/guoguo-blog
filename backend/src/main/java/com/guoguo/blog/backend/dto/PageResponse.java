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
@Schema(description = "分页响应")
public class PageResponse<T> {
  @Schema(description = "当前页码（从1开始）")
  private int page;

  @Schema(description = "每页大小")
  private int size;

  @Schema(description = "总条数")
  private long total;

  @Schema(description = "数据列表")
  private List<T> list;
}


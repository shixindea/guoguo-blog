package com.guoguo.blog.backend.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import java.util.List;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Schema(description = "批量更新启用状态请求")
public class BatchUpdateStatusRequest {
  @NotEmpty(message = "ID列表不能为空")
  @Schema(description = "ID列表")
  private List<Long> ids;

  @NotNull(message = "enabled不能为空")
  @Schema(description = "是否启用")
  private Boolean enabled;
}

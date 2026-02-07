package com.guoguo.blog.backend.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.Pattern;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Schema(description = "签到请求")
public class CheckinRequest {
  @Schema(description = "签到方式：WEB, MOBILE, SHAKE, WIDGET, API")
  @Pattern(regexp = "^(WEB|MOBILE|SHAKE|WIDGET|API)?$", message = "签到方式不合法")
  private String method;

  @Schema(description = "设备信息JSON（可选）")
  private String deviceInfo;
}


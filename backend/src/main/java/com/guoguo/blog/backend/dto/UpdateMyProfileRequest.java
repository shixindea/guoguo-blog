package com.guoguo.blog.backend.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Schema(description = "更新当前用户资料请求")
public class UpdateMyProfileRequest {
  @Size(max = 100, message = "昵称长度不能超过100")
  @Schema(description = "昵称")
  private String displayName;

  @Size(max = 500, message = "头像URL长度不能超过500")
  @Schema(description = "头像URL")
  private String avatarUrl;

  @Size(max = 1000, message = "个人简介长度不能超过1000")
  @Schema(description = "个人简介")
  private String bio;
}


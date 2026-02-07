package com.guoguo.blog.backend.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Schema(description = "登录请求")
public class LoginRequest {
  @NotBlank(message = "邮箱不能为空")
  @Schema(description = "邮箱/用户名", example = "test@example.com")
  private String email;

  @NotBlank(message = "密码不能为空")
  @Schema(description = "密码", example = "Password123")
  private String password;
}


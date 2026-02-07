package com.guoguo.blog.backend.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.AssertTrue;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Builder.Default;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Schema(description = "注册请求")
public class RegisterRequest {
  @NotBlank(message = "邮箱不能为空")
  @Email(message = "邮箱格式不正确")
  @Schema(description = "邮箱", example = "test@example.com")
  private String email;

  @NotBlank(message = "密码不能为空")
  @Size(min = 8, max = 32, message = "密码长度8-32位")
  @Pattern(regexp = "^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d).+$", message = "密码必须包含大小写字母和数字")
  @Schema(description = "密码", example = "Password123")
  private String password;

  @NotBlank(message = "确认密码不能为空")
  @Schema(description = "确认密码", example = "Password123")
  private String confirmPassword;

  @NotBlank(message = "用户名不能为空")
  @Size(min = 3, max = 20, message = "用户名长度3-20位")
  @Pattern(regexp = "^[a-zA-Z0-9_]+$", message = "用户名只能包含字母、数字和下划线")
  @Schema(description = "用户名", example = "guoguo")
  private String username;

  @AssertTrue(message = "必须同意用户协议")
  @Schema(description = "是否同意用户协议", example = "true")
  @Default
  private Boolean agreeToTerms = false;
}

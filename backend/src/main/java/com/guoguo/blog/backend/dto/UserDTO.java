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
@Schema(description = "用户信息")
public class UserDTO {
  @Schema(description = "用户ID")
  private Long id;

  @Schema(description = "用户名")
  private String username;

  @Schema(description = "邮箱")
  private String email;

  @Schema(description = "显示名称")
  private String displayName;

  @Schema(description = "头像URL")
  private String avatarUrl;

  @Schema(description = "个人简介")
  private String bio;

  @Schema(description = "角色列表")
  private List<String> roles;

  @Schema(description = "创建时间")
  private LocalDateTime createdAt;
}


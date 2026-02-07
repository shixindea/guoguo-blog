package com.guoguo.blog.backend.web;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Schema(description = "统一响应包装")
public class ApiResponse<T> {
  @Schema(description = "是否成功")
  private boolean success;

  @Schema(description = "业务码")
  private String code;

  @Schema(description = "提示信息")
  private String message;

  @Schema(description = "返回数据")
  private T data;

  public static <T> ApiResponse<T> success(T data) {
    return ApiResponse.<T>builder().success(true).code("OK").message("OK").data(data).build();
  }

  public static <T> ApiResponse<T> success(String message, T data) {
    return ApiResponse.<T>builder().success(true).code("OK").message(message).data(data).build();
  }

  public static <T> ApiResponse<T> success(String message) {
    return ApiResponse.<T>builder().success(true).code("OK").message(message).build();
  }

  public static <T> ApiResponse<T> error(String code, String message) {
    return ApiResponse.<T>builder().success(false).code(code).message(message).build();
  }
}


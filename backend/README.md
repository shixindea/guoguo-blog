# 后端：登录注册 + Apifox 文档

## 启动

```bash
cd backend
mvn spring-boot:run
```

默认端口：`8080`

## 接口文档（OpenAPI / Swagger）

- Swagger UI：`http://localhost:8080/swagger-ui.html`
- OpenAPI JSON：`http://localhost:8080/v3/api-docs`

## Apifox 导入方式

在 Apifox 中选择「导入」→「OpenAPI」，填写 URL：

`http://localhost:8080/v3/api-docs`

即可自动生成接口文档与请求示例。Controller/DTO 上的注解与 JavaDoc 也可配合 IDEA 的 Apifox Helper 插件同步展示。


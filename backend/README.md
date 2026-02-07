# 后端：登录注册 + Apifox 文档

## 启动

```bash
cd backend
mvn spring-boot:run
```

默认端口：`8080`

## 数据库连接（MySQL）

默认读取你本地 MySQL：

- `DB_HOST`（默认 localhost）
- `DB_PORT`（默认 3306）
- `DB_NAME`（默认 guoguo-blog）
- `DB_USERNAME`（默认 root）
- `DB_PASSWORD`（默认 root）

示例：

```bash
export DB_NAME=guoguo-blog
export DB_USERNAME=root
export DB_PASSWORD=你的密码
mvn spring-boot:run
```

## 接口文档（OpenAPI / Swagger）

- Swagger UI：`http://localhost:8080/swagger-ui.html`
- OpenAPI JSON：`http://localhost:8080/v3/api-docs`

## Apifox 导入方式

在 Apifox 中选择「导入」→「OpenAPI」，填写 URL：

`http://localhost:8080/v3/api-docs`

即可自动生成接口文档与请求示例。Controller/DTO 上的注解与 JavaDoc 也可配合 IDEA 的 Apifox Helper 插件同步展示。

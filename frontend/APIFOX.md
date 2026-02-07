# Apifox 配置与 TypeScript 类型导出

## 1) Apifox 导入后端接口

后端已集成 OpenAPI（Springdoc），启动后访问：

- OpenAPI 地址：`http://localhost:8080/v3/api-docs`
- Swagger UI：`http://localhost:8080/swagger-ui.html`

在 Apifox 中：

1. 项目 → 导入数据
2. 选择 OpenAPI/Swagger
3. 填写 URL：`http://localhost:8080/v3/api-docs`
4. 完成导入

## 2) 前端导出 TypeScript 类型（推荐：OpenAPI → TS）

前端使用 `openapi-typescript` 直接从 OpenAPI 生成 TS 类型文件：

```bash
pnpm api:types
```

生成文件：

- `src/api/generated.ts`

后续在请求封装中可以直接引用生成出来的类型（或在 IDE 中直接跳转查看类型定义）。

## 3) 环境变量（可选）

前端默认请求后端：`http://localhost:8080`。

如需修改，在前端 `.env.local` 中配置：

```bash
NEXT_PUBLIC_API_BASE_URL=http://localhost:8080
```


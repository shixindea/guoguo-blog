---
name: "apifox-backend-api"
description: "Enforces Apifox-friendly Spring Boot API conventions (Javadoc, DTOs, explicit annotations, ApiResponse). Invoke whenever you write or modify backend controllers/DTOs/endpoints."
---

# Apifox Backend API 规范

当你要**新增/修改后端接口（Controller/DTO/请求参数/返回结构）**时，先按本规范自检，再开始写代码。

## 目标

- 以「IntelliJ IDEA + Apifox 官方插件自动同步」为目标，保证接口/参数/返回能被完整识别。
- 强制统一风格：显式注解、独立 DTO、统一返回包装、可读 JavaDoc。

## Controller 层规范

1. 所有接口必须写在 `@RestController` 中。
2. 每个 Controller 必须有清晰的模块级 JavaDoc 注释（模块用途）。
3. 每个接口方法必须包含完整的 JavaDoc，说明：
   - 接口用途
   - 关键业务说明
4. 必须使用明确的请求注解：
   - `@GetMapping` / `@PostMapping` / `@PutMapping` / `@DeleteMapping`
   - 不允许只使用 `@RequestMapping`
5. 每个接口必须包含明确的 `consumes / produces`（例如 `application/json`），并且路径清晰（REST 风格，小写 + 中划线）。

## 参数规范

6. 所有参数必须明确声明来源：
   - `@PathVariable`
   - `@RequestParam`
   - `@RequestBody`
7. 禁止使用 `Object` / `Map` 作为请求参数或请求体。
8. 请求体必须使用独立 DTO 类（不要把 entity 当 request 直接用）。
9. DTO 字段必须有注释，并使用 `@Schema(description = "...")` 标注字段含义。

## 返回值规范

10. 返回值必须统一封装，例如 `ApiResponse<T>`。
11. 返回 DTO 必须是明确的实体类（不允许 `Map` / `Object`）。
12. 返回字段必须有 JavaDoc 或 `@Schema` 注解。

## Apifox 兼容要求（硬约束）

13. 所有接口信息必须能被 Apifox Helper 插件正确解析。
14. JavaDoc 内容要可直接作为接口说明展示（不要写无意义文本）。
15. 泛型返回值确保结构清晰，避免让 Apifox 丢字段。

## 提交前自检清单（写完必须过一遍）

- [ ] Controller/方法 JavaDoc 完整
- [ ] Mapping 注解正确、路径 REST 风格、consumes/produces 明确
- [ ] 入参全部显式声明来源（Path/Query/Body）
- [ ] Request/Response 都是 DTO，字段有 `@Schema`
- [ ] 返回统一 `ApiResponse<T>`，没有 Map/Object


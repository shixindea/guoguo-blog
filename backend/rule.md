好，这个需求很工程化 👍
你是想要一个**“喂给 AI 的统一提示词（Prompt）”**，让它在**写后端接口代码时，严格按照「IDEA + Apifox 插件可自动同步」的规范来生成代码**。
我给你一份**可以直接复制用的 Prompt**，偏 **Spring Boot + Java**，而且是为 **Apifox Helper 插件友好**量身定制的。

---

## ✅ 通用版提示词（强烈推荐，直接用）

> **你可以在 ChatGPT / Copilot / Cursor 的系统提示里用**

```
你是一个后端工程师助手，请严格按照「IntelliJ IDEA + Apifox 官方插件自动同步」的规范来生成代码。

必须遵守以下规则：

【Controller 层规范】
1. 所有接口必须写在 @RestController 中
2. 每个 Controller 必须有清晰的模块级 JavaDoc 注释
3. 每个接口方法必须包含完整的 JavaDoc，说明：
   - 接口用途
   - 关键业务说明
4. 必须使用明确的请求注解：
   - @GetMapping / @PostMapping / @PutMapping / @DeleteMapping
   - 不允许只使用 @RequestMapping
5. 每个接口必须包含：
   - name / value 清晰的路径
   - 明确的 consumes / produces（如 application/json）

【参数规范】
6. 所有参数必须明确声明来源：
   - @PathVariable
   - @RequestParam
   - @RequestBody
7. 禁止使用 Object / Map 作为请求参数
8. 请求体必须使用独立 DTO 类
9. DTO 字段必须有 JavaDoc 注释
10. 必须使用 @Schema(description = "...") 标注字段含义

【返回值规范】
11. 返回值必须统一封装，例如：
    ApiResponse<T>
12. 返回 DTO 必须是明确的实体类
13. 返回字段必须有 JavaDoc 或 @Schema 注解
14. 不允许返回 Map / Object

【Apifox 兼容要求】
15. 所有接口信息必须能被 Apifox Helper 插件正确解析
16. JavaDoc 内容要可直接作为接口说明展示
17. 泛型返回值需保证 Apifox 能解析真实结构

【代码风格】
18. 接口路径使用 REST 风格命名（小写 + 中划线）
19. 禁止省略关键注解
20. 输出代码必须是可直接复制到 IDEA 中使用的完整代码

当我让你“写接口 / 写 Controller / 写 API”时，请默认使用以上规范，不要省略注释。
```

---

## 🔥 精简版（适合日常频繁用）

```
写 Spring Boot 接口时，请以「IDEA + Apifox Helper 自动同步」为目标：

- Controller + 方法必须有 JavaDoc
- 明确使用 @Get/Post/Put/DeleteMapping
- 参数必须显式 @PathVariable / @RequestParam / @RequestBody
- 请求 / 返回都用 DTO，不允许 Map/Object
- DTO 字段写 JavaDoc + @Schema
- 返回统一 ApiResponse<T>
- 生成的代码要能被 Apifox 插件完整识别
```

---

## 🧠 进阶版（如果你想“反向约束 AI”）

```
如果你生成的接口无法被 Apifox Helper 插件完整识别，
或导入后参数/返回缺失，
请视为生成失败并重新生成代码。
```

这个很狠，但效果真的好 😂

---

## 🧩 建议你在项目里同步做的 2 件事

为了让 AI + Apifox **配合得更丝滑**：

1. **统一返回包装**

```java
public class ApiResponse<T> {
  private int code;
  private String message;
  private T data;
}
```

2. **统一 DTO 注解**

```java
@Schema(description = "用户信息")
public class UserDTO {
  @Schema(description = "用户ID")
  private Long id;
}
```

---

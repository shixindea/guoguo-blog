## 后端默认成功状态码
- HTTP 状态码：`200 OK`（Controller 使用 `ResponseEntity.ok(...)`）。
- 业务成功标识：响应体 `success=true` 且 `code="OK"`（见 [ApiResponse](file:///Users/guoguo/code/my-project/guoguo-blog/backend/src/main/java/com/guoguo/blog/backend/web/ApiResponse.java#L14-L41)）。
- 业务/参数错误：`400 Bad Request`（见 [GlobalExceptionHandler](file:///Users/guoguo/code/my-project/guoguo-blog/backend/src/main/java/com/guoguo/blog/backend/exception/GlobalExceptionHandler.java#L17-L45)）。
- 未登录/无权限：Spring Security 通常返回 `401/403`（取决于访问路径与鉴权结果）。

## 前端 Tooltip 提示策略（全局）
- **判定条件（两层）**
  1) 非 2xx：读取后端返回体里的 `message`（若有），否则用通用错误文案；
  2) 2xx 但业务失败：若 `data.success === false` 或 `data.code !== "OK"`，认为失败。
- **展示方式**：实现一个全局“tooltip 风格”的提示气泡（固定在右上角/顶部），由 axios 拦截器统一触发，自动消失（如 2.5s）。

## 技术实现步骤
1. 增加 Radix Tooltip 依赖（项目已在用 Radix 其它组件，保持一致）：`@radix-ui/react-tooltip`。
2. 新增通用 Tooltip 组件封装：`frontend/src/components/ui/tooltip.tsx`（与现有 `ui/*` 风格一致）。
3. 新增全局提示组件：`frontend/src/components/GlobalApiTooltip.tsx`
   - 内部放一个 `position: fixed` 的 Trigger（不可见或极小），TooltipContent 用来展示 message。
   - 通过轻量事件总线/全局 store 接收 message，控制 open/关闭与自动定时。
4. 在根布局挂载一次：`frontend/src/app/layout.tsx` 中 `AuthProvider` 内部加 `<GlobalApiTooltip />`。
5. 改造 axios 响应拦截器：[http.ts](file:///Users/guoguo/code/my-project/guoguo-blog/frontend/src/lib/http.ts)
   - 2xx：检测 `success/code`，非成功则触发 tooltip 并 `Promise.reject(new Error(message))`；
   - 非 2xx：从 `error.response.data.message` 取 message，触发 tooltip；
   - 401：清 token + tooltip 提示“登录已过期，请重新登录”。
6. 验证：`pnpm -C frontend lint && pnpm -C frontend build`，并手动触发一次失败登录/注册，确认 tooltip 出现。

## 交付结果
- 前端任何接口调用，只要“HTTP 非 200/2xx”或“`success=false`/`code!=OK`”，都会自动用 tooltip 风格气泡提示后端 `message`。
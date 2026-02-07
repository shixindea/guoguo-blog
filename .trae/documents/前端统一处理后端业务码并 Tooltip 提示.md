## 后端成功状态码
- 统一响应体是 ApiResponse：success=true 且 code="OK" 表示业务成功（message 默认 "OK" 或自定义）。
- HTTP 层面：Controller 用 ResponseEntity.ok(...)，成功默认 200；异常处理里业务/校验失败为 400，未知异常为 500。

## 前端 Tooltip 提示方案
- 新增 Radix Tooltip 依赖并补齐 ui/tooltip 组件封装（当前项目没有 Tooltip 组件）。
- 新增一个全局错误事件总线（例如 src/lib/errorBus.ts），用于在非 React 环境（axios 拦截器）里派发错误消息。
- 新增全局 Tooltip Host（例如 src/components/ApiErrorTooltipHost.tsx），监听 errorBus，固定在页面右上角展示 message，自动 2–3 秒关闭。
- 在 RootLayout 里挂载 Tooltip Host（放在 AuthProvider 内部），保证全站可用。

## axios 拦截器绑定业务码
- 在 http.ts 的 response 成功回调里：
  - 若响应 data 符合 ApiResponse 结构且 success=false 或 code!=="OK"，则派发 tooltip message 并 reject（阻断业务继续执行）。
  - 若是 HTTP 4xx/5xx 且后端返回 Api
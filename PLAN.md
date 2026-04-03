# Lumen Execution Plan

> Temporary document. Remove when all phases complete.

---

## Phase 1 — Site Foundation Fixes

- [ ] **1.1** `layout.tsx` 改回 server component — 把 `useState` + 交互逻辑抽到 `ClientShell`，layout 保持 SSR
- [ ] **1.2** 给所有页面补 `metadata` export（title / description / OG）
- [ ] **1.3** 首页空 category 不显示 — 没有组件的 category 隐藏或加 placeholder
- [ ] **1.4** PromptInput 补 semantic layer controls（confidence、urgency、density 等）
- [ ] **1.5** Controls layer 对齐 SPEC — `architecture/motion/color` → `visual` + `semantic` 双层
- [ ] **1.6** Atom 数据抽离 — 从 `atoms/page.tsx` 硬编码移到独立数据文件 `src/data/atoms.ts`
- [ ] **1.7** Atoms 页面加 live demo + 反向关联（哪些 component 用了这个 atom）
- [ ] **1.8** 组件预览 lazy load — 首页不直接 import 组件，用 `dynamic()` 或截图

## Phase 2 — Component Build-out

- [ ] **2.1** ReasoningSteps — 步骤展开 + 置信度变化 + 证据链（Reasoning 类）
- [ ] **2.2** ConfidenceMeter — 置信度弧形/条形可视化（Decision 类）
- [ ] **2.3** ResultReveal — blur-to-clear 渐进揭示（Output 类）
- [ ] **2.4** DecisionCard — 多选项对比 + 推荐标记（Decision 类）
- [ ] **2.5** ThinkingLoader — AI 处理等待指示器，需差异化设计（Reasoning 类）
- [ ] **2.6** 扩展 atom 体系 — 新增 Feedback 类（ConfidenceBadge / StatusPulse / ProgressArc）、Data 类（StepIndicator / MetricPill）、Motion 类（RevealMask / StaggerContainer）
- [ ] **2.7** InsightStack 或合并到 ResultReveal，或重新定义差异点
- [ ] **2.8** ProgressiveBlurReveal — 评估是降级为 atom（RevealMask）还是保留为 component

## Phase 3 — Agent Interaction Patterns

- [ ] **3.1** 新增 `agent` category 到 registry + sidebar
- [ ] **3.2** AgentTimeline — agent 执行循环可视化（plan → execute → observe → decide）
- [ ] **3.3** ToolCallCard — 工具调用展示（工具名、参数、返回值、耗时）
- [ ] **3.4** ApprovalPrompt — 授权确认界面（原因 + 风险 + 替代方案）
- [ ] **3.5** ConfidenceGate — 置信度驱动的 UI 行为切换
- [ ] **3.6** AgentHandoff — 多 agent 协作交接可视化

---

## Notes

- 每个 component 需满足 SPEC.md 质量清单（desktop/mobile 双端、双层参数、code panel、rationale）
- Phase 完成后回顾是否需要更新 SPEC.md 和 CLAUDE.md
- Agent category 的 ComponentCategory type 需要在 Phase 3 开始时扩展

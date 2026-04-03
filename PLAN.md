# Lumen Execution Plan

> Temporary document. Remove when all phases complete.

---

## Architecture: Component = Container + Atoms

Every component follows this composition model:

```
Component (Container)
  ├── Atom A  (from src/components/atoms/)
  ├── Atom B  (reused or new)
  └── Atom C
```

- **Atoms** live in `src/components/atoms/{type}/` — shared across all components
- **Atom registry** at `src/data/atom-registry.ts` — metadata, role, intent, `file` path
- **Composition** declared in each component's `composition.ts` — maps container to its atoms
- **Types**: `src/types/atom.ts` (AtomMeta) + `src/types/composition.ts` (CompositionMap)

When designing a new component: **write `composition.ts` first** — force yourself to declare container role, state, and which atoms you need (reused vs new).

---

## Phase 1 — Site Foundation Fixes

- [x] **1.6** Atom data — ~~hardcoded in page.tsx~~ → `atom-registry.ts` with `AtomMeta` type (already existed, now linked to implementation files via `file` field)
- [x] **1.x** Atom implementations moved to `src/components/atoms/` shared directory
- [x] **1.x** Composition system — `composition.ts` + `CompositionMap` type created, PromptInput wired up
- [ ] **1.1** `layout.tsx` 改回 server component（P2 — 体感收益低，SEO 需要时再做）
- [ ] **1.2** 给所有页面补 `metadata` export（P2 — 同上）
- [ ] **1.3** 首页空 category 不显示 — 没有组件的 category 隐藏或加 placeholder
- [ ] **1.4** PromptInput 补 semantic layer controls（confidence、urgency、density 等）
- [ ] **1.5** Controls layer 对齐 SPEC — `architecture/motion/color` → `visual` + `semantic` 双层
- [ ] **1.7** Atoms 页面加 live demo + 反向关联（哪些 component 用了这个 atom）
- [ ] **1.8** 组件预览 lazy load — 首页不直接 import 组件，用 `dynamic()` 或截图

## Phase 2 — Component Build-out

Each component below must include: `composition.ts` (atoms 先行), `index.tsx`, `mobile.tsx`, `controls.tsx`, `code.tsx`, `rationale.mdx`, `meta.ts`

- [ ] **2.1** ReasoningSteps — 步骤展开 + 置信度变化 + 证据链（Reasoning 类）
  - New atoms needed: ElevatedCard(surface), StatusPulse(feedback), ConfidenceBadge(feedback), StepIndicator(data), RevealMask(motion)
  - Reuses: ChipButton(action)
- [ ] **2.2** ConfidenceMeter — 置信度弧形/条形可视化（Decision 类）
  - New atoms needed: ProgressArc(feedback), MetricPill(data)
  - Reuses: ElevatedCard(surface)
- [ ] **2.3** ResultReveal — blur-to-clear 渐进揭示（Output 类）
  - New atoms needed: StaggerContainer(motion)
  - Reuses: RevealMask(motion), ElevatedCard(surface)
- [ ] **2.4** DecisionCard — 多选项对比 + 推荐标记（Decision 类）
  - Reuses: ConfidenceBadge(feedback), ElevatedCard(surface), ChipButton(action)
- [ ] **2.5** ThinkingLoader — AI 处理等待指示器（Reasoning 类）
  - Reuses: StatusPulse(feedback)
- [ ] **2.6** InsightStack 或合并到 ResultReveal，或重新定义差异点
- [ ] **2.7** ProgressiveBlurReveal — 评估是降级为 atom（RevealMask）还是保留为 component

## Phase 3 — Agent Interaction Patterns

- [ ] **3.1** 新增 `agent` category 到 registry + sidebar（扩展 ComponentCategory type）
- [ ] **3.2** AgentTimeline — agent 执行循环可视化（plan → execute → observe → decide）
- [ ] **3.3** ToolCallCard — 工具调用展示（工具名、参数、返回值、耗时）
- [ ] **3.4** ApprovalPrompt — 授权确认界面（原因 + 风险 + 替代方案）
- [ ] **3.5** ConfidenceGate — 置信度驱动的 UI 行为切换
- [ ] **3.6** AgentHandoff — 多 agent 协作交接可视化

---

## Notes

- 每个 component 需满足 SPEC.md 质量清单（desktop/mobile 双端、双层参数、code panel、rationale）
- Phase 完成后回顾是否需要更新 SPEC.md 和 CLAUDE.md
- **设计新组件的流程**: composition.ts → atoms（新建/复用） → container index.tsx → controls → mobile → code → rationale

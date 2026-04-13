# Lumen

**Interactive UI components for AI-native products.**

A showcase site presenting curated, interactive components designed for AI product interfaces — reasoning visualization, decision presentation, action confirmation, and output reveal. Every component has intentional desktop and mobile behaviors, dual-layer parameters (visual + semantic), and copyable code.

[English](#english) · [中文](#中文)

---

<a id="english"></a>

## Overview

Lumen is a portfolio-grade showcase (like React Bits) for AI-native UI components. It is **not** an npm package — it's a publicly accessible site where each component is demoed, tuned via live controls, and copyable.

### What makes it different

- **AI-product semantic** — components organized by experience stage (Reasoning, Decision, Output, Action, Motion), not technology
- **Dual-device** — every component has distinct Desktop and Mobile behaviors, not just responsive scaling
- **Two-layer parameters** — visual/motion controls AND product-semantic controls (confidence, urgency, trust level)
- **Copyable** — every component's TSX code is syntax-highlighted and one-click copyable

## Tech Stack

| Layer | Choice |
|-------|--------|
| Framework | Next.js 15 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS 3.x |
| Animation | Framer Motion |
| Code Display | Shiki |
| Icons | Lucide React |
| Font | Geist + Geist Mono |
| Deployment | Vercel |

## Getting Started

```bash
# Clone the repository
git clone https://github.com/Aspen-Lab/lumen.git
cd lumen

# Install dependencies
npm install

# Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the site.

## Project Structure

```
src/
├── app/                    # Next.js App Router pages
├── components/
│   ├── site/               # Site chrome (sidebar, nav, controls, code panel)
│   └── library/            # Showcase components by category
│       ├── reasoning/      # ThinkingLoader, ReasoningSteps
│       ├── decision/       # DecisionCard, ConfidenceMeter
│       ├── output/         # ResultReveal, InsightStack
│       ├── action/         # SmartCTA, PromptInput
│       └── motion/         # ProgressiveBlurReveal
├── data/
│   └── registry.ts         # Central component registry
├── types/                  # TypeScript types
└── styles/
    └── globals.css          # Design tokens & CSS variables
```

## Component Architecture

Each library component follows a consistent structure:

```
ComponentName/
├── index.tsx        # Desktop variant
├── mobile.tsx       # Mobile variant (different behavior, not just narrower)
├── controls.tsx     # Control panel definitions (Layer A + Layer B)
├── code.tsx         # Copyable source code
├── meta.ts          # Metadata (name, category, tags, status)
└── rationale.mdx    # When to use, why this design, AI product context
```

## License

MIT

---

<a id="中文"></a>

## 概述

Lumen 是一个面向 AI 原生产品的交互式 UI 组件展示站（类似 React Bits）。它**不是** npm 包，而是一个公开可访问的网站，每个组件都可以实时演示、通过控制面板调参、并一键复制代码。

### 核心特点

- **AI 产品语义** — 按体验阶段（推理、决策、输出、行动、动效）组织组件，而非按技术分类
- **双设备适配** — 每个组件都有独立的桌面端和移动端行为逻辑，不仅仅是响应式缩放
- **双层参数系统** — 同时提供视觉/动效控制和产品语义控制（置信度、紧迫性、信任等级等）
- **可复制** — 每个组件的 TSX 代码都经过语法高亮处理，支持一键复制

## 技术栈

| 层级 | 选择 |
|------|------|
| 框架 | Next.js 15 (App Router) |
| 语言 | TypeScript |
| 样式 | Tailwind CSS 3.x |
| 动画 | Framer Motion |
| 代码展示 | Shiki |
| 图标 | Lucide React |
| 字体 | Geist + Geist Mono |
| 部署 | Vercel |

## 快速开始

```bash
# 克隆仓库
git clone https://github.com/Aspen-Lab/lumen.git
cd lumen

# 安装依赖
npm install

# 启动开发服务器
npm run dev
```

在浏览器中打开 [http://localhost:3000](http://localhost:3000) 查看网站。

## 项目结构

```
src/
├── app/                    # Next.js App Router 页面
├── components/
│   ├── site/               # 站点框架（侧边栏、导航、控制面板、代码面板）
│   └── library/            # 按分类组织的展示组件
│       ├── reasoning/      # 思考加载器、推理步骤
│       ├── decision/       # 决策卡片、置信度仪表
│       ├── output/         # 结果展示、洞察堆叠
│       ├── action/         # 智能 CTA、提示输入
│       └── motion/         # 渐进模糊展示
├── data/
│   └── registry.ts         # 组件注册中心
├── types/                  # TypeScript 类型定义
└── styles/
    └── globals.css          # 设计令牌与 CSS 变量
```

## 组件架构

每个展示组件遵循统一的文件结构：

```
组件名/
├── index.tsx        # 桌面端变体
├── mobile.tsx       # 移动端变体（不同的交互行为，而非仅缩窄）
├── controls.tsx     # 控制面板定义（视觉层 + 语义层）
├── code.tsx         # 可复制的源代码
├── meta.ts          # 元数据（名称、分类、标签、状态）
└── rationale.mdx    # 使用场景、设计理念、AI 产品上下文
```

## 许可证

MIT

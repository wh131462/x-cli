# 简介

X-CLI 是一个 Node.js 命令行工具，旨在简化前端项目的创建和开发工具的管理。

## 功能特性

<div class="features-grid">

<div class="feature-card">
<div class="feature-icon rocket">
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z"/><path d="m12 15-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z"/><path d="M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0"/><path d="M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5"/></svg>
</div>
<h3>项目脚手架</h3>

使用 `x new` 命令快速创建项目：

- **Vue** - create-vue (Vite) 或 @vue/cli (Webpack)
- **React** - Vite、create-react-app 或 Next.js
- **Angular** - @angular/cli
- **Vanilla** - Vite (纯 JS/TS)
- **Taro** - 跨端小程序 (React/Vue3)
- **UniApp** - 跨端小程序 (Vue3)
</div>

<div class="feature-card">
<div class="feature-icon package">
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m7.5 4.27 9 5.15"/><path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z"/><path d="m3.3 7 8.7 5 8.7-5"/><path d="M12 22V12"/></svg>
</div>
<h3>统一包管理</h3>

告别记忆不同包管理器命令的烦恼：

| 命令 | 作用 |
|------|------|
| `xi [package]` | 安装依赖 |
| `xu [package]` | 卸载依赖 |
| `xr <script>` | 运行脚本 |

自动检测并使用项目对应的包管理器（npm/yarn/pnpm/bun）。
</div>

<div class="feature-card">
<div class="feature-icon tools">
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/></svg>
</div>
<h3>开发工具管理</h3>

一键配置常用开发工具：

- **ESLint** - 代码检查
- **Prettier** - 代码格式化
- **Husky** - Git Hooks
- **CommitLint** - 提交规范
- **lint-staged** - 暂存区检查
- **.gitignore** - Git 忽略配置
</div>

<div class="feature-card">
<div class="feature-icon ai">
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 8V4H8"/><rect width="16" height="12" x="4" y="8" rx="2"/><path d="M2 14h2"/><path d="M20 14h2"/><path d="M15 13v2"/><path d="M9 13v2"/></svg>
</div>
<h3>AI 助手</h3>

内置 AI 工作区 `xa`，支持多种大模型提供商：

- Anthropic (Claude)
- OpenAI (GPT)
- Google (Gemini)
- DeepSeek
- Groq
- Azure OpenAI
- Ollama (本地模型)
</div>

</div>

## 设计理念

<div class="principles">
<div class="principle">
<span class="principle-num">01</span>
<div>
<strong>简化操作</strong>
<p>用最少的命令完成最多的工作</p>
</div>
</div>
<div class="principle">
<span class="principle-num">02</span>
<div>
<strong>智能检测</strong>
<p>自动识别项目环境和配置</p>
</div>
</div>
<div class="principle">
<span class="principle-num">03</span>
<div>
<strong>统一体验</strong>
<p>跨包管理器、跨框架的一致操作</p>
</div>
</div>
<div class="principle">
<span class="principle-num">04</span>
<div>
<strong>开箱即用</strong>
<p>合理的默认配置，无需繁琐设置</p>
</div>
</div>
</div>

<style>
.features-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 20px;
  margin: 24px 0;
}

.feature-card {
  padding: 24px;
  border-radius: 12px;
  background: var(--vp-c-bg-soft);
  border: 1px solid var(--vp-c-divider);
  transition: all 0.3s ease;
}

.feature-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 24px rgba(0, 0, 0, 0.1);
  border-color: var(--vp-c-brand-1);
}

.feature-icon {
  width: 48px;
  height: 48px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 16px;
}

.feature-icon svg {
  width: 24px;
  height: 24px;
  color: white;
}

.feature-icon.rocket { background: linear-gradient(135deg, #f97316, #ea580c); }
.feature-icon.package { background: linear-gradient(135deg, #8b5cf6, #7c3aed); }
.feature-icon.tools { background: linear-gradient(135deg, #10b981, #059669); }
.feature-icon.ai { background: linear-gradient(135deg, #3b82f6, #2563eb); }

.feature-card h3 {
  margin: 0 0 12px;
  font-size: 18px;
}

.feature-card p, .feature-card ul, .feature-card table {
  margin: 8px 0;
  font-size: 14px;
  color: var(--vp-c-text-2);
}

.feature-card ul {
  padding-left: 20px;
}

.feature-card li {
  margin: 4px 0;
}

.principles {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 16px;
  margin: 24px 0;
}

.principle {
  display: flex;
  gap: 16px;
  padding: 20px;
  border-radius: 12px;
  background: var(--vp-c-bg-soft);
  border: 1px solid var(--vp-c-divider);
}

.principle-num {
  font-size: 32px;
  font-weight: 700;
  background: linear-gradient(135deg, var(--vp-c-brand-1), var(--vp-c-brand-2));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  line-height: 1;
}

.principle strong {
  display: block;
  font-size: 16px;
  margin-bottom: 4px;
}

.principle p {
  margin: 0;
  font-size: 14px;
  color: var(--vp-c-text-2);
}
</style>

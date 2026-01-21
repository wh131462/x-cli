---
layout: home

hero:
  name: X-CLI
  text: 前端项目脚手架
  tagline: 一站式项目创建、包管理和开发工具配置
  image:
    src: /logo.svg
    alt: X-CLI
  actions:
    - theme: brand
      text: 快速开始
      link: /guide/getting-started
    - theme: alt
      text: 查看 GitHub
      link: https://github.com/wh131462/x-cli
---

<div class="features-section">
<div class="features-container">

<div class="feature-card">
<div class="feature-icon rocket">
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z"/><path d="m12 15-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z"/><path d="M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0"/><path d="M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5"/></svg>
</div>
<h3>项目脚手架</h3>
<p>一键创建 Vue、React、Angular、Taro、UniApp 等项目，交互式选择框架和模板</p>
</div>

<div class="feature-card">
<div class="feature-icon package">
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m7.5 4.27 9 5.15"/><path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z"/><path d="m3.3 7 8.7 5 8.7-5"/><path d="M12 22V12"/></svg>
</div>
<h3>统一包管理</h3>
<p>xi/xu/xr 命令自动检测 npm/yarn/pnpm/bun，告别记忆不同包管理器命令的烦恼</p>
</div>

<div class="feature-card">
<div class="feature-icon tools">
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/></svg>
</div>
<h3>开发工具管理</h3>
<p>快速配置 ESLint、Prettier、Husky、CommitLint 等开发工具，支持 Monorepo</p>
</div>

<div class="feature-card">
<div class="feature-icon ai">
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 8V4H8"/><rect width="16" height="12" x="4" y="8" rx="2"/><path d="M2 14h2"/><path d="M20 14h2"/><path d="M15 13v2"/><path d="M9 13v2"/></svg>
</div>
<h3>AI 助手</h3>
<p>内置 AI 工作区，支持 Claude、GPT、DeepSeek 等多种大模型，智能辅助开发</p>
</div>

</div>
</div>

## 快速体验

```bash
# 全局安装
npm install -g @eternalheart/x-cli

# 创建新项目
x new my-project

# 使用包管理器命令
xi lodash        # 安装依赖
xu lodash        # 卸载依赖
xr dev           # 运行脚本

# 启动 AI 工作区
xa
```

<style>
:root {
  --vp-home-hero-name-color: transparent;
  --vp-home-hero-name-background: -webkit-linear-gradient(120deg, #bd34fe 30%, #41d1ff);
  --vp-home-hero-image-background-image: linear-gradient(-45deg, #bd34fe 50%, #47caff 50%);
  --vp-home-hero-image-filter: blur(44px);
}

@media (min-width: 640px) {
  :root {
    --vp-home-hero-image-filter: blur(56px);
  }
}

@media (min-width: 960px) {
  :root {
    --vp-home-hero-image-filter: blur(68px);
  }
}

.features-section {
  padding: 0 24px 64px;
  max-width: 1152px;
  margin: 0 auto;
}

.features-container {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 20px;
}

@media (max-width: 960px) {
  .features-container {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 640px) {
  .features-container {
    grid-template-columns: 1fr;
  }
}

.feature-card {
  padding: 24px;
  border-radius: 12px;
  background: var(--vp-c-bg-soft);
  border: 1px solid var(--vp-c-divider);
  transition: all 0.3s ease;
}

.feature-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 16px 32px rgba(0, 0, 0, 0.12);
  border-color: var(--vp-c-brand-1);
}

.feature-icon {
  width: 56px;
  height: 56px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 20px;
}

.feature-icon svg {
  width: 28px;
  height: 28px;
  color: white;
}

.feature-icon.rocket { background: linear-gradient(135deg, #f97316, #ea580c); }
.feature-icon.package { background: linear-gradient(135deg, #8b5cf6, #7c3aed); }
.feature-icon.tools { background: linear-gradient(135deg, #10b981, #059669); }
.feature-icon.ai { background: linear-gradient(135deg, #3b82f6, #2563eb); }

.feature-card h3 {
  margin: 0 0 8px;
  font-size: 18px;
  font-weight: 600;
  color: var(--vp-c-text-1);
}

.feature-card p {
  margin: 0;
  font-size: 14px;
  color: var(--vp-c-text-2);
  line-height: 1.6;
}
</style>

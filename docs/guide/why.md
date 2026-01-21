# 为什么选择 X-CLI

## 痛点分析

### 1. 创建项目繁琐

传统方式需要记住每个框架的 CLI 命令：

```bash
# Vue
npx create-vue my-vue-app
# 或
npx @vue/cli create my-vue-app

# React
npx create-react-app my-react-app
# 或
npx create-vite my-react-app --template react

# Angular
npx @angular/cli new my-angular-app

# 小程序
npx @tarojs/cli init my-taro-app
```

**X-CLI 的解决方案：**

```bash
x new my-app
# 交互式选择框架和模板，统一入口
```

### 2. 包管理器混乱

不同项目使用不同的包管理器，需要频繁切换命令：

| 操作 | npm | yarn | pnpm | bun |
|------|-----|------|------|-----|
| 安装 | `npm install` | `yarn` | `pnpm install` | `bun install` |
| 添加包 | `npm install pkg` | `yarn add pkg` | `pnpm add pkg` | `bun add pkg` |
| 删除包 | `npm uninstall pkg` | `yarn remove pkg` | `pnpm remove pkg` | `bun remove pkg` |
| 运行脚本 | `npm run dev` | `yarn dev` | `pnpm dev` | `bun run dev` |

**X-CLI 的解决方案：**

```bash
xi          # 自动检测包管理器并安装
xi pkg      # 添加包
xu pkg      # 删除包
xr dev      # 运行脚本
```

### 3. 开发工具配置复杂

配置 ESLint + Prettier + Husky + CommitLint 需要：

1. 安装多个包
2. 创建多个配置文件
3. 配置 Git Hooks
4. 处理工具间的兼容性

**X-CLI 的解决方案：**

```bash
x plugin init
# 交互式一键配置，自动处理依赖和兼容性
```

### 4. AI 辅助开发门槛高

使用 AI 辅助开发需要：

1. 选择和配置 AI 服务
2. 管理 API Key
3. 集成到开发环境

**X-CLI 的解决方案：**

```bash
xa --config  # 配置向导
xa           # 直接启动 AI 工作区
```

## 对比表

| 特性 | 传统方式 | X-CLI |
|------|---------|-------|
| 创建项目 | 记住各框架 CLI | `x new` 统一入口 |
| 包管理 | 手动切换命令 | `xi/xu/xr` 自动检测 |
| 工具配置 | 手动安装配置 | `x plugin init` 一键完成 |
| AI 辅助 | 复杂集成 | `xa` 开箱即用 |
| 学习成本 | 高 | 低 |

## 适用场景

<div class="use-cases">
<div class="use-case">
<span class="check-icon"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg></span>
<span>频繁创建新项目的开发者</span>
</div>
<div class="use-case">
<span class="check-icon"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg></span>
<span>在多个使用不同包管理器的项目间切换</span>
</div>
<div class="use-case">
<span class="check-icon"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg></span>
<span>希望快速配置规范的开发环境</span>
</div>
<div class="use-case">
<span class="check-icon"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg></span>
<span>想要 AI 辅助但不想花时间配置</span>
</div>
<div class="use-case">
<span class="check-icon"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg></span>
<span>团队统一开发工具和规范</span>
</div>
</div>

<style>
.use-cases {
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin: 20px 0;
}

.use-case {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 16px;
  border-radius: 8px;
  background: var(--vp-c-bg-soft);
  border: 1px solid var(--vp-c-divider);
  transition: all 0.2s ease;
}

.use-case:hover {
  border-color: var(--vp-c-brand-1);
  transform: translateX(4px);
}

.check-icon {
  flex-shrink: 0;
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background: linear-gradient(135deg, #10b981, #059669);
  display: flex;
  align-items: center;
  justify-content: center;
}

.check-icon svg {
  width: 14px;
  height: 14px;
  color: white;
}

.use-case span:last-child {
  font-size: 15px;
}
</style>

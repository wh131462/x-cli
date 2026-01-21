# React

X-CLI 支持使用三种方式创建 React 项目。

## 可用模板

### Vite (推荐)

使用 Vite 构建，速度最快：

```bash
x new my-react-app
# 选择 React → Vite (recommended)
```

**特点：**
- 极快的开发服务器启动
- 默认使用 TypeScript
- 轻量级配置
- 热更新速度快

### create-react-app

Facebook 官方脚手架：

```bash
x new my-react-app
# 选择 React → create-react-app
```

**特点：**
- 零配置开箱即用
- 默认使用 TypeScript 模板
- 成熟稳定

### Next.js

React 全栈框架：

```bash
x new my-next-app
# 选择 React → Next.js
```

**特点：**
- 服务端渲染 (SSR)
- 静态站点生成 (SSG)
- API 路由
- 文件系统路由
- 内置优化

## 模板对比

| 特性 | Vite | CRA | Next.js |
|------|------|-----|---------|
| 启动速度 | ⚡⚡⚡ | ⚡ | ⚡⚡ |
| SSR 支持 | ❌ | ❌ | ✅ |
| 配置复杂度 | 低 | 低 | 中 |
| 适用场景 | SPA | SPA | 全栈/SSR |

## 创建后

```bash
cd my-react-app

# 安装依赖
xi

# 启动开发服务器
xr dev

# 构建生产版本
xr build
```

## 项目结构

### Vite 项目

```
my-react-app/
├── src/
│   ├── assets/
│   ├── components/
│   ├── App.tsx
│   ├── App.css
│   └── main.tsx
├── public/
├── index.html
├── package.json
├── tsconfig.json
└── vite.config.ts
```

### Next.js 项目

```
my-next-app/
├── app/
│   ├── layout.tsx
│   ├── page.tsx
│   └── globals.css
├── public/
├── package.json
├── tsconfig.json
└── next.config.js
```

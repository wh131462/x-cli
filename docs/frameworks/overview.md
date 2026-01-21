# 框架支持概览

X-CLI 支持创建多种前端项目，涵盖主流框架和小程序开发。

## 前端框架

| 框架 | 模板 | 特点 |
|------|------|------|
| [Vue](/frameworks/vue) | create-vue, @vue/cli | 渐进式框架，灵活易用 |
| [React](/frameworks/react) | Vite, CRA, Next.js | 组件化，生态丰富 |
| [Angular](/frameworks/angular) | @angular/cli | 企业级，功能完备 |
| [Vanilla](/frameworks/vanilla) | Vite | 原生 JS/TS，无框架 |

## 小程序框架

| 框架 | 模板 | 特点 |
|------|------|------|
| [Taro](/frameworks/taro) | React, Vue3 | 跨端小程序，多平台支持 |
| [UniApp](/frameworks/uniapp) | Vue3 + Vite | 一套代码，多端发布 |

## 选择建议

```
你想做什么？
│
├─ Web 应用
│  ├─ 熟悉 Vue → Vue (create-vue)
│  ├─ 熟悉 React → React (Vite)
│  ├─ 企业级应用 → Angular
│  └─ 轻量/学习 → Vanilla
│
├─ 小程序
│  ├─ 熟悉 React → Taro + React
│  ├─ 熟悉 Vue → UniApp 或 Taro + Vue3
│  └─ 需要 App → UniApp
│
└─ 全栈应用
   └─ React → Next.js
```

## 快速创建

```bash
# 创建项目，交互选择框架
x new my-app

# 示例输出
? Select framework (Use arrow keys)
❯ Vue
  React
  Angular
  Vanilla (JS/TS)
  Taro (小程序)
  UniApp (小程序)
```

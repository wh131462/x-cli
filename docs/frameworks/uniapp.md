# UniApp

[UniApp](https://uniapp.dcloud.net.cn/) 是使用 Vue.js 开发所有前端应用的框架，一套代码可发布到多个平台。

## 可用模板

### Vue3 + Vite + TS (推荐)

```bash
x new my-uniapp
# 选择 UniApp → Vue3 + Vite + TS (recommended)
```

**特点：**
- Vue 3 Composition API
- Vite 构建，开发体验好
- TypeScript 支持

### Vue3 + Vite

```bash
x new my-uniapp
# 选择 UniApp → Vue3 + Vite
```

**特点：**
- Vue 3 语法
- JavaScript 版本

## 支持的平台

| 平台 | 支持 |
|------|------|
| 微信小程序 | ✅ |
| 支付宝小程序 | ✅ |
| 百度小程序 | ✅ |
| 字节跳动小程序 | ✅ |
| QQ 小程序 | ✅ |
| 快手小程序 | ✅ |
| 京东小程序 | ✅ |
| H5 | ✅ |
| App (iOS/Android) | ✅ |

## 创建后

```bash
cd my-uniapp

# 安装依赖
xi

# 开发 H5
xr dev:h5

# 开发微信小程序
xr dev:mp-weixin

# 构建 H5
xr build:h5

# 构建微信小程序
xr build:mp-weixin
```

## 项目结构

```
my-uniapp/
├── src/
│   ├── pages/
│   │   └── index/
│   │       └── index.vue
│   ├── static/
│   ├── App.vue
│   ├── main.ts
│   ├── manifest.json
│   ├── pages.json
│   └── uni.scss
├── index.html
├── package.json
├── tsconfig.json
└── vite.config.ts
```

## 开发命令对照

| 平台 | 开发命令 | 构建命令 |
|------|----------|----------|
| H5 | `xr dev:h5` | `xr build:h5` |
| 微信小程序 | `xr dev:mp-weixin` | `xr build:mp-weixin` |
| 支付宝小程序 | `xr dev:mp-alipay` | `xr build:mp-alipay` |
| 百度小程序 | `xr dev:mp-baidu` | `xr build:mp-baidu` |
| 字节跳动小程序 | `xr dev:mp-toutiao` | `xr build:mp-toutiao` |
| QQ 小程序 | `xr dev:mp-qq` | `xr build:mp-qq` |

## 示例代码

```vue
<!-- src/pages/index/index.vue -->
<template>
  <view class="container">
    <text class="title">Hello, UniApp!</text>
    <text>Count: {{ count }}</text>
    <button @click="increment">+1</button>
  </view>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const count = ref(0)

const increment = () => {
  count.value++
}
</script>

<style scoped>
.container {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;
}

.title {
  font-size: 24px;
  margin-bottom: 20px;
}
</style>
```

## Taro vs UniApp

| 特性 | Taro | UniApp |
|------|------|--------|
| 语法 | React / Vue | Vue |
| App 支持 | React Native | 原生渲染 |
| 生态 | Taro UI | uView, uni-ui |
| 调试工具 | 微信开发者工具 | HBuilderX |
| 学习曲线 | React 用户友好 | Vue 用户友好 |

# Taro

[Taro](https://taro.zone/) 是一个开放式跨端跨框架解决方案，支持使用 React/Vue 开发微信/京东/百度/支付宝/字节跳动等小程序。

## 可用模板

### Taro + React (推荐)

```bash
x new my-taro-app
# 选择 Taro → Taro + React (recommended)
```

**特点：**
- 使用 React 语法
- TypeScript 支持
- 跨多端小程序

### Taro + Vue3

```bash
x new my-taro-app
# 选择 Taro → Taro + Vue3
```

**特点：**
- 使用 Vue 3 语法
- TypeScript 支持

## 支持的平台

| 平台 | 支持 |
|------|------|
| 微信小程序 | ✅ |
| 支付宝小程序 | ✅ |
| 百度小程序 | ✅ |
| 字节跳动小程序 | ✅ |
| QQ 小程序 | ✅ |
| 京东小程序 | ✅ |
| H5 | ✅ |
| React Native | ✅ |

## 创建后

```bash
cd my-taro-app

# 安装依赖
xi

# 开发微信小程序
xr dev:weapp

# 开发 H5
xr dev:h5

# 构建微信小程序
xr build:weapp

# 构建 H5
xr build:h5
```

## 项目结构

```
my-taro-app/
├── src/
│   ├── pages/
│   │   └── index/
│   │       ├── index.tsx
│   │       ├── index.scss
│   │       └── index.config.ts
│   ├── app.tsx
│   ├── app.scss
│   ├── app.config.ts
│   └── index.html
├── config/
│   ├── dev.ts
│   ├── prod.ts
│   └── index.ts
├── project.config.json
├── package.json
└── tsconfig.json
```

## 开发命令对照

| 平台 | 开发命令 | 构建命令 |
|------|----------|----------|
| 微信小程序 | `xr dev:weapp` | `xr build:weapp` |
| 支付宝小程序 | `xr dev:alipay` | `xr build:alipay` |
| 百度小程序 | `xr dev:swan` | `xr build:swan` |
| 字节跳动小程序 | `xr dev:tt` | `xr build:tt` |
| QQ 小程序 | `xr dev:qq` | `xr build:qq` |
| 京东小程序 | `xr dev:jd` | `xr build:jd` |
| H5 | `xr dev:h5` | `xr build:h5` |

## 示例代码

```tsx
// src/pages/index/index.tsx
import { View, Text, Button } from '@tarojs/components'
import { useState } from 'react'
import './index.scss'

export default function Index() {
  const [count, setCount] = useState(0)

  return (
    <View className="index">
      <Text>Hello, Taro!</Text>
      <Text>Count: {count}</Text>
      <Button onClick={() => setCount(count + 1)}>+1</Button>
    </View>
  )
}
```

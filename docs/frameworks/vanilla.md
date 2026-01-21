# Vanilla

使用 Vite 创建纯 JavaScript/TypeScript 项目，不依赖任何前端框架。

## 创建项目

```bash
x new my-app
# 选择 Vanilla (JS/TS) → Vite
```

## 特点

- 基于 Vite 构建
- 默认使用 TypeScript
- 无框架依赖
- 适合学习原生开发
- 适合构建工具库/组件库

## 适用场景

- 🎓 学习 JavaScript/TypeScript
- 📦 开发工具库
- 🧩 开发 Web Components
- 🔧 小型工具页面
- 📚 代码示例/Demo

## 创建后

```bash
cd my-app

# 安装依赖
xi

# 启动开发服务器
xr dev

# 构建生产版本
xr build
```

## 项目结构

```
my-app/
├── src/
│   ├── counter.ts
│   ├── main.ts
│   ├── style.css
│   ├── typescript.svg
│   └── vite-env.d.ts
├── public/
│   └── vite.svg
├── index.html
├── package.json
├── tsconfig.json
└── vite.config.ts
```

## 示例代码

### main.ts

```typescript
import './style.css'
import { setupCounter } from './counter'

document.querySelector<HTMLDivElement>('#app')!.innerHTML = `
  <div>
    <h1>Hello Vite!</h1>
    <button id="counter" type="button"></button>
  </div>
`

setupCounter(document.querySelector<HTMLButtonElement>('#counter')!)
```

### counter.ts

```typescript
export function setupCounter(element: HTMLButtonElement) {
  let counter = 0
  const setCounter = (count: number) => {
    counter = count
    element.innerHTML = `count is ${counter}`
  }
  element.addEventListener('click', () => setCounter(counter + 1))
  setCounter(0)
}
```

## 扩展为其他用途

### 开发工具库

```bash
# 添加构建库的配置
xi vite-plugin-dts -D
```

```typescript
// vite.config.ts
import { defineConfig } from 'vite'
import dts from 'vite-plugin-dts'

export default defineConfig({
  build: {
    lib: {
      entry: 'src/index.ts',
      name: 'MyLib',
      fileName: 'my-lib'
    }
  },
  plugins: [dts()]
})
```

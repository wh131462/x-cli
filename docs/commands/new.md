# x new

创建新的前端项目。

## 用法

```bash
x new <project-name>
```

## 参数

| 参数 | 描述 |
|------|------|
| `project-name` | 项目名称，会自动转换为 kebab-case |

## 示例

```bash
# 创建名为 my-app 的项目
x new my-app

# 项目名会自动转换为 kebab-case
x new MyApp  # → 创建 my-app
```

## 交互流程

1. **检查目录** - 如果同名目录已存在，询问是否删除
2. **选择框架** - Vue、React、Angular、Vanilla、Taro、UniApp
3. **选择模板** - 根据框架提供不同选项
4. **执行创建** - 使用对应框架 CLI 创建项目
5. **初始化工具** - 可选配置开发工具

## 支持的框架和模板

### Vue

| 模板 | 描述 | 底层命令 |
|------|------|----------|
| create-vue | Vite 构建 (推荐) | `npx create-vue` |
| @vue/cli | Webpack 构建 | `npx @vue/cli create` |

### React

| 模板 | 描述 | 底层命令 |
|------|------|----------|
| Vite | Vite + TypeScript (推荐) | `npx create-vite --template react-ts` |
| create-react-app | CRA + TypeScript | `npx create-react-app --template typescript` |
| Next.js | React 全栈框架 | `npx create-next-app@latest` |

### Angular

| 模板 | 描述 | 底层命令 |
|------|------|----------|
| @angular/cli | 官方 CLI | `npx @angular/cli new` |

### Vanilla

| 模板 | 描述 | 底层命令 |
|------|------|----------|
| Vite | Vite + TypeScript | `npx create-vite --template vanilla-ts` |

### Taro (小程序)

| 模板 | 描述 | 底层命令 |
|------|------|----------|
| Taro + React | React + TypeScript (推荐) | `npx @tarojs/cli init` |
| Taro + Vue3 | Vue 3 + TypeScript | `npx @tarojs/cli init` |

### UniApp (小程序)

| 模板 | 描述 | 底层命令 |
|------|------|----------|
| Vue3 + Vite + TS | TypeScript 版本 (推荐) | `npx degit dcloudio/uni-preset-vue#vite-ts` |
| Vue3 + Vite | JavaScript 版本 | `npx degit dcloudio/uni-preset-vue#vite` |

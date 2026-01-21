# Vue

X-CLI 支持使用两种方式创建 Vue 项目。

## 可用模板

### create-vue (推荐)

使用 Vite 构建，官方推荐的创建方式：

```bash
x new my-vue-app
# 选择 Vue → create-vue (Vite, recommended)
```

**特点：**
- 基于 Vite，启动速度快
- 官方维护，与 Vue 版本同步
- 支持 TypeScript、JSX、Vue Router、Pinia 等选项

### @vue/cli

使用 Webpack 构建的传统方式：

```bash
x new my-vue-app
# 选择 Vue → @vue/cli (Webpack)
```

**特点：**
- 基于 Webpack
- 丰富的插件生态
- 适合需要复杂 Webpack 配置的项目

## 创建选项

使用 create-vue 时，会提示选择：

- ✅ TypeScript 支持
- ✅ JSX 支持
- ✅ Vue Router
- ✅ Pinia 状态管理
- ✅ Vitest 单元测试
- ✅ E2E 测试
- ✅ ESLint
- ✅ Prettier

## 创建后

```bash
cd my-vue-app

# 安装依赖
xi

# 启动开发服务器
xr dev

# 构建生产版本
xr build
```

## 推荐配置

结合 X-CLI 的插件功能：

```bash
# 创建项目时选择初始化开发工具
# 或手动配置
x plugin install eslint prettier husky commitLint lint-staged
```

## 项目结构

```
my-vue-app/
├── src/
│   ├── assets/
│   ├── components/
│   ├── views/
│   ├── router/
│   ├── stores/
│   ├── App.vue
│   └── main.ts
├── public/
├── index.html
├── package.json
├── tsconfig.json
└── vite.config.ts
```

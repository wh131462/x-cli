# Angular

X-CLI 使用 Angular CLI 创建 Angular 项目。

## 创建项目

```bash
x new my-angular-app
# 选择 Angular → @angular/cli
```

## 特点

- 使用 Angular CLI (`@angular/cli`)
- 完整的 Angular 开发环境
- 包含 TypeScript 配置
- 内置测试框架配置
- 企业级架构

## Angular CLI 选项

创建过程中，Angular CLI 会询问：

1. **路由** - 是否添加 Angular routing
2. **样式格式** - CSS、SCSS、Sass、Less 等

## 创建后

```bash
cd my-angular-app

# 安装依赖
xi

# 启动开发服务器
xr start

# 构建生产版本
xr build

# 运行测试
xr test
```

## 项目结构

```
my-angular-app/
├── src/
│   ├── app/
│   │   ├── app.component.ts
│   │   ├── app.component.html
│   │   ├── app.component.css
│   │   ├── app.module.ts
│   │   └── app-routing.module.ts
│   ├── assets/
│   ├── environments/
│   ├── index.html
│   ├── main.ts
│   └── styles.css
├── angular.json
├── package.json
├── tsconfig.json
└── tsconfig.app.json
```

## 常用命令

```bash
# 生成组件
npx ng generate component my-component

# 生成服务
npx ng generate service my-service

# 生成模块
npx ng generate module my-module

# 运行 E2E 测试
xr e2e
```

## 推荐工作流

```bash
# 1. 创建项目
x new my-angular-app

# 2. 进入项目
cd my-angular-app

# 3. 初始化开发工具
x plugin init

# 4. 开始开发
xr start
```

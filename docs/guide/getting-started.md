# 快速开始

## 安装

使用 npm 全局安装 X-CLI：

```bash
npm install -g @eternalheart/x-cli
```

或者使用其他包管理器：

::: code-group

```bash [yarn]
yarn global add @eternalheart/x-cli
```

```bash [pnpm]
pnpm add -g @eternalheart/x-cli
```

```bash [bun]
bun add -g @eternalheart/x-cli
```

:::

## 验证安装

```bash
x --version
```

## 创建第一个项目

```bash
x new my-app
```

按照交互提示选择：

1. **选择框架** - Vue、React、Angular、Vanilla、Taro 或 UniApp
2. **选择模板** - 根据框架提供不同的项目模板
3. **是否初始化开发工具** - 可选配置 ESLint、Prettier 等

## 使用包管理器命令

X-CLI 提供了统一的包管理器命令，会自动检测项目使用的包管理器：

```bash
# 安装依赖
xi                  # 安装所有依赖
xi lodash           # 安装指定包
xi lodash -D        # 安装为 devDependency
xi lodash -g        # 全局安装

# 卸载依赖
xu lodash           # 卸载指定包
xu lodash -g        # 全局卸载

# 运行脚本
xr dev              # 运行 dev 脚本
xr build            # 运行 build 脚本
```

## 配置开发工具

```bash
# 交互式初始化所有工具
x plugin init

# 或安装指定工具
x plugin install eslint prettier husky
```

## 启动 AI 工作区

```bash
# 启动 AI 助手
xa

# 首次使用需要配置 API Key
xa --config

# 管理多个 AI 提供商
xa --manage
```

## 下一步

- 了解 [为什么选择 X-CLI](/guide/why)
- 查看 [命令参考](/commands/overview)
- 探索 [框架支持](/frameworks/overview)

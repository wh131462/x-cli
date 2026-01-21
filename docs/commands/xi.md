# xi - 安装依赖

统一的依赖安装命令，自动检测并使用项目对应的包管理器。

## 用法

```bash
xi [package] [-D] [-g]
```

## 参数

| 参数 | 描述 |
|------|------|
| `package` | 要安装的包名（可选，不指定则安装所有依赖） |
| `-D` | 安装为 devDependency |
| `-g` | 全局安装 |

## 示例

```bash
# 安装所有依赖
xi

# 安装指定包
xi lodash

# 安装多个包
xi lodash dayjs axios

# 安装为 devDependency
xi eslint -D
xi typescript @types/node -D

# 全局安装
xi typescript -g
```

## 等效命令对照

### 安装所有依赖

| xi 命令 | npm | yarn | pnpm | bun |
|---------|-----|------|------|-----|
| `xi` | `npm install` | `yarn` | `pnpm install` | `bun install` |

### 安装指定包

| xi 命令 | npm | yarn | pnpm | bun |
|---------|-----|------|------|-----|
| `xi lodash` | `npm install lodash` | `yarn add lodash` | `pnpm add lodash` | `bun add lodash` |

### 安装为 devDependency

| xi 命令 | npm | yarn | pnpm | bun |
|---------|-----|------|------|-----|
| `xi lodash -D` | `npm install lodash -D` | `yarn add lodash -D` | `pnpm add lodash -D` | `bun add lodash -d` |

### 全局安装

| xi 命令 | npm | yarn | pnpm | bun |
|---------|-----|------|------|-----|
| `xi lodash -g` | `npm install lodash -g` | `yarn global add lodash` | `pnpm add lodash -g` | `bun add lodash -g` |

## 包管理器检测

`xi` 会按以下顺序检测使用哪个包管理器：

1. `package.json` 的 `packageManager` 字段
2. 锁文件（pnpm-lock.yaml → yarn.lock → bun.lockb → package-lock.json）
3. 全局安装检测（pnpm > yarn > bun > npm）
4. 默认使用 npm

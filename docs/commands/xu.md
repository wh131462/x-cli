# xu - 卸载依赖

统一的依赖卸载命令，自动检测并使用项目对应的包管理器。

## 用法

```bash
xu <package> [-g]
```

## 参数

| 参数 | 描述 |
|------|------|
| `package` | 要卸载的包名（必填） |
| `-g` | 全局卸载 |

## 示例

```bash
# 卸载指定包
xu lodash

# 卸载多个包
xu lodash dayjs axios

# 全局卸载
xu typescript -g
```

## 等效命令对照

### 卸载包

| xu 命令 | npm | yarn | pnpm | bun |
|---------|-----|------|------|-----|
| `xu lodash` | `npm uninstall lodash` | `yarn remove lodash` | `pnpm remove lodash` | `bun remove lodash` |

### 全局卸载

| xu 命令 | npm | yarn | pnpm | bun |
|---------|-----|------|------|-----|
| `xu lodash -g` | `npm uninstall lodash -g` | `yarn global remove lodash` | `pnpm remove lodash -g` | `bun remove lodash -g` |

## 包管理器检测

`xu` 会按以下顺序检测使用哪个包管理器：

1. `package.json` 的 `packageManager` 字段
2. 锁文件（pnpm-lock.yaml → yarn.lock → bun.lockb → package-lock.json）
3. 全局安装检测（pnpm > yarn > bun > npm）
4. 默认使用 npm

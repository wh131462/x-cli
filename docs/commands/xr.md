# xr - 运行脚本

统一的脚本运行命令，自动检测并使用项目对应的包管理器。

## 用法

```bash
xr [script] [args...]
```

## 参数

| 参数     | 描述                                  |
| -------- | ------------------------------------- |
| `script` | package.json 中定义的脚本名称（可选） |
| `args`   | 传递给脚本的额外参数                  |

## 交互式选择

当不指定脚本名称时，`xr` 会列出当前项目 `package.json` 中所有可用的脚本，支持上下键选择后执行：

```bash
# 进入交互式选择模式
xr

# 输出示例：
# ? 请选择要运行的脚本: (Use arrow keys)
# ❯ dev                  → vite
#   build                → vite build
#   preview              → vite preview
#   test                 → vitest
#   lint                 → eslint .
```

## 示例

```bash
# 交互式选择脚本
xr

# 运行 dev 脚本
xr dev

# 运行 build 脚本
xr build

# 运行测试
xr test

# 传递额外参数
xr test --coverage
xr build --mode production
```

## 等效命令对照

| xr 命令    | npm             | yarn         | pnpm         | bun             |
| ---------- | --------------- | ------------ | ------------ | --------------- |
| `xr dev`   | `npm run dev`   | `yarn dev`   | `pnpm dev`   | `bun run dev`   |
| `xr build` | `npm run build` | `yarn build` | `pnpm build` | `bun run build` |
| `xr test`  | `npm run test`  | `yarn test`  | `pnpm test`  | `bun run test`  |

## 包管理器检测

`xr` 会按以下顺序检测使用哪个包管理器：

1. `package.json` 的 `packageManager` 字段
2. 锁文件（pnpm-lock.yaml → yarn.lock → bun.lockb → package-lock.json）
3. 全局安装检测（pnpm > yarn > bun > npm）
4. 默认使用 npm

## 查看可用脚本

你可以在 `package.json` 的 `scripts` 字段中查看所有可用脚本：

```json
{
    "scripts": {
        "dev": "vite",
        "build": "vite build",
        "preview": "vite preview",
        "test": "vitest",
        "lint": "eslint ."
    }
}
```

然后使用 `xr` 运行：

```bash
xr dev      # 启动开发服务器
xr build    # 构建生产版本
xr preview  # 预览构建结果
xr test     # 运行测试
xr lint     # 运行代码检查
```

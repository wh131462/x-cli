# x update

更新 X-CLI 到最新版本。

## 用法

```bash
x update
```

## 描述

此命令会检测当前使用的包管理器，并使用对应的命令更新 X-CLI：

| 包管理器 | 执行命令 |
|----------|----------|
| npm | `npm update -g @eternalheart/x-cli` |
| yarn | `yarn global upgrade @eternalheart/x-cli` |
| pnpm | `pnpm update -g @eternalheart/x-cli` |
| bun | `bun update -g @eternalheart/x-cli` |

## 手动更新

如果自动更新失败，可以手动执行：

::: code-group

```bash [npm]
npm update -g @eternalheart/x-cli
```

```bash [yarn]
yarn global upgrade @eternalheart/x-cli
```

```bash [pnpm]
pnpm update -g @eternalheart/x-cli
```

```bash [bun]
bun update -g @eternalheart/x-cli
```

:::

## 查看当前版本

```bash
x --version
```

## 查看最新版本

```bash
npm view @eternalheart/x-cli version
```

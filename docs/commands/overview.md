# 命令概览

X-CLI 提供以下命令：

## 主命令

| 命令                                    | 描述             |
| --------------------------------------- | ---------------- |
| [`x new <name>`](/commands/new)         | 创建新项目       |
| [`x plugin <action>`](/commands/plugin) | 管理开发工具插件 |
| [`x update`](/commands/update)          | 更新 X-CLI       |
| `x doc`                                 | 显示文档         |
| `x --version`                           | 显示版本号       |
| `x --help`                              | 显示帮助信息     |

## 包管理器命令

| 命令                           | 描述     |
| ------------------------------ | -------- |
| [`xi [package]`](/commands/xi) | 安装依赖 |
| [`xu [package]`](/commands/xu) | 卸载依赖 |
| [`xr <script>`](/commands/xr)  | 运行脚本 |

## AI 助手命令

| 命令                  | 描述             |
| --------------------- | ---------------- |
| [`xa`](/commands/xa)  | 启动 AI 工作区   |
| `xa --config`         | 配置 AI 提供商   |
| `xa --manage`         | 管理多个提供商   |
| `xa --info`           | 显示配置信息摘要 |
| `xa --info --verbose` | 显示详细配置     |

## 包管理器检测顺序

X-CLI 按以下顺序检测项目使用的包管理器：

```
1. package.json 的 packageManager 字段
   ↓
2. 锁文件检测
   - pnpm-lock.yaml → pnpm
   - yarn.lock → yarn
   - bun.lockb → bun
   - package-lock.json → npm
   ↓
3. 全局安装检测 (pnpm > yarn > bun > npm)
   ↓
4. 回退到 npm
```

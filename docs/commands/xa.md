# xa - AI 工作区

启动 AI 辅助开发工作区，集成 OpenCode TUI，支持多种大模型提供商。

## 用法

```bash
xa [options]
```

## 选项

| 选项                    | 描述                                   |
| ----------------------- | -------------------------------------- |
| `-p, --provider [name]` | 指定 AI 提供商（不指定则交互选择）     |
| `-m, --model [name]`    | 指定模型（不指定则交互选择）           |
| `-c, --config`          | 运行配置向导                           |
| `--manage`              | 管理多个提供商（添加/切换/编辑/删除）  |
| `--info`                | 显示配置信息摘要                       |
| `--info --verbose`      | 显示详细配置（包括所有 Provider 来源） |

## 首次使用

### 首次运行优化

首次运行 `xa` 时，如果你之前安装过 OpenCode 并配置了全局配置，X-CLI 会自动检测并询问是否导入已有的 Provider 配置，避免重复配置。

### 配置向导

如果是首次使用或需要重新配置：

```bash
xa --config
```

配置向导会引导你：

1. 选择 AI 提供商
2. 配置 API 地址（部分提供商需要）
3. 输入 API Key
4. 选择默认模型

## 支持的提供商

| 提供商             | 模型示例                                         | 说明                   |
| ------------------ | ------------------------------------------------ | ---------------------- |
| **Anthropic**      | claude-sonnet-4-5, claude-opus-4-5               | Claude 系列            |
| **OpenAI**         | gpt-4o, gpt-4o-mini, o1, o3-mini                 | GPT 系列               |
| **Google**         | gemini-2.0-flash, gemini-1.5-pro                 | Gemini 系列            |
| **DeepSeek**       | deepseek-chat, deepseek-coder, deepseek-reasoner | 国产大模型             |
| **Groq**           | llama-3.3-70b-versatile, mixtral-8x7b            | 快速推理               |
| **Azure OpenAI**   | 自定义部署                                       | 企业级                 |
| **Amazon Bedrock** | anthropic.claude-3-5-sonnet                      | AWS 托管               |
| **Ollama**         | llama3.2, codellama                              | 本地模型               |
| **OpenAI 兼容**    | 自定义                                           | 兼容 OpenAI API 的服务 |

## 配置文件位置

X-CLI 的 AI 功能基于 OpenCode，配置存储在三个位置：

| 文件                    | 位置                       | 用途                     | 管理方式                    |
| ----------------------- | -------------------------- | ------------------------ | --------------------------- |
| `opencode.json`         | `<x-cli-root>/`            | X-CLI 专属 Provider 配置 | 手动编辑或 `xa --config`    |
| `opencode.json`         | `~/.config/opencode/`      | OpenCode 全局配置        | 首次运行自动导入或手动编辑  |
| `auth.json`             | `~/.local/share/opencode/` | API Keys                 | `xa --manage` 或 `/connect` |
| `opencode.example.json` | `<x-cli-root>/`            | 配置模板                 | 只读参考                    |

### opencode.json 结构

```json
{
    "$schema": "https://opencode.ai/config.json",
    "provider": {
        "anthropic": {
            "npm": "@ai-sdk/anthropic",
            "name": "Anthropic (AI-in-One Proxy)",
            "options": {
                "baseURL": "https://ai-in.one"
            }
        },
        "deepseek": {
            "options": {
                "baseURL": "https://api.deepseek.com/v1"
            }
        }
    },
    "model": "anthropic/claude-sonnet-4-5"
}
```

### auth.json 结构

```json
{
    "anthropic": {
        "type": "api",
        "key": "sk-ant-..."
    },
    "deepseek": {
        "type": "api",
        "key": "sk-..."
    }
}
```

### 配置优先级

OpenCode 会**合并**多个配置源，而非替换：

1. **Remote config** - `.well-known/opencode` (组织默认配置)
2. **Global config** - `~/.config/opencode/opencode.json` (全局用户配置)
3. **Custom config** - `OPENCODE_CONFIG` 环境变量指定的配置 (X-CLI 使用此方式)
4. **Project config** - 项目根目录的 `opencode.json` (项目特定配置)

:::warning 注意
配置是合并而非替换。后加载的配置只覆盖冲突的键，非冲突项保留。
:::

## 配置管理工作流

### 查看配置状态

```bash
# 查看配置摘要
xa --info

# 查看详细配置（包括所有 Provider 来源）
xa --info --verbose
```

### 配置检查与自动修复

系统会自动检测以下问题：

- **auth-only**: Provider 只在 auth.json 中，配置不完整（**支持自动修复**）
- **missing-key**: Provider 在 config 中但缺少 API Key
- **invalid-model**: 默认模型的 Provider 未配置

当检测到配置不完整的 Provider (auth-only) 时，系统会提示是否立即修复：

```bash
$ xa

[配置警告]
  ⚠ 以下 Provider 只在 auth.json 中存在，配置不完整:
    - tron

  说明: 这些 Provider 的 API Key 已保存，但缺少完整配置
  建议: 立即修复以确保正常使用

? 是否立即修复这些 Provider 配置? (Y/n) Y

[自动修复配置]
检测到 1 个不完整的 Provider 配置

正在修复: tron
  ? 显示名称: Tron (Anthropic 兼容)
  ? API 类型: Anthropic 兼容 (Claude)
  ? API 地址: https://openapi.troncode.cn
  ? 是否添加模型列表? Y
  输入模型名称 (每行一个，输入空行结束):
    模型 1: claude-3-5-sonnet-20241022
    模型 2: claude-3-5-haiku-20241022
    模型 3:
✓ tron 配置已补全

✓ 配置修复完成，现在可以正常使用了
```

## 管理提供商

```bash
xa --manage
```

支持的操作：

- **[list]** 查看已配置的提供商
- **[+]** 添加新的提供商
- **[~]** 切换默认提供商
- **[*]** 修改提供商配置
- **[-]** 删除提供商

### 修改配置后如何生效？

配置在启动时加载，修改后需要注意：

1. **删除 Provider 配置**

    ```bash
    # 方式1: 使用管理命令删除
    xa --manage  # 选择要删除的 provider

    # 方式2: 手动编辑配置文件
    # 编辑 opencode.json 删除 provider 配置
    # 编辑 auth.json 删除对应的 key
    ```

2. **添加新 Provider**

    ```bash
    xa --manage  # 选择 "添加新的 Provider"
    ```

3. **修改 baseURL 或其他选项**
    ```bash
    # 直接编辑 opencode.json, 下次启动生效
    vim <x-cli-root>/opencode.json
    ```

## 常见问题

### Q: 为什么修改了 opencode.json，provider 还是显示旧的？

**A**: 可能原因：

1. **auth.json 中仍有旧的 API Key** - 即使删除了 config 配置，auth.json 中的 provider 仍会被加载
2. **解决方法**: 使用 `xa --manage` 删除不需要的 provider，或手动编辑 `~/.local/share/opencode/auth.json`

### Q: 如何完全清理配置重新开始？

**A**: 删除两个配置文件：

```bash
# 删除 provider 配置
rm <x-cli-root>/opencode.json

# 删除 API keys
rm ~/.local/share/opencode/auth.json

# 重新配置
xa --config
```

### Q: 如何在多个项目间共享 Provider 配置？

**A**: 使用 global config：

```bash
# 编辑全局配置
vim ~/.config/opencode/opencode.json

# 添加 provider 配置，所有项目都会继承
```

## 示例

```bash
# 启动 AI 工作区（使用默认配置）
xa

# 查看配置信息
xa --info

# 查看详细配置
xa --info --verbose

# 交互选择提供商和模型
xa -p

# 指定提供商
xa -p openai

# 指定提供商和模型
xa -p openai -m gpt-4o

# 配置向导
xa --config

# 管理提供商
xa --manage
```

## AI 助手能力

启动后的 AI 助手可以帮助你：

- 📂 读取、分析、修改项目文件
- 🔧 执行终端命令（构建、测试、lint）
- 🐛 调试代码问题，分析错误日志
- 📝 代码重构和优化建议
- 🚀 使用 X-CLI 创建项目和配置工具

### 内置命令

在 AI 工作区中可以使用：

| 命令       | 描述                 |
| ---------- | -------------------- |
| `/help`    | 查看帮助             |
| `/model`   | 切换模型             |
| `/compact` | 压缩对话历史         |
| `/clear`   | 清空对话             |
| `Tab`      | 切换 build/plan 模式 |

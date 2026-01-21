# xa - AI 工作区

启动 AI 辅助开发工作区，集成 OpenCode TUI，支持多种大模型提供商。

## 用法

```bash
xa [options]
```

## 选项

| 选项 | 描述 |
|------|------|
| `-p, --provider [name]` | 指定 AI 提供商（不指定则交互选择） |
| `-m, --model [name]` | 指定模型（不指定则交互选择） |
| `-c, --config` | 运行配置向导 |
| `--manage` | 管理多个提供商（添加/切换/编辑/删除） |

## 首次使用

首次使用需要配置 AI 提供商：

```bash
xa --config
```

配置向导会引导你：

1. 选择 AI 提供商
2. 配置 API 地址（部分提供商需要）
3. 输入 API Key
4. 选择默认模型

## 支持的提供商

| 提供商 | 模型示例 | 说明 |
|--------|----------|------|
| **Anthropic** | claude-sonnet-4-5, claude-opus-4-5 | Claude 系列 |
| **OpenAI** | gpt-4o, gpt-4o-mini, o1, o3-mini | GPT 系列 |
| **Google** | gemini-2.0-flash, gemini-1.5-pro | Gemini 系列 |
| **DeepSeek** | deepseek-chat, deepseek-coder, deepseek-reasoner | 国产大模型 |
| **Groq** | llama-3.3-70b-versatile, mixtral-8x7b | 快速推理 |
| **Azure OpenAI** | 自定义部署 | 企业级 |
| **Amazon Bedrock** | anthropic.claude-3-5-sonnet | AWS 托管 |
| **Ollama** | llama3.2, codellama | 本地模型 |
| **OpenAI 兼容** | 自定义 | 兼容 OpenAI API 的服务 |

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

## 配置文件

配置保存在项目根目录的 `opencode.json`：

```json
{
  "$schema": "https://opencode.ai/config.json",
  "provider": {
    "openai": {
      "options": {
        "apiKey": "sk-xxx",
        "baseURL": "https://api.openai.com/v1"
      }
    }
  },
  "model": "openai/gpt-4o",
  "default_agent": "x-cli"
}
```

## 环境变量

也可以通过环境变量配置：

```bash
# Anthropic
export ANTHROPIC_API_KEY=sk-ant-xxx

# OpenAI
export OPENAI_API_KEY=sk-xxx

# DeepSeek
export DEEPSEEK_API_KEY=sk-xxx

# Google
export GOOGLE_GENERATIVE_AI_API_KEY=xxx
```

## 示例

```bash
# 启动 AI 工作区（使用默认配置）
xa

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

| 命令 | 描述 |
|------|------|
| `/help` | 查看帮助 |
| `/model` | 切换模型 |
| `/compact` | 压缩对话历史 |
| `/clear` | 清空对话 |
| `Tab` | 切换 build/plan 模式 |

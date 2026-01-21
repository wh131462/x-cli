# x plugin

管理开发工具插件。

## 用法

```bash
x plugin <action> [name]
```

## 子命令

### init

交互式初始化所有开发工具：

```bash
x plugin init
```

会依次询问是否安装：

- `.gitignore` - Git 忽略文件
- ESLint - 代码检查
- Prettier - 代码格式化
- lint-staged - Git 暂存区检查
- commitlint - 提交信息规范
- Husky - Git Hooks

### install

安装指定插件：

```bash
# 安装单个插件
x plugin install eslint

# 安装多个插件
x plugin install eslint prettier husky
```

### uninstall

卸载指定插件：

```bash
x plugin uninstall eslint
```

### list

列出所有插件状态：

```bash
x plugin list
```

输出示例：

```
Plugin Status:
✓ gitignore    installed
✓ eslint       installed
✗ prettier     not installed
✓ lint-staged  installed
✓ commitLint   installed
✓ husky        installed
```

## 可用插件

| 插件名 | 描述 | 配置文件 |
|--------|------|----------|
| `gitignore` | 生成 .gitignore 文件 | `.gitignore` |
| `eslint` | ESLint 代码检查 | `eslint.config.js` |
| `prettier` | Prettier 代码格式化 | `.prettierrc` |
| `lint-staged` | lint-staged 配置 | `package.json` |
| `commitLint` | commitlint 提交规范 | `commitlint.config.js` |
| `husky` | Husky Git Hooks | `.husky/` |

## Monorepo 支持

X-CLI 会自动检测 Monorepo 项目，支持以下配置：

- `pnpm-workspace.yaml`
- `lerna.json`
- `nx.json`
- `turbo.json`
- `package.json` 的 `workspaces` 字段

在 Monorepo 中，插件会安装在根目录，并配置正确的范围。

## 推荐配置

一键配置完整的开发工具链：

```bash
x plugin init
```

或手动选择：

```bash
# 最小配置
x plugin install eslint prettier

# 完整配置
x plugin install gitignore eslint prettier lint-staged commitLint husky
```

# X-CLI
X-CLI 是一个用于创建标准项目的命令行工具。它提供了初始化、创建、移除、插件管理以及更新等功能。

## 安装
```bash
npm install @eternalheart/x-cli -g
```

## 使用说明
X-CLI 提供了以下命令：

### 初始化命令
```bash
x init
```
这个命令用于初始化 X-CLI 的依赖。

### 创建新项目
```bash
x new <projectName>
```
创建一个新的项目。

### 创建新组件或文档
```bash
x create <type> <name> [-d <directory>]
```
创建新的组件、指令、管道、服务或文档。可选参数 `-d` 或 `--directory` 用于指定目录。

### 移除组件或文档
```bash
x remove <type> <name> [-d <directory>]
```
移除现有的组件、指令、管道、服务或文档。可选参数 `-d` 或 `--directory` 用于指定目录。

### 插件管理
```bash
x plugin <install|uninstall|list> [pluginName]
```
通过添加、移除或列出来管理插件。

### 更新 X-CLI
```bash
x update
```
更新 X-CLI 到最新稳定版本。

### 安装或卸载依赖
```bash
xi [packageName] [-D] [-g]
xu [packageName] [-g]
```
`xi` 用于安装或卸载项目的依赖，`xu` 用于卸载全局依赖。

### 运行脚本
```shell
xr [script]
```
运行指定的脚本。

### 查看文档
```shell
x doc
```
查看x-cli的文档内容。

## 构建与发布
```bash
npm run build
npm run cli:publish
```

## 提交规范
使用 commitlint 和 cz-conventional-changelog 来确保提交信息的规范性。

```bash
npm run commit
```

## 注意事项
- 请确保在安装 X-CLI 前，您的 Node.js 版本与 X-CLI 兼容。
- 在使用 X-CLI 之前，建议阅读所有文档和示例。

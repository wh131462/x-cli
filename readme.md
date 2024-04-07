## X CLI
前端脚手架项目,用于创建标准化的组件并对一些依赖进行管理.

### 安装

对脚手架进行全局安装.

```shell
npm i -g x-cli --registry http://npm.runtongqiuben.com
```
### 使用

#### 1. 初始化项目

```shell
x new [项目名称]
```

### 2. 创建

```shell
x create [component|directive|pipe|service|doc] [指定名称] [-d/--directory <directory>]
```

### 3. 移除

```shell
x remove [component|directive|pipe|service|doc] [指定名称] [-d/--directory <directory>]
```

### 4. 插件管理

```shell
x plugin [add|remove|list] [plugin名字]
```

### 5. 更新

```shell
x update
```
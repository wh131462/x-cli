/**
 * 插件的返回接口
 *
 * @typedef {Object} IPlugin
 * @prop {(function(): Promise<boolean>)} check - 检查方法
 * @prop {(function(): Promise<unknown>)} install - 安装流程
 * @prop {(function(): Promise<unknown>)} uninstall - 卸载流程
 */
